import classNames from 'classnames'
import React from 'react'

export const Checkbox: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = (props) => {
  return (
    <input
      type="checkbox"
      {...props}
      className={classNames(
        'rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
        props.className,
      )}
    />
  )
}
