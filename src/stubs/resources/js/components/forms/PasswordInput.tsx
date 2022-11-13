import { useToggleState } from '@/hooks/useToggleState'
import classNames from 'classnames'
import React, { forwardRef } from 'react'
import { EyeIcon } from '@heroicons/react/20/solid'

import { TextInput } from './TextInput'

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
}

// eslint-disable-next-line react/display-name
export const PasswordInput = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<PasswordInputProps, HTMLInputElement>
>(({ containerClassName, ...props }, ref) => {
  const { isToggled: isShowingPassword, toggle: toggleIsShowingPassword } =
    useToggleState(false)

  return (
    <div className={classNames(containerClassName, 'relative')}>
      <TextInput
        {...props}
        ref={ref}
        type={isShowingPassword ? 'text' : 'password'}
      />
      <button
        className="absolute right-3 top-3"
        onClick={toggleIsShowingPassword}
        type="button"
      >
        <EyeIcon
          className={classNames(
            'h-5 w-5 text-gray-500',
            !isShowingPassword && 'opacity-50',
          )}
        />
      </button>
    </div>
  )
})
