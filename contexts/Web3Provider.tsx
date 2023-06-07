import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'

import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { hooks as networkHooks, network } from '../connectors/network'
import {
  hooks as walletConnectHooks,
  walletConnect
} from '../connectors/walletConnect'

const connectors: [MetaMask | WalletConnect | Network, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [network, networkHooks]
]

export default function Web3Provider({
  children
}: {
  children: React.ReactNode
}){
  return (
    <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
  )
}
