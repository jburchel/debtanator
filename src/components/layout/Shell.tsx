import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function Shell() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white pb-20">
      <main className="container mx-auto max-w-lg px-4 py-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
