import React from 'react'
import { ExternalLink, CalendarDays } from 'lucide-react'

function Header() {
  return (
    <header className="bg-gradient-to-r from-dogh-dark via-dogh-secondary to-dogh-primary shadow-lg">
      <div className="container mx-auto px-4 py-0 max-w-[1400px]">
        <div className="flex items-center justify-between h-[72px]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="/assets/dogh_logo.png"
                alt="DOGH Logo"
                className="w-12 h-12 object-contain rounded-xl bg-white/95 p-1.5 shadow-lg ring-2 ring-white/20"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-dogh-dark"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
                Davao Occidental General Hospital
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CalendarDays className="w-3 h-3 text-cyan-300" />
                <p className="text-cyan-200/80 text-xs font-medium tracking-wider uppercase">
                  Calendar of Events
                </p>
              </div>
            </div>
          </div>
          <a
            href="https://dogh-room.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl transition-all backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-lg"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Book Appointment</span>
            <span className="sm:hidden text-sm">Book</span>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
