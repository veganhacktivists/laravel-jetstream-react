import { Page } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'
import { InertiaSharedProps } from '@/types'

export const useTypedPage = <T>() => {
  return usePage<Page<InertiaSharedProps<T>>>()
}
