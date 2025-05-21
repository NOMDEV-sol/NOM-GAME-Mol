import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Main from '../components/Main'
import { TokenProvider } from '../context/TokenContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nom',
  description: 'Born in the Peak, Shine in the Doom. Let Nom protect you when the end is near.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <TokenProvider>
          <Header />
          <Main>{children}</Main>
          <Footer />
        </TokenProvider>
      </body>
    </html>
  )
}
