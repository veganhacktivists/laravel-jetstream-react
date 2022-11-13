import React, { PropsWithChildren } from 'react'

interface Props {
  value?: string
  htmlFor?: string
}

export const InputLabel: React.FC<PropsWithChildren<Props>> = ({
  value,
  htmlFor,
  children,
}) => {
  return (
    <label
      className="block text-sm font-medium text-gray-700"
      htmlFor={htmlFor}
    >
      {value || children}
    </label>
  )
}
