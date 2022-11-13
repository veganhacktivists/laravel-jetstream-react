import React from 'react'
import { APITokenManager } from '@/pages/api/partials/APITokenManager'
import { AppLayout } from '@/layouts/AppLayout'
import { ApiToken } from '@/types'

interface Props {
  tokens: ApiToken[]
  availablePermissions: string[]
  defaultPermissions: string[]
}

const ApiTokenIndex: React.FC<Props> = ({
  tokens,
  availablePermissions,
  defaultPermissions,
}) => {
  return (
    <AppLayout title="API Tokens">
      <div>
        <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
          <APITokenManager
            tokens={tokens}
            availablePermissions={availablePermissions}
            defaultPermissions={defaultPermissions}
          />
        </div>
      </div>
    </AppLayout>
  )
}

export default ApiTokenIndex
