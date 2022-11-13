import { useForm, Head } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { AuthenticationCard } from '@/components/AuthenticationCard'
import { InputError } from '@/components/InputError'
import { InputLabel } from '@/components/InputLabel'
import { PrimaryButton } from '@/components/PrimaryButton'
import { TextInput } from '@/components/forms/TextInput'
import { PasswordInput } from '@/components/forms/PasswordInput'

const ConfirmPassword = () => {
  const route = useRoute()
  const form = useForm({
    password: '',
  })

  const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault()
      form.post(route('password.confirm'), {
        onFinish: () => form.reset(),
      })
    },
    [form, route],
  )

  return (
    <AuthenticationCard>
      <Head title="Secure Area" />

      <div className="mb-4 text-sm text-gray-600">
        This is a secure area of the application. Please confirm your password
        before continuing.
      </div>

      <form onSubmit={onSubmit}>
        <div>
          <InputLabel htmlFor="password">Password</InputLabel>
          <PasswordInput
            id="password"
            className="mt-1 block w-full"
            value={form.data.password}
            onChange={(e) => form.setData('password', e.currentTarget.value)}
            required
            autoComplete="current-password"
            autoFocus
          />
          <InputError className="mt-2" message={form.errors.password} />
        </div>

        <div className="mt-4 flex justify-end">
          <PrimaryButton
            className={classNames('ml-4', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Confirm
          </PrimaryButton>
        </div>
      </form>
    </AuthenticationCard>
  )
}

export default ConfirmPassword
