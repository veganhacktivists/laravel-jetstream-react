import { InertiaLink, useForm, Head } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { AuthenticationCard } from '@/components/AuthenticationCard'
import { PrimaryButton } from '@/components/PrimaryButton'

interface Props {
  status: string
}

const VerifyEmail: React.FC<Props> = ({ status }) => {
  const route = useRoute()
  const form = useForm({})
  const verificationLinkSent = status === 'verification-link-sent'

  const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault()
      form.post(route('verification.send'))
    },
    [form, route],
  )

  return (
    <AuthenticationCard>
      <Head title="Email Verification" />

      <div className="mb-4 text-sm text-gray-600">
        Thanks for signing up! Before getting started, could you verify your
        email address by clicking on the link we just emailed to you? If you
        didn't receive the email, we will gladly send you another.
      </div>

      {verificationLinkSent && (
        <div className="mb-4 text-sm font-medium text-green-600">
          A new verification link has been sent to the email address you
          provided during registration.
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="mt-4 flex items-center justify-between">
          <PrimaryButton
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Resend Verification Email
          </PrimaryButton>

          <InertiaLink
            href={route('logout')}
            method="post"
            as="button"
            className="text-sm text-gray-600 underline hover:text-gray-900"
          >
            Log Out
          </InertiaLink>
        </div>
      </form>
    </AuthenticationCard>
  )
}

export default VerifyEmail
