import React from 'react'
import { DeleteUserForm } from '@/pages/profile/partials/DeleteUserForm'
import { LogoutOtherBrowserSessions } from '@/pages/profile/partials/LogoutOtherBrowserSessionsForm'
import { TwoFactorAuthenticationForm } from '@/pages/profile/partials/TwoFactorAuthenticationForm'
import { UpdatePasswordForm } from '@/pages/profile/partials/UpdatePasswordForm'
import { UpdateProfileInformationForm } from '@/pages/profile/partials/UpdateProfileInformationForm'
import { useTypedPage } from '@/hooks/useTypedPage'
import { SectionBorder } from '@/components/SectionBorder'
import { AppLayout } from '@/layouts/AppLayout'
import { Session } from '@/types'

interface Props {
  sessions: Session[]
  confirmsTwoFactorAuthentication: boolean
}

const Show: React.FC<Props> = ({
  sessions,
  confirmsTwoFactorAuthentication,
}) => {
  const page = useTypedPage()

  return (
    <AppLayout
      title="Profile"
      renderHeader={() => (
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Profile
        </h2>
      )}
    >
      <div>
        <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
          {page.props.jetstream.canUpdateProfileInformation ? (
            <div>
              <UpdateProfileInformationForm user={page.props.user} />

              <SectionBorder />
            </div>
          ) : null}

          {page.props.jetstream.canUpdatePassword ? (
            <div className="mt-10 sm:mt-0">
              <UpdatePasswordForm />

              <SectionBorder />
            </div>
          ) : null}

          {page.props.jetstream.canManageTwoFactorAuthentication ? (
            <div className="mt-10 sm:mt-0">
              <TwoFactorAuthenticationForm
                requiresConfirmation={confirmsTwoFactorAuthentication}
              />

              <SectionBorder />
            </div>
          ) : null}

          <div className="mt-10 sm:mt-0">
            <LogoutOtherBrowserSessions sessions={sessions} />
          </div>

          {page.props.jetstream.hasAccountDeletionFeatures ? (
            <>
              <SectionBorder />

              <div className="mt-10 sm:mt-0">
                <DeleteUserForm />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </AppLayout>
  )
}

export default Show
