import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface ProgressRingProps {
  totalDebt: number
  paidOff: number
}

export function ProgressRing({ totalDebt, paidOff }: ProgressRingProps) {
  const remaining = totalDebt - paidOff
  const percentPaid = totalDebt > 0 ? Math.round((paidOff / totalDebt) * 100) : 0

  const data = [
    { name: 'Paid', value: paidOff },
    { name: 'Remaining', value: remaining },
  ]

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill="#10b981" />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{percentPaid}%</span>
        <span className="text-sm text-gray-500">paid off</span>
      </div>
    </div>
  )
}
