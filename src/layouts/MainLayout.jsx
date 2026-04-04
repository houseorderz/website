import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { Container } from '../components/Container.jsx'

export default function MainLayout() {
  return (
    <div className="min-h-dvh bg-zinc-50">
      <Navbar />

      <main>
        <Container>
          <Outlet />
        </Container>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <Container className="py-6 text-sm text-zinc-600">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Wearify. All rights reserved.</p>
            <p className="text-zinc-500">Modern clothing essentials.</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}

