import { Card, CardContent } from '@/components/ui'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  sublabel?: string
  icon?: LucideIcon
}

export function StatCard({ label, value, sublabel, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
          </div>
          {Icon && (
            <div className="p-2 bg-primary-50 rounded-lg">
              <Icon className="w-5 h-5 text-primary-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
