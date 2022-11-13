import { useForm } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback, useRef, useState } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { ActionMessage } from '@/components/ActionMessage'
import { ActionSection } from '@/components/ActionSection'
import { DialogModal } from '@/components/DialogModal'
import { InputError } from '@/components/InputError'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SecondaryButton } from '@/components/SecondaryButton'
import { Session } from '@/types'
import { PasswordInput } from '@/components/forms/PasswordInput'

interface Props {
  sessions: Session[]
}

export const LogoutOtherBrowserSessions: React.FC<Props> = ({ sessions }) => {
  const [confirmingLogout, setConfirmingLogout] = useState(false)
  const route = useRoute()
  const passwordRef = useRef<HTMLInputElement>(null)
  const form = useForm({
    password: '',
  })

  const confirmLogout = useCallback(() => {
    setConfirmingLogout(true)

    setTimeout(() => passwordRef.current?.focus(), 250)
  }, [])

  const closeModal = useCallback(() => {
    setConfirmingLogout(false)

    form.reset()
  }, [form])

  const logoutOtherBrowserSessions = useCallback(() => {
    form.delete(route('other-browser-sessions.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordRef.current?.focus(),
      onFinish: () => form.reset(),
    })
  }, [closeModal, form, route])

  return (
    <ActionSection
      title="Browser Sessions"
      description={
        'Manage and log out your active sessions on other browsers and devices.'
      }
    >
      <div className="max-w-xl text-sm text-gray-600">
        If necessary, you may log out of all of your other browser sessions
        across all of your devices. Some of your recent sessions are listed
        below; however, this list may not be exhaustive. If you feel your
        account has been compromised, you should also update your password.
      </div>

      {/* <!-- Other Browser Sessions --> */}
      {sessions.length > 0 ? (
        <div className="mt-5 space-y-6">
          {sessions.map((session, i) => (
            <div className="flex items-center" key={i}>
              <div>
                {session.agent.is_desktop ? (
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-8 w-8 text-gray-500"
                  >
                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-gray-500"
                  >
                    <path d="M0 0h24v24H0z" stroke="none"></path>
                    <rect x="7" y="4" width="10" height="16" rx="1"></rect>
                    <path d="M11 5h2M12 17v.01"></path>
                  </svg>
                )}
              </div>

              <div className="ml-3">
                <div className="text-sm text-gray-600">
                  {session.agent.platform} - {session.agent.browser}
                </div>

                <div>
                  <div className="text-xs text-gray-500">
                    {session.ip_address},
                    {session.is_current_device ? (
                      <span className="font-semibold text-green-500">
                        This device
                      </span>
                    ) : (
                      <span>Last active {session.last_active}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center">
        <PrimaryButton onClick={confirmLogout}>
          Log Out Other Browser Sessions
        </PrimaryButton>

        <ActionMessage on={form.recentlySuccessful} className="ml-3">
          Done.
        </ActionMessage>
      </div>

      {/* <!-- Log Out Other Devices Confirmation Modal --> */}
      <DialogModal isOpen={confirmingLogout} onClose={closeModal}>
        <DialogModal.Content title="Log Out Other Browser Sessions">
          Please enter your password to confirm you would like to log out of
          your other browser sessions across all of your devices.
          <div className="mt-4">
            <PasswordInput
              containerClassName="w-3/4"
              className="mt-1 block w-full"
              placeholder="Password"
              ref={passwordRef}
              value={form.data.password}
              onChange={(e) => form.setData('password', e.currentTarget.value)}
            />

            <InputError message={form.errors.password} className="mt-2" />
          </div>
        </DialogModal.Content>

        <DialogModal.Footer>
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

          <PrimaryButton
            onClick={logoutOtherBrowserSessions}
            className={classNames('ml-2', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Log Out Other Browser Sessions
          </PrimaryButton>
        </DialogModal.Footer>
      </DialogModal>
    </ActionSection>
  )
}
