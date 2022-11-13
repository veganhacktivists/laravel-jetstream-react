import { useForm, Head } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { AuthenticationCard } from '@/components/AuthenticationCard'
import { InputLabel } from '@/components/InputLabel'
import { PrimaryButton } from '@/components/PrimaryButton'
import { TextInput } from '@/components/forms/TextInput'
import { InputError } from '@/components/InputError'

interface Props {
  status: string
}

const ForgotPassword: React.FC<Props> = ({ status }) => {
  const route = useRoute()
  const form = useForm({
    email: '',
  })

  const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault()
      form.post(route('password.email'))
    },
    [form, route],
  )

  return (
    <AuthenticationCard>
      <Head title="Forgot Password" />

      <div className="mb-4 text-sm text-gray-600">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
      </div>

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
      )}

      <form onSubmit={onSubmit}>
        <div>
          <InputLabel htmlFor="email">Email</InputLabel>
          <TextInput
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={form.data.email}
            onChange={(e) => form.setData('email', e.currentTarget.value)}
            required
            autoFocus
          />
          <InputError className="mt-2" message={form.errors.email} />
        </div>

        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Email Password Reset Link
          </PrimaryButton>
        </div>
      </form>
    </AuthenticationCard>
  )
}

export default ForgotPassword
