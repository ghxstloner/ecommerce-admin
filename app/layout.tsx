import './globals.css'
import { Inter } from 'next/font/google'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { ModalProvider } from '@/providers/modal-providers';
import { ToasterProvider } from '@/providers/toast-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <ClerkProvider>
      <html lang="es">
        <body className={inter.className}>
          {/* <div className='p-4'>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          </div> */}
          <ToasterProvider/>
          <ModalProvider/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
