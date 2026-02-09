import React from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, Clock, MapPin } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function Calendar({ currentDate, events, selectedDate, onSelectDate, onPrevMonth, onNextMonth, onToday }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const getEventsForDate = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
    })
  }

  const isToday = (day) => {
    return day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  // Build calendar grid
  const calendarCells = []

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({ day: daysInPrevMonth - i, isCurrentMonth: false })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({ day: i, isCurrentMonth: true })
  }

  // Next month leading days
  const remaining = 42 - calendarCells.length
  for (let i = 1; i <= remaining; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Calendar Grid */}
      <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-6 h-6 text-cyan-300" />
            <h2 className="text-2xl font-bold text-white">
              {MONTHS[month]} {year}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToday}
              className="px-4 py-2 text-sm font-medium text-cyan-200 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              Today
            </button>
            <button
              onClick={onPrevMonth}
              className="p-2 text-cyan-200 hover:bg-white/15 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNextMonth}
              className="p-2 text-cyan-200 hover:bg-white/15 rounded-lg transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-white/5">
          {DAYS.map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-cyan-200/80 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarCells.map((cell, idx) => {
            const dayEvents = cell.isCurrentMonth ? getEventsForDate(cell.day) : []
            const isTodayCell = cell.isCurrentMonth && isToday(cell.day)
            const isSelected = cell.isCurrentMonth && selectedDate === cell.day

            return (
              <div
                key={idx}
                onClick={() => cell.isCurrentMonth && onSelectDate(cell.day)}
                className={`
                  min-h-[90px] p-2 border border-white/5 cursor-pointer transition-all relative
                  ${cell.isCurrentMonth
                    ? 'hover:bg-white/10'
                    : 'opacity-30 cursor-default'
                  }
                  ${isSelected ? 'bg-cyan-500/20 ring-2 ring-cyan-400/50' : ''}
                  ${isTodayCell ? 'bg-white/10' : ''}
                `}
              >
                <span className={`
                  text-sm font-medium inline-flex items-center justify-center w-7 h-7 rounded-full
                  ${isTodayCell
                    ? 'bg-cyan-500 text-white font-bold'
                    : cell.isCurrentMonth
                      ? 'text-white/90'
                      : 'text-white/30'
                  }
                `}>
                  {cell.day}
                </span>
                {dayEvents.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event, i) => (
                      <div
                        key={event._id || i}
                        className="text-xs px-2 py-1 rounded-md bg-cyan-500/30 text-cyan-100 truncate font-medium border border-cyan-400/20"
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-cyan-300/70 pl-2">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Event Details Sidebar */}
      <div className="lg:w-80 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-white/5 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">
            {selectedDate
              ? `${MONTHS[month]} ${selectedDate}, ${year}`
              : 'Select a Date'
            }
          </h3>
          <p className="text-cyan-200/60 text-sm mt-1">
            {selectedDate
              ? `${selectedEvents.length} event${selectedEvents.length !== 1 ? 's' : ''}`
              : 'Click on a date to view events'
            }
          </p>
        </div>

        <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
          {selectedDate && selectedEvents.length === 0 && (
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-cyan-300/30 mx-auto mb-3" />
              <p className="text-cyan-200/50 text-sm">No events scheduled</p>
            </div>
          )}

          {!selectedDate && (
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-cyan-300/30 mx-auto mb-3" />
              <p className="text-cyan-200/50 text-sm">Select a date to view events</p>
            </div>
          )}

          {selectedEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all"
            >
              <h4 className="font-semibold text-white text-base mb-3">
                {event.title}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-200/80 text-sm">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{event.timeFrom} - {event.timeTo}</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-200/80 text-sm">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>{event.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calendar
