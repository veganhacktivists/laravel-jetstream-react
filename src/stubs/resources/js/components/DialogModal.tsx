import React, { PropsWithChildren } from 'react'
import { ModalProps, Modal } from '@/components/Modal'

export const DialogModal = ({
  children,
  ...modalProps
}: PropsWithChildren<ModalProps>) => {
  return <Modal {...modalProps}>{children}</Modal>
}

DialogModal.Content = function DialogModalContent({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <div className="px-6 py-4">
      <div className="text-lg">{title}</div>

      <div className="mt-4">{children}</div>
    </div>
  )
}

DialogModal.Footer = function DialogModalFooter({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  return <div className="bg-gray-100 px-6 py-4 text-right">{children}</div>
}
