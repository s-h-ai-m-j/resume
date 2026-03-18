import { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * 多行输入框。
 */
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-[104px] w-full rounded-xl border border-[rgba(23,32,51,0.12)] bg-white/90 px-3 py-2 text-sm outline-none transition focus:border-[#0f6c7f]',
        className,
      )}
      {...props}
    />
  )
}
