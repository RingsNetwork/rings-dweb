import { useEffect, useState, type EffectCallback } from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import RingsProvider from '@ringsnetwork/rings-provider'
 
// import { publicProvider } from 'wagmi/providers/public'
 
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!

const chains = [
  mainnet,
];
 
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);

const client = createClient({
  autoConnect: false,
  connectors: w3mConnectors({ version: 1, chains, projectId }),
  provider,
});
 
// const client = createClient({
//   autoConnect: false,
//   connectors: [
//     new MetaMaskConnector({ chains }),
//     new WalletConnectConnector({
//       chains,
//       options: {
//         projectId,
//       },
//     }),
//   ],
//   provider,
// })

const ethereumClient = new EthereumClient(client, chains);

import { Toaster } from "@/components/ui/toaster"

// import RingsProvider from '../contexts/RingsProvider'
import SolanaProvider from '../contexts/SolanaProvider'
import MultiWeb3Provider from '../contexts/MultiWeb3Provider'

import '@/styles/globals.css'

function useEffectOnce(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (router.query.eruda) {
      const eruda = require('eruda')

      eruda.init()
    }
  }, [router.query])


  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
          .then(reg => {
            if (reg.installing) {
              const sw = reg.installing || reg.waiting;

              sw.onstatechange = function() {
                console.log(sw.state)
                if (sw.state === 'installed') {
                  onward()
                }
              };
            } 
          }).catch(error => console.error(error))

        // SW installed.  Refresh page so SW can respond with SW-enabled page.
        const onward = () => {
          setTimeout(function () {
            console.log(`onward`)
            window.location.reload()
            // router.push('/')
          }, 0)
        }
      }
    }
  }, [])

  return (
    <ThemeProvider attribute='class' defaultTheme='light'>
      {
        ready ? (
        <WagmiConfig client={client}>
          <RingsProvider>
            <SolanaProvider>
              <MultiWeb3Provider>
                <Component {...pageProps} />
                <Toaster />
              </MultiWeb3Provider>
            </SolanaProvider>
          </RingsProvider>
        </WagmiConfig>): 
        null
      }

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </ThemeProvider>
  )
}
