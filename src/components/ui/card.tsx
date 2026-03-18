import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * 通用卡片容器。
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-[rgba(23,32,51,0.12)] bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur',
        className,
      )}
      {...props}
    />
  )
}

/**
 * 卡片头部。
 */
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-2 p-5', className)} {...props} />
}

/**
 * 卡片标题。
 */
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />
}

/**
 * 卡片描述。
 */
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-[#5f6777]', className)} {...props} />
}

/**
 * 卡片内容。
 */
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pt-0', className)} {...props} />
}
