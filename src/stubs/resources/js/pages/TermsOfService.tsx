import React from 'react'
import { AuthenticationCardLogo } from '@/components/AuthenticationCardLogo'
import { Head } from '@inertiajs/inertia-react'

interface Props {
  terms: string
}

const TermsOfService: React.FC<Props> = ({ terms }) => {
  return (
    <div className="font-sans text-gray-900 antialiased">
      <Head title="Terms of Service" />

      <div className="bg-gray-100 pt-4">
        <div className="flex min-h-screen flex-col items-center pt-6 sm:pt-0">
          <div>
            <AuthenticationCardLogo />
          </div>

          <div
            className="prose mt-6 w-full overflow-hidden bg-white p-6 shadow-md sm:max-w-2xl sm:rounded-lg"
            dangerouslySetInnerHTML={{ __html: terms }}
          />
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
