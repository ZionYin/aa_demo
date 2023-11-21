import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Provider } from './components/Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AA demo',
  description: 'An account abstraction demo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-black ${inter.className}`}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
