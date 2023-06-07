import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'

import { Toaster } from "@/components/ui/toaster"

import Web3Provider from '../contexts/Web3Provider'
import RingsProvider from '../contexts/RingsProvider'
import SolanaProvider from '../contexts/SolanaProvider'
import MultiWeb3Provider from '../contexts/MultiWeb3Provider'

import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
          .then(reg => {
            if (reg.installing) {
              const sw = reg.installing || reg.waiting;

              sw.onstatechange = function() {
                if (sw.state === 'installed') {
                  onward();
                }
              };
            } else if (reg.active) {
              onward()
            }
          }).catch(error => console.error(error))

        // SW installed.  Refresh page so SW can respond with SW-enabled page.
        const onward = () => {
          setTimeout(function () {
            // window.location.reload()
            router.push('/')
          }, 0);
        }
      }
    }
  }, [router])

  return (
    <ThemeProvider attribute='class' defaultTheme='light'>
      <Web3Provider>
          <SolanaProvider>
            <MultiWeb3Provider>
              <RingsProvider>
                <Component {...pageProps} />
                <Toaster />
              </RingsProvider>
            </MultiWeb3Provider>
          </SolanaProvider>
        </Web3Provider>
    </ThemeProvider>
  )
}
