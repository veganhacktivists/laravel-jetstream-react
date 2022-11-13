import React from 'react'
import Welcome from '@/components/Welcome'
import { AppLayout } from '@/layouts/AppLayout'

const Dashboard = () => {
  return (
    <AppLayout
      title="Dashboard"
      renderHeader={() => (
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Dashboard
        </h2>
      )}
    >
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-xl sm:rounded-lg">
            <Welcome />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Dashboard
