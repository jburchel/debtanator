import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  )
}
