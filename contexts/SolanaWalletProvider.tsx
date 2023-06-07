import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import dynamic from "next/dynamic";

import { WalletAdapter } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";


// @ts-ignore
const Wallet = dynamic(() => import("@project-serum/sol-wallet-adapter"), { ssr: false});

import PhantomLogo from "../assets/phantom.png";

const PHANTOM_URL = "https://www.phantom.app"

export const WALLET_PROVIDERS = [
  {
    name: "Phantom",
    url: PHANTOM_URL,
    icon: PhantomLogo,
    adapter: PhantomWalletAdapter,
  },
];

const WalletContext = React.createContext<any>(null);

export default function WalletProvider({ children = null as any }) {
  const [providerUrl, setProviderUrl] = useState('');

  // const [autoConnect, setAutoConnect] = useState(false);
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState<WalletAdapter | null>(null)

  // const provider = useMemo(
  //   () => WALLET_PROVIDERS.find(({ url }) => url === providerUrl),
  //   [providerUrl]
  // );

  // const wallet = useMemo(
  //   function () {
  //     if (provider) {
  //       return new (provider.adapter || Wallet)(
  //         providerUrl
  //       ) as WalletAdapter;
  //     }
  //   },
  //   [provider, providerUrl]
  // );

  useEffect(() => {
    // console.log(`wallet`, wallet)
    if (wallet) {
      wallet.on("connect", () => {
        if (wallet.publicKey) {
          setConnected(true);
        }
      });

      wallet.on("disconnect", () => {
        setConnected(false);
      });

      if (wallet.publicKey) {
        setConnected(true)
      }
    }

    return () => {
      setConnected(false);

      if (wallet) {
        wallet.disconnect();
        setConnected(false);
        // setAutoConnect(false)
      }
    };
  }, [wallet]);

  // useEffect(() => {
  //   // @ts-ignore
  //   if (window.solana && wallet && autoConnect) {
  //     console.log(`wallet`, wallet)
  //     console.log(`autoConnect`, autoConnect)
  //     setTimeout(() => wallet.connect(), 0)
  //     // wallet.connect()
  //   } 
  // }, [wallet, autoConnect]);

  const handleConnect = useCallback(async (providerUrl: string) => {
    const provider = WALLET_PROVIDERS.find(({ url }) => url === providerUrl)
  
    const wallet = new (provider!.adapter || Wallet)(providerUrl) as WalletAdapter;

    setWallet(wallet)

    try {
      await wallet.connect()
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        connect: handleConnect,
        providerUrl,
        setProviderUrl,
        providerName:
          WALLET_PROVIDERS.find(({ url }) => url === providerUrl)?.name ??
          providerUrl,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("Missing wallet context");
  }

  const { connected, wallet, providerUrl, setProvider, providerName, connect } = context

  return {
    connected,
    wallet,
    providerUrl,
    setProvider,
    providerName,
    connect,
    disconnect() {
      wallet?.disconnect();
    },
  };
}