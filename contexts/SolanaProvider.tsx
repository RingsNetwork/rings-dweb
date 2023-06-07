// import { ConnectionProvider } from './SolanaConnectionProvider' 
// import dynamic from "next/dynamic";
import WalletProvider from './SolanaWalletProvider'

// const WalletProvider = dynamic(() => import('./SolanaWalletProvider'), { ssr: false });

export default function SolanaProvider({ children = null as any }) {
  return (
    // <ConnectionProvider>
      <WalletProvider>
        {children}
      </WalletProvider>
    // </ConnectionProvider>
  )
}