import { useForm, Head } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { AuthenticationCard } from '@/components/AuthenticationCard'
import { InputLabel } from '@/components/InputLabel'
import { PrimaryButton } from '@/components/PrimaryButton'
import { TextInput } from '@/components/forms/TextInput'
import { InputError } from '@/components/InputError'
import { PasswordInput } from '@/components/forms/PasswordInput'

interface Props {
  token: string
  email: string
}

const ResetPassword: React.FC<Props> = ({ token, email }) => {
  const route = useRoute()
  const form = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  })

  const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault()
      form.post(route('password.update'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
      })
    },
    [form, route],
  )

  return (
    <AuthenticationCard>
      <Head title="Reset Password" />

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

        <div className="mt-4">
          <InputLabel htmlFor="password">Password</InputLabel>
          <PasswordInput
            id="password"
            className="mt-1 block w-full"
            value={form.data.password}
            onChange={(e) => form.setData('password', e.currentTarget.value)}
            required
            autoComplete="new-password"
          />
          <InputError className="mt-2" message={form.errors.password} />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password_confirmation">
            Confirm Password
          </InputLabel>
          <PasswordInput
            id="password_confirmation"
            className="mt-1 block w-full"
            value={form.data.password_confirmation}
            onChange={(e) =>
              form.setData('password_confirmation', e.currentTarget.value)
            }
            required
            autoComplete="new-password"
          />
          <InputError
            className="mt-2"
            message={form.errors.password_confirmation}
          />
        </div>

        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Reset Password
          </PrimaryButton>
        </div>
      </form>
    </AuthenticationCard>
  )
}

export default ResetPassword
