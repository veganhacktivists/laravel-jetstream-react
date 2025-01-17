import { useForm } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback, useRef } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { ActionMessage } from '@/components/ActionMessage'
import { FormSection } from '@/components/FormSection'
import { InputError } from '@/components/InputError'
import { InputLabel } from '@/components/InputLabel'
import { PrimaryButton } from '@/components/PrimaryButton'
import { PasswordInput } from '@/components/forms/PasswordInput'

export const UpdatePasswordForm = () => {
  const route = useRoute()
  const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const passwordRef = useRef<HTMLInputElement>(null)
  const currentPasswordRef = useRef<HTMLInputElement>(null)

  const updatePassword = useCallback(() => {
    form.put(route('user-password.update'), {
      errorBag: 'updatePassword',
      preserveScroll: true,
      onSuccess: () => form.reset(),
      onError: () => {
        if (form.errors.password) {
          form.reset('password', 'password_confirmation')
          passwordRef.current?.focus()
        }

        if (form.errors.current_password) {
          form.reset('current_password')
          currentPasswordRef.current?.focus()
        }
      },
    })
  }, [form, route])

  return (
    <FormSection
      onSubmit={updatePassword}
      title="Update Password"
      description={
        'Ensure your account is using a long, random password to stay secure.'
      }
      renderActions={() => (
        <>
          <ActionMessage on={form.recentlySuccessful} className="mr-3">
            Saved.
          </ActionMessage>

          <PrimaryButton
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Save
          </PrimaryButton>
        </>
      )}
    >
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="current_password">Current Password</InputLabel>
        <PasswordInput
          id="current_password"
          className="mt-1 block w-full"
          ref={currentPasswordRef}
          value={form.data.current_password}
          onChange={(e) =>
            form.setData('current_password', e.currentTarget.value)
          }
          autoComplete="current-password"
        />
        <InputError message={form.errors.current_password} className="mt-2" />
      </div>

      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="password">New Password</InputLabel>
        <PasswordInput
          id="password"
          className="mt-1 block w-full"
          value={form.data.password}
          onChange={(e) => form.setData('password', e.currentTarget.value)}
          autoComplete="new-password"
          ref={passwordRef}
        />
        <InputError message={form.errors.password} className="mt-2" />
      </div>

      <div className="col-span-6 sm:col-span-4">
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
          autoComplete="new-password"
        />
        <InputError
          message={form.errors.password_confirmation}
          className="mt-2"
        />
      </div>
    </FormSection>
  )
}
