import { Inertia } from '@inertiajs/inertia'
import { useForm } from '@inertiajs/inertia-react'
import axios from 'axios'
import classNames from 'classnames'
import React, { useCallback, useState } from 'react'
import { ActionSection } from '@/components/ActionSection'
import { ConfirmsPassword } from '@/components/ConfirmsPassword'
import { DangerButton } from '@/components/DangerButton'
import { InputError } from '@/components/InputError'
import { InputLabel } from '@/components/InputLabel'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SecondaryButton } from '@/components/SecondaryButton'
import { TextInput } from '@/components/forms/TextInput'
import { useTypedPage } from '@/hooks/useTypedPage'

interface Props {
  requiresConfirmation: boolean
}

export const TwoFactorAuthenticationForm: React.FC<Props> = ({
  requiresConfirmation,
}) => {
  const page = useTypedPage()
  const [enabling, setEnabling] = useState(false)
  const [disabling, setDisabling] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [confirming, setConfirming] = useState(false)
  const [setupKey, setSetupKey] = useState<string | null>(null)
  const confirmationForm = useForm({
    code: '',
  })
  const twoFactorEnabled = !enabling && page.props?.user?.two_factor_enabled

  const showSetupKey = useCallback(() => {
    return axios.get('/user/two-factor-secret-key').then((response) => {
      setSetupKey(response.data.secretKey)
    })
  }, [])

  const showQrCode = useCallback(() => {
    return axios.get('/user/two-factor-qr-code').then((response) => {
      setQrCode(response.data.svg)
    })
  }, [])

  const showRecoveryCodes = useCallback(() => {
    return axios.get('/user/two-factor-recovery-codes').then((response) => {
      setRecoveryCodes(response.data)
    })
  }, [])

  const enableTwoFactorAuthentication = useCallback(() => {
    setEnabling(true)

    Inertia.post(
      '/user/two-factor-authentication',
      {},
      {
        preserveScroll: true,
        onSuccess() {
          return Promise.all([
            showQrCode(),
            showSetupKey(),
            showRecoveryCodes(),
          ])
        },
        onFinish() {
          setEnabling(false)
          setConfirming(requiresConfirmation)
        },
      },
    )
  }, [requiresConfirmation, showQrCode, showRecoveryCodes, showSetupKey])

  const confirmTwoFactorAuthentication = useCallback(() => {
    confirmationForm.post('/user/confirmed-two-factor-authentication', {
      preserveScroll: true,
      preserveState: true,
      errorBag: 'confirmTwoFactorAuthentication',
      onSuccess: () => {
        setConfirming(false)
        setQrCode(null)
        setSetupKey(null)
      },
    })
  }, [confirmationForm])

  const regenerateRecoveryCodes = useCallback(() => {
    axios.post('/user/two-factor-recovery-codes').then(() => {
      showRecoveryCodes()
    })
  }, [showRecoveryCodes])

  const disableTwoFactorAuthentication = useCallback(() => {
    setDisabling(true)

    Inertia.delete('/user/two-factor-authentication', {
      preserveScroll: true,
      onSuccess() {
        setDisabling(false)
        setConfirming(false)
      },
    })
  }, [])

  return (
    <ActionSection
      title="Two Factor Authentication"
      description={
        'Add additional security to your account using two factor authentication.'
      }
    >
      {(() => {
        if (twoFactorEnabled && !confirming) {
          return (
            <h3 className="text-lg font-medium text-gray-900">
              You have enabled two factor authentication.
            </h3>
          )
        }
        if (confirming) {
          return (
            <h3 className="text-lg font-medium text-gray-900">
              Finish enabling two factor authentication.
            </h3>
          )
        }
        return (
          <h3 className="text-lg font-medium text-gray-900">
            You have not enabled two factor authentication.
          </h3>
        )
      })()}

      <div className="mt-3 max-w-xl text-sm text-gray-600">
        <p>
          When two factor authentication is enabled, you will be prompted for a
          secure, random token during authentication. You may retrieve this
          token from your phone's Google Authenticator application.
        </p>
      </div>

      {twoFactorEnabled || confirming ? (
        <div>
          {qrCode ? (
            <div>
              <div className="mt-4 max-w-xl text-sm text-gray-600">
                {confirming ? (
                  <p className="font-semibold">
                    To finish enabling two factor authentication, scan the
                    following QR code using your phone's authenticator
                    application or enter the setup key and provide the generated
                    OTP code.
                  </p>
                ) : (
                  <p>
                    Two factor authentication is now enabled. Scan the following
                    QR code using your phone's authenticator application or
                    enter the setup key.
                  </p>
                )}
              </div>

              <div
                className="mt-4"
                dangerouslySetInnerHTML={{ __html: qrCode || '' }}
              />

              {setupKey && (
                <div className="mt-4 max-w-xl text-sm text-gray-600">
                  <p className="font-semibold">
                    Setup Key:{' '}
                    <span
                      dangerouslySetInnerHTML={{ __html: setupKey || '' }}
                    />
                  </p>
                </div>
              )}

              {confirming && (
                <div className="mt-4">
                  <InputLabel htmlFor="code" value="Code" />

                  <TextInput
                    id="code"
                    type="text"
                    name="code"
                    className="mt-1 block w-1/2"
                    inputMode="numeric"
                    autoFocus={true}
                    autoComplete="one-time-code"
                    value={confirmationForm.data.code}
                    onChange={(e) =>
                      confirmationForm.setData('code', e.currentTarget.value)
                    }
                  />

                  <InputError
                    message={confirmationForm.errors.code}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          ) : null}

          {recoveryCodes.length > 0 && !confirming ? (
            <div>
              <div className="mt-4 max-w-xl text-sm text-gray-600">
                <p className="font-semibold">
                  Store these recovery codes in a secure password manager. They
                  can be used to recover access to your account if your two
                  factor authentication device is lost.
                </p>
              </div>

              <div className="mt-4 grid max-w-xl gap-1 rounded-lg bg-gray-100 px-4 py-4 font-mono text-sm">
                {recoveryCodes.map((code) => (
                  <div key={code}>{code}</div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5">
        {twoFactorEnabled || confirming ? (
          <div>
            {confirming ? (
              <ConfirmsPassword onConfirm={confirmTwoFactorAuthentication}>
                <PrimaryButton
                  className={classNames('mr-3', { 'opacity-25': enabling })}
                  disabled={enabling}
                >
                  Confirm
                </PrimaryButton>
              </ConfirmsPassword>
            ) : null}
            {recoveryCodes.length > 0 && !confirming ? (
              <ConfirmsPassword onConfirm={regenerateRecoveryCodes}>
                <SecondaryButton className="mr-3">
                  Regenerate Recovery Codes
                </SecondaryButton>
              </ConfirmsPassword>
            ) : null}
            {recoveryCodes.length === 0 && !confirming ? (
              <ConfirmsPassword onConfirm={showRecoveryCodes}>
                <SecondaryButton className="mr-3">
                  Show Recovery Codes
                </SecondaryButton>
              </ConfirmsPassword>
            ) : null}

            {confirming ? (
              <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                <SecondaryButton
                  className={classNames('mr-3', { 'opacity-25': disabling })}
                  disabled={disabling}
                >
                  Cancel
                </SecondaryButton>
              </ConfirmsPassword>
            ) : (
              <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                <DangerButton
                  className={classNames({ 'opacity-25': disabling })}
                  disabled={disabling}
                >
                  Disable
                </DangerButton>
              </ConfirmsPassword>
            )}
          </div>
        ) : (
          <div>
            <ConfirmsPassword onConfirm={enableTwoFactorAuthentication}>
              <PrimaryButton
                type="button"
                className={classNames({ 'opacity-25': enabling })}
                disabled={enabling}
              >
                Enable
              </PrimaryButton>
            </ConfirmsPassword>
          </div>
        )}
      </div>
    </ActionSection>
  )
}
