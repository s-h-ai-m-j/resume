import type { Metadata } from 'next'
import './globals.css'

/**
 * 网站元数据配置
 * 用于 SEO 和浏览器标签页显示
 */
export const metadata: Metadata = {
  title: '简历生成器 MVP',
  description: '一个简单好用的在线简历生成工具',
}

/**
 * 根布局组件
 * 所有页面的外层包装
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
