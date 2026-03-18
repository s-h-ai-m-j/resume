/**
 * 合并 className，替代轻量级 clsx 用法。
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
