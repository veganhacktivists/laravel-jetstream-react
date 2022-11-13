import React, { PropsWithChildren } from 'react'

interface Props {
  message?: string
  className?: string
}

export const InputError: React.FC<PropsWithChildren<Props>> = ({
  message,
  className,
  children,
}) => {
  if (!message && !children) {
    return null
  }

  return (
    <div className={className}>
      <p className="text-sm text-red-600">{message || children}</p>
    </div>
  )
}
