import React from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, Clock, MapPin, Star } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function Calendar({ currentDate, events, holidays = [], selectedDate, onSelectDate, onPrevMonth, onNextMonth, onToday }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const getEventsForDate = (day) => {
    const cellDate = new Date(year, month, day)
    return events.filter(event => {
      const from = new Date(event.dateFrom)
      const to = new Date(event.dateTo)
      from.setHours(0, 0, 0, 0)
      to.setHours(23, 59, 59, 999)
      return cellDate >= from && cellDate <= to
    })
  }

  const getHolidaysForDate = (day) => {
    return holidays.filter(h => {
      const hDate = new Date(h.date)
      return hDate.getDate() === day &&
        hDate.getMonth() === month &&
        hDate.getFullYear() === year
    })
  }

  const isToday = (day) => {
    return day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []
  const selectedHolidays = selectedDate ? getHolidaysForDate(selectedDate) : []

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

  const formatDateRange = (event) => {
    const from = new Date(event.dateFrom)
    const to = new Date(event.dateTo)
    const sameDay = from.toDateString() === to.toDateString()
    if (sameDay) {
      return from.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    return `${from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-6 h-6 text-dogh-primary" />
            <h2 className="text-2xl font-bold text-gray-900">
              {MONTHS[month]} {year}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToday}
              className="px-4 py-2 text-sm font-medium text-dogh-primary bg-dogh-light hover:bg-cyan-100 rounded-lg transition-all border border-cyan-200"
            >
              Today
            </button>
            <button
              onClick={onPrevMonth}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNextMonth}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {DAYS.map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarCells.map((cell, idx) => {
            const dayEvents = cell.isCurrentMonth ? getEventsForDate(cell.day) : []
            const dayHolidays = cell.isCurrentMonth ? getHolidaysForDate(cell.day) : []
            const isTodayCell = cell.isCurrentMonth && isToday(cell.day)
            const isSelected = cell.isCurrentMonth && selectedDate === cell.day
            const hasHoliday = dayHolidays.length > 0

            return (
              <div
                key={idx}
                onClick={() => cell.isCurrentMonth && onSelectDate(cell.day)}
                className={`
                  min-h-[130px] p-2 border border-gray-100 cursor-pointer transition-all relative
                  ${cell.isCurrentMonth
                    ? 'hover:bg-gray-50 bg-white'
                    : 'bg-gray-50/50 opacity-40 cursor-default'
                  }
                  ${isSelected ? 'bg-cyan-50 ring-2 ring-dogh-primary/40' : ''}
                  ${isTodayCell ? 'bg-cyan-50/50' : ''}
                  ${hasHoliday ? 'bg-red-50/40' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className={`
                    text-sm font-semibold inline-flex items-center justify-center w-7 h-7 rounded-full
                    ${isTodayCell
                      ? 'bg-dogh-primary text-white font-bold'
                      : cell.isCurrentMonth
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }
                  `}>
                    {cell.day}
                  </span>
                  {hasHoliday && (
                    <Star className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  )}
                </div>
                {/* Holidays */}
                {dayHolidays.length > 0 && (
                  <div className="mt-1">
                    {dayHolidays.map((h, i) => (
                      <div
                        key={h._id || i}
                        className="text-xs px-2 py-1 rounded-md bg-red-100 text-red-700 font-semibold mb-1 leading-tight"
                      >
                        {h.name}
                      </div>
                    ))}
                  </div>
                )}
                {/* Events */}
                {dayEvents.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayEvents.map((event, i) => (
                      <div
                        key={event._id || i}
                        className="text-xs px-2 py-1 rounded-md bg-dogh-primary/10 text-dogh-dark font-medium border border-dogh-primary/20 leading-tight"
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-dogh-primary/10 border border-dogh-primary/20"></div>
            <span>Event</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
            <span>Holiday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-dogh-primary"></div>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Event Details Sidebar */}
      <div className="lg:w-96 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            {selectedDate
              ? `${MONTHS[month]} ${selectedDate}, ${year}`
              : 'Select a Date'
            }
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {selectedDate
              ? `${selectedEvents.length} event${selectedEvents.length !== 1 ? 's' : ''}${selectedHolidays.length > 0 ? ` · ${selectedHolidays.length} holiday${selectedHolidays.length !== 1 ? 's' : ''}` : ''}`
              : 'Click on a date to view events'
            }
          </p>
        </div>

        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
          {selectedDate && selectedEvents.length === 0 && selectedHolidays.length === 0 && (
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No events scheduled</p>
            </div>
          )}

          {!selectedDate && (
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Select a date to view events</p>
            </div>
          )}

          {/* Holiday cards */}
          {selectedHolidays.map((h) => (
            <div
              key={h._id}
              className="bg-red-50 rounded-xl p-4 border border-red-200"
            >
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-red-500 fill-red-500" />
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                  {h.type === 'regular' ? 'Regular Holiday' : h.type === 'special' ? 'Special Non-Working Holiday' : 'Observance'}
                </span>
              </div>
              <h4 className="font-bold text-red-800 text-base">
                {h.name}
              </h4>
            </div>
          ))}

          {/* Event cards */}
          {selectedEvents.map((event) => (
            <div
              key={event._id}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:bg-gray-100 transition-all"
            >
              <h4 className="font-semibold text-gray-900 text-base mb-3">
                {event.title}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <CalendarDays className="w-4 h-4 text-dogh-primary" />
                  <span>{formatDateRange(event)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock className="w-4 h-4 text-dogh-primary" />
                  <span>{event.timeFrom} - {event.timeTo}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 text-dogh-primary" />
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
