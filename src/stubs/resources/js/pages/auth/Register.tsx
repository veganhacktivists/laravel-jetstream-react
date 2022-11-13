import { InertiaLink, useForm, Head } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { useTypedPage } from '@/hooks/useTypedPage'
import { AuthenticationCard } from '@/components/AuthenticationCard'
import { Checkbox } from '@/components/Checkbox'
import { InputLabel } from '@/components/InputLabel'
import { PrimaryButton } from '@/components/PrimaryButton'
import { TextInput } from '@/components/forms/TextInput'
import { InputError } from '@/components/InputError'
import { PasswordInput } from '@/components/forms/PasswordInput'

const Register = () => {
  const page = useTypedPage()
  const route = useRoute()
  const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  })

  const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault()
      form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
      })
    },
    [form, route],
  )

  return (
    <AuthenticationCard>
      <Head title="Register" />

      <form onSubmit={onSubmit}>
        <div>
          <InputLabel htmlFor="name">Name</InputLabel>
          <TextInput
            id="name"
            type="text"
            className="mt-1 block w-full"
            value={form.data.name}
            onChange={(e) => form.setData('name', e.currentTarget.value)}
            required
            autoFocus
            autoComplete="name"
          />
          <InputError className="mt-2" message={form.errors.name} />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="email">Email</InputLabel>
          <TextInput
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={form.data.email}
            onChange={(e) => form.setData('email', e.currentTarget.value)}
            required
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

        {page.props.jetstream.hasTermsAndPrivacyPolicyFeature && (
          <div className="mt-4">
            <InputLabel htmlFor="terms">
              <div className="flex items-center">
                <Checkbox
                  name="terms"
                  id="terms"
                  checked={form.data.terms}
                  onChange={(e) =>
                    form.setData('terms', e.currentTarget.checked)
                  }
                  required
                />

                <div className="ml-2">
                  I agree to the
                  <a
                    target="_blank"
                    href={route('terms.show')}
                    className="text-sm text-gray-600 underline hover:text-gray-900"
                    rel="noreferrer"
                  >
                    Terms of Service
                  </a>
                  and
                  <a
                    target="_blank"
                    href={route('policy.show')}
                    className="text-sm text-gray-600 underline hover:text-gray-900"
                    rel="noreferrer"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
              <InputError className="mt-2" message={form.errors.terms} />
            </InputLabel>
          </div>
        )}

        <div className="mt-4 flex items-center justify-end">
          <InertiaLink
            href={route('login')}
            className="text-sm text-gray-600 underline hover:text-gray-900"
          >
            Already registered?
          </InertiaLink>

          <PrimaryButton
            className={classNames('ml-4', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Register
          </PrimaryButton>
        </div>
      </form>
    </AuthenticationCard>
  )
}

export default Register
