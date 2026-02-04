import { NextResponse } from 'next/server'

export async function GET() {
  // Mock department costs based on employee data
  const departments = [
    {
      department: 'Clinico',
      amount: 177048,
      percentage: 55,
      employees: 4
    },
    {
      department: 'Amministrazione',
      amount: 65522,
      percentage: 20,
      employees: 1
    },
    {
      department: 'Segreteria',
      amount: 58552,
      percentage: 18,
      employees: 2
    },
    {
      department: 'Direzione',
      amount: 22000,
      percentage: 7,
      employees: 1
    }
  ]

  return NextResponse.json({
    departments,
    total: departments.reduce((sum, d) => sum + d.amount, 0)
  })
}
