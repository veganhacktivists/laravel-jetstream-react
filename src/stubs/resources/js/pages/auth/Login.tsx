import { InertiaLink, useForm, Head } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { AuthenticationCard } from '@/components/AuthenticationCard'
import { Checkbox } from '@/components/Checkbox'
import { InputLabel } from '@/components/InputLabel'
import { PrimaryButton } from '@/components/PrimaryButton'
import { TextInput } from '@/components/forms/TextInput'
import { InputError } from '@/components/InputError'
import { PasswordInput } from '@/components/forms/PasswordInput'

interface Props {
  canResetPassword: boolean
  status: string
}

const Login: React.FC<Props> = ({ canResetPassword, status }) => {
  const route = useRoute()
  const form = useForm({
    email: '',
    password: '',
    remember: '',
  })

  const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e: React.FormEvent) => {
      e.preventDefault()
      form.post(route('login'), {
        onFinish: () => form.reset('password'),
      })
    },
    [form, route],
  )

  return (
    <AuthenticationCard>
      <Head title="login" />

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

        <div className="mt-4">
          <InputLabel htmlFor="password">Password</InputLabel>
          <PasswordInput
            id="password"
            className="mt-1 block w-full"
            value={form.data.password}
            onChange={(e) => form.setData('password', e.currentTarget.value)}
            required
            autoComplete="current-password"
          />
          <InputError className="mt-2" message={form.errors.password} />
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <Checkbox
              name="remember"
              checked={form.data.remember === 'on'}
              onChange={(e) =>
                form.setData('remember', e.currentTarget.checked ? 'on' : '')
              }
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
        </div>

        <div className="mt-4 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          {canResetPassword && (
            <div>
              <InertiaLink
                href={route('password.request')}
                className="text-sm text-gray-600 underline hover:text-gray-900"
              >
                Forgot your password?
              </InertiaLink>
            </div>
          )}

          <div className="flex items-center justify-end">
            <InertiaLink
              href={route('register')}
              className="text-sm text-gray-600 underline hover:text-gray-900"
            >
              Need an account?
            </InertiaLink>

            <PrimaryButton
              className={classNames('ml-4', { 'opacity-25': form.processing })}
              disabled={form.processing}
            >
              Log in
            </PrimaryButton>
          </div>
        </div>
      </form>
    </AuthenticationCard>
  )
}

export default Login
