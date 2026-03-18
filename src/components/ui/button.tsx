import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
}

/**
 * shadcn/ui 风格的轻量按钮组件。
 */
export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const variantClassName = {
    primary: 'bg-[#0f6c7f] text-white hover:bg-[#0b4d5d]',
    secondary: 'bg-[#efe5d3] text-[#172033] hover:bg-[#e5d7bc]',
    outline: 'border border-[rgba(23,32,51,0.12)] bg-white/80 text-[#172033] hover:bg-white',
    danger: 'bg-[#b42318] text-white hover:bg-[#912018]',
  }[variant]

  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variantClassName,
        className,
      )}
      {...props}
    />
  )
}
