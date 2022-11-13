import axios from 'axios'
import classNames from 'classnames'
import React, { PropsWithChildren, useCallback, useRef, useState } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { DialogModal } from '@/components/DialogModal'
import { InputError } from '@/components/InputError'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SecondaryButton } from '@/components/SecondaryButton'
import { PasswordInput } from './forms/PasswordInput'

interface Props {
  title?: string
  content?: string
  button?: string
  onConfirm(): void
}

export const ConfirmsPassword: React.FC<PropsWithChildren<Props>> = ({
  title = 'Confirm Password',
  content = 'For your security, please confirm your password to continue.',
  button = 'Confirm',
  onConfirm,
  children,
}) => {
  const route = useRoute()
  const [confirmingPassword, setConfirmingPassword] = useState(false)
  const [form, setForm] = useState({
    password: '',
    error: '',
    processing: false,
  })
  const passwordRef = useRef<HTMLInputElement>(null)

  const startConfirmingPassword = useCallback(() => {
    axios.get(route('password.confirmation')).then((response) => {
      if (response.data.confirmed) {
        onConfirm()
      } else {
        setConfirmingPassword(true)

        setTimeout(() => passwordRef.current?.focus(), 250)
      }
    })
  }, [route, onConfirm])

  const closeModal = useCallback(() => {
    setConfirmingPassword(false)
    setForm({ processing: false, password: '', error: '' })
  }, [])

  const confirmPassword = useCallback(() => {
    setForm({ ...form, processing: true })

    axios
      .post(route('password.confirm'), {
        password: form.password,
      })
      .then(() => {
        closeModal()
        setTimeout(() => onConfirm(), 250)
      })
      .catch((error) => {
        setForm({
          ...form,
          processing: false,
          error: error.response.data.errors.password[0],
        })
        passwordRef.current?.focus()
      })
  }, [closeModal, form, onConfirm, route])

  return (
    <span>
      <span onClick={startConfirmingPassword}>{children}</span>

      <DialogModal isOpen={confirmingPassword} onClose={closeModal}>
        <DialogModal.Content title={title}>
          {content}

          <div className="mt-4">
            <PasswordInput
              containerClassName="w-3/4"
              className="mt-1 block w-full"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.currentTarget.value })
              }
            />

            <InputError message={form.error} className="mt-2" />
          </div>
        </DialogModal.Content>

        <DialogModal.Footer>
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

          <PrimaryButton
            className={classNames('ml-2', { 'opacity-25': form.processing })}
            onClick={confirmPassword}
            disabled={form.processing}
          >
            {button}
          </PrimaryButton>
        </DialogModal.Footer>
      </DialogModal>
    </span>
  )
}
