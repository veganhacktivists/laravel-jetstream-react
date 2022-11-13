import { useCallback, useState } from 'react'

export const useToggleState = (initialState = false) => {
  const [isToggled, setIsToggled] = useState(initialState)
  const toggle = useCallback(() => {
    setIsToggled(!isToggled)
  }, [setIsToggled, isToggled])

  return { isToggled, toggle, setIsToggled }
}
