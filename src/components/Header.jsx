import React from 'react'
import { ExternalLink } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-[1400px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/assets/dogh_logo.png"
            alt="DOGH Logo"
            className="w-14 h-14 object-contain rounded-full bg-white p-1 shadow-md border border-gray-200"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Davao Occidental General Hospital
            </h1>
            <p className="text-gray-500 text-sm font-medium tracking-wide">
              Calendar of Events
            </p>
          </div>
        </div>
        <a
          href="https://dogh-room.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-dogh-primary hover:bg-dogh-secondary text-white font-medium rounded-xl transition-all shadow-md"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden sm:inline">Book Appointment</span>
          <span className="sm:hidden">Book Room</span>
        </a>
      </div>
    </header>
  )
}

export default Header
