import { useForm } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback, useRef, useState } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { ActionSection } from '@/components/ActionSection'
import { DangerButton } from '@/components/DangerButton'
import { DialogModal } from '@/components/DialogModal'
import { TextInput } from '@/components/forms/TextInput'
import { InputError } from '@/components/InputError'
import { SecondaryButton } from '@/components/SecondaryButton'
import { PasswordInput } from '@/components/forms/PasswordInput'

export const DeleteUserForm = () => {
  const route = useRoute()
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false)
  const form = useForm({
    password: '',
  })
  const passwordRef = useRef<HTMLInputElement>(null)

  const confirmUserDeletion = useCallback(() => {
    setConfirmingUserDeletion(true)

    setTimeout(() => passwordRef.current?.focus(), 250)
  }, [])

  const closeModal = useCallback(() => {
    setConfirmingUserDeletion(false)
    form.reset()
  }, [form])

  const deleteUser = useCallback(() => {
    form.delete(route('current-user.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordRef.current?.focus(),
      onFinish: () => form.reset(),
    })
  }, [closeModal, form, route])

  return (
    <ActionSection
      title="Delete Account"
      description="Permanently delete your account."
    >
      <div className="max-w-xl text-sm text-gray-600">
        Once your account is deleted, all of its resources and data will be
        permanently deleted. Before deleting your account, please download any
        data or information that you wish to retain.
      </div>

      <div className="mt-5">
        <DangerButton onClick={confirmUserDeletion}>
          Delete Account
        </DangerButton>
      </div>

      {/* <!-- Delete Account Confirmation Modal --> */}
      <DialogModal isOpen={confirmingUserDeletion} onClose={closeModal}>
        <DialogModal.Content title="Delete Account">
          Are you sure you want to delete your account? Once your account is
          deleted, all of its resources and data will be permanently deleted.
          Please enter your password to confirm you would like to permanently
          delete your account.
          <div className="mt-4">
            <PasswordInput
              containerClassName="w-3/4"
              className="mt-1 block w-full"
              placeholder="Password"
              value={form.data.password}
              onChange={(e) => form.setData('password', e.currentTarget.value)}
            />

            <InputError message={form.errors.password} className="mt-2" />
          </div>
        </DialogModal.Content>
        <DialogModal.Footer>
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

          <DangerButton
            onClick={deleteUser}
            className={classNames('ml-2', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Delete Account
          </DangerButton>
        </DialogModal.Footer>
      </DialogModal>
    </ActionSection>
  )
}
