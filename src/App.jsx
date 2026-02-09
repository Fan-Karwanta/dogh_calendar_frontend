import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Calendar from './components/Calendar'
import Header from './components/Header'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const socket = io(API_URL)

function App() {
  const [events, setEvents] = useState([])
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

  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    fetchEvents(year, month)
  }, [currentDate])

  useEffect(() => {
    socket.on('eventCreated', (event) => {
      const eventDate = new Date(event.date)
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
        setEvents(prev => [...prev, event])
      }
    })

    socket.on('eventUpdated', (updatedEvent) => {
      setEvents(prev => prev.map(e => e._id === updatedEvent._id ? updatedEvent : e))
    })

    socket.on('eventDeleted', (deletedEvent) => {
      setEvents(prev => prev.filter(e => e._id !== deletedEvent._id))
    })

    return () => {
      socket.off('eventCreated')
      socket.off('eventUpdated')
      socket.off('eventDeleted')
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
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/dogh_background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-dogh-dark/85 via-dogh-secondary/80 to-dogh-primary/75 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
          <Calendar
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onPrevMonth={goToPrevMonth}
            onNextMonth={goToNextMonth}
            onToday={goToToday}
          />
        </main>
        <footer className="text-center py-4 text-cyan-200/60 text-sm">
          © {new Date().getFullYear()} Davao Occidental General Hospital. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

export default App
