import React from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, Clock, MapPin, Star, Calendar as CalendarIcon, Sparkles } from 'lucide-react'

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

  const totalEventsThisMonth = events.length
  const totalHolidaysThisMonth = holidays.length

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-200/50 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-cyan-50/50 border-b border-gray-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dogh-primary/10 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-dogh-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                {MONTHS[month]} {year}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {totalEventsThisMonth} event{totalEventsThisMonth !== 1 ? 's' : ''}
                {totalHolidaysThisMonth > 0 && ` · ${totalHolidaysThisMonth} holiday${totalHolidaysThisMonth !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToday}
              className="px-4 py-2 text-sm font-semibold text-dogh-primary bg-dogh-primary/10 hover:bg-dogh-primary/20 rounded-xl transition-all"
            >
              Today
            </button>
            <button
              onClick={onPrevMonth}
              className="p-2.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNextMonth}
              className="p-2.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-slate-50/80 border-b border-gray-200/80">
          {DAYS.map((day, i) => (
            <div key={day} className={`py-3 text-center text-xs font-bold uppercase tracking-widest ${i === 0 ? 'text-red-400' : 'text-gray-400'}`}>
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
            const isSunday = idx % 7 === 0

            return (
              <div
                key={idx}
                onClick={() => cell.isCurrentMonth && onSelectDate(cell.day)}
                className={`
                  min-h-[120px] sm:min-h-[130px] p-1.5 sm:p-2 border-b border-r border-gray-100/80 cursor-pointer transition-all duration-200 relative group
                  ${cell.isCurrentMonth
                    ? 'hover:bg-cyan-50/40 bg-white'
                    : 'bg-gray-50/30 opacity-30 cursor-default'
                  }
                  ${isSelected ? 'bg-dogh-primary/5 ring-2 ring-inset ring-dogh-primary/30 z-10' : ''}
                  ${isTodayCell && !isSelected ? 'bg-cyan-50/60' : ''}
                  ${hasHoliday && !isSelected ? 'bg-red-50/30' : ''}
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`
                    text-xs sm:text-sm font-semibold inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-all
                    ${isTodayCell
                      ? 'bg-dogh-primary text-white font-bold shadow-md shadow-dogh-primary/30'
                      : isSelected
                        ? 'bg-dogh-primary/10 text-dogh-primary font-bold'
                        : cell.isCurrentMonth
                          ? isSunday ? 'text-red-400' : 'text-gray-700'
                          : 'text-gray-300'
                    }
                  `}>
                    {cell.day}
                  </span>
                  {hasHoliday && (
                    <Star className="w-3 h-3 text-red-400 fill-red-400" />
                  )}
                </div>
                {/* Holidays */}
                {dayHolidays.length > 0 && (
                  <div className="mt-0.5">
                    {dayHolidays.slice(0, 1).map((h, i) => (
                      <div
                        key={h._id || i}
                        className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:py-1 rounded-md bg-red-100/80 text-red-600 font-semibold mb-0.5 leading-tight truncate"
                      >
                        {h.name}
                      </div>
                    ))}
                    {dayHolidays.length > 1 && (
                      <span className="text-[10px] text-red-400 font-medium">+{dayHolidays.length - 1} more</span>
                    )}
                  </div>
                )}
                {/* Events */}
                {dayEvents.length > 0 && (
                  <div className="mt-0.5 space-y-0.5">
                    {dayEvents.slice(0, 2).map((event, i) => (
                      <div
                        key={event._id || i}
                        className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:py-1 rounded-md bg-dogh-primary/8 text-dogh-dark font-medium border-l-2 border-dogh-primary leading-tight truncate"
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-dogh-primary font-medium">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 px-6 py-3 bg-slate-50/80 border-t border-gray-200/80 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded-full bg-dogh-primary"></div>
            <span>Event</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
            <span>Holiday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-lg bg-dogh-primary shadow-sm shadow-dogh-primary/30"></div>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Event Details Sidebar */}
      <div className="lg:w-[380px] bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col">
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-cyan-50/50 border-b border-gray-200/80">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedDate ? 'bg-dogh-primary/10' : 'bg-gray-100'}`}>
              <CalendarIcon className={`w-5 h-5 ${selectedDate ? 'text-dogh-primary' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {selectedDate
                  ? `${MONTHS[month]} ${selectedDate}, ${year}`
                  : 'Select a Date'
                }
              </h3>
              <p className="text-gray-400 text-xs mt-0.5">
                {selectedDate
                  ? `${selectedEvents.length} event${selectedEvents.length !== 1 ? 's' : ''}${selectedHolidays.length > 0 ? ` · ${selectedHolidays.length} holiday${selectedHolidays.length !== 1 ? 's' : ''}` : ''}`
                  : 'Click on a date to view details'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {selectedDate && selectedEvents.length === 0 && selectedHolidays.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No events scheduled</p>
              <p className="text-gray-300 text-xs mt-1">This day is free</p>
            </div>
          )}

          {!selectedDate && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No date selected</p>
              <p className="text-gray-300 text-xs mt-1">Click a date on the calendar</p>
            </div>
          )}

          {/* Holiday cards */}
          {selectedHolidays.map((h) => (
            <div
              key={h._id}
              className="rounded-xl p-4 bg-gradient-to-br from-red-50 to-orange-50/50 border border-red-200/60 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                  {h.type === 'regular' ? 'Regular Holiday' : h.type === 'special' ? 'Special Non-Working Holiday' : 'Observance'}
                </span>
              </div>
              <h4 className="font-bold text-red-800 text-base leading-snug">
                {h.name}
              </h4>
            </div>
          ))}

          {/* Event cards */}
          {selectedEvents.map((event) => (
            <div
              key={event._id}
              className="rounded-xl p-4 bg-white border border-gray-200/80 hover:border-dogh-primary/30 hover:shadow-md hover:shadow-dogh-primary/5 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-1 h-full min-h-[40px] rounded-full bg-dogh-primary/60 flex-shrink-0 mt-0.5"></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-[15px] mb-2.5 leading-snug group-hover:text-dogh-primary transition-colors">
                    {event.title}
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <CalendarDays className="w-3.5 h-3.5 text-dogh-primary/60 flex-shrink-0" />
                      <span className="truncate">{formatDateRange(event)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock className="w-3.5 h-3.5 text-dogh-primary/60 flex-shrink-0" />
                      <span>{event.timeFrom} - {event.timeTo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-dogh-primary/60 flex-shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
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
