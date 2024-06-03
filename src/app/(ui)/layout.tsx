import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeRegistry from './ThemeRegistry'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Copilot Slack Integration',
  description: 'Easily sync channels and messages between slack and copilot -- at the click of a button',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry options={{ key: 'mui' }}>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
