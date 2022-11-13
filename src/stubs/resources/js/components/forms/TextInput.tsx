import classNames from 'classnames'
import React, { forwardRef } from 'react'

// eslint-disable-next-line react/display-name
export const TextInput = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(({ type = 'text', ...props }, ref) => (
  <input
    type={type}
    {...props}
    ref={ref}
    className={classNames(
      'rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
      props.className,
    )}
  />
))
