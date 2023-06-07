import type { Web3ReactHooks } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'

import { getAddChainParameters } from '../chains'

export function ConnectWithSelect({
  connector,
  isActivating,
  icon,
  onConnect,
  title
}: {
  connector: MetaMask | WalletConnect
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  icon: React.ReactNode
  onConnect: () => void
  title: string
}) {
    return (
      <div
        className='flex items-center flex-grow-0 w-full mb-4 cursor-pointer' 
        onClick={
          isActivating ? 
          undefined : 
          () => {
            connector instanceof WalletConnect ? 
            connector.activate(1).then(() => onConnect()) :
            connector.activate(getAddChainParameters(1)).then(() => onConnect()).catch(e => console.error(e))
          }
        }
      >
      <div className='mr-5 w-11 h-11'>{icon}</div> 
      <div className='text-sm font-bold'>{title}</div>
    </div>
    )
}
