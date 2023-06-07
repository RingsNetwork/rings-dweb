import Image from "next/image";

import { WALLET_PROVIDERS, useWallet } from '@/contexts/SolanaWalletProvider'

const PhantomCard = ({ onConnect }: { onConnect: () => void }) => {
  const { connect } = useWallet()

  const handleConnect = (provider: string) => {
    try {
      connect(provider)
      onConnect()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      {
        WALLET_PROVIDERS.map((provider) => 
          <div
            key={provider.name}
            className='flex items-center flex-grow-0 w-full mb-4 cursor-pointer' 
            onClick={() => handleConnect(provider.url)}
          >
            <div className='mr-5 w-11 h-11'>
              <Image src={provider.icon} alt="" />
            </div> 
            <div className='text-sm font-bold'>{provider.name}</div>
          </div>
        )
      }
    </>
    
  )
}

export default PhantomCard