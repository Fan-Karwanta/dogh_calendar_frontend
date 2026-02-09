import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Calendar from './components/Calendar'
import Header from './components/Header'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const socket = io(API_URL)

function App() {
  const [events, setEvents] = useState([])
  const [holidays, setHolidays] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const fetchEvents = async (year, month) => {
    try {
      const res = await fetch(`${API_URL}/api/events/month/${year}/${month}`)
      const data = await res.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const fetchHolidays = async (year, month) => {
    try {
      const res = await fetch(`${API_URL}/api/holidays/month/${year}/${month}`)
      const data = await res.json()
      setHolidays(data)
    } catch (error) {
      console.error('Error fetching holidays:', error)
    }
  }

  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    fetchEvents(year, month)
    fetchHolidays(year, month)
  }, [currentDate])

  useEffect(() => {
    socket.on('eventCreated', () => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      fetchEvents(year, month)
    })

    socket.on('eventUpdated', () => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      fetchEvents(year, month)
    })

    socket.on('eventDeleted', (deletedEvent) => {
      setEvents(prev => prev.filter(e => e._id !== deletedEvent._id))
    })

    socket.on('holidayCreated', () => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      fetchHolidays(year, month)
    })

    socket.on('holidayUpdated', () => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      fetchHolidays(year, month)
    })

    socket.on('holidayDeleted', () => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      fetchHolidays(year, month)
    })

    socket.on('holidaysSeeded', () => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      fetchHolidays(year, month)
    })

    socket.on('holidaysCleared', () => {
      setHolidays([])
    })

    return () => {
      socket.off('eventCreated')
      socket.off('eventUpdated')
      socket.off('eventDeleted')
      socket.off('holidayCreated')
      socket.off('holidayUpdated')
      socket.off('holidayDeleted')
      socket.off('holidaysSeeded')
      socket.off('holidaysCleared')
    }
  }, [currentDate])

  const goToPrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-[1400px]">
        <Calendar
          currentDate={currentDate}
          events={events}
          holidays={holidays}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
        />
      </main>
      <footer className="text-center py-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} Davao Occidental General Hospital. All rights reserved.
      </footer>
    </div>
  )
}

export default App
