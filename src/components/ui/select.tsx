import { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * 原生下拉框封装。
 */
export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-xl border border-[rgba(23,32,51,0.12)] bg-white/90 px-3 text-sm outline-none transition focus:border-[#0f6c7f]',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
