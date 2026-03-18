import { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * 通用输入框。
 */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl border border-[rgba(23,32,51,0.12)] bg-white/90 px-3 text-sm outline-none transition focus:border-[#0f6c7f]',
        className,
      )}
      {...props}
    />
  )
}
