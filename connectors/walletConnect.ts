import { initializeConnector } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect'
import { URLS } from '../chains'

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: URLS,
      qrcode: true,
      bridge: "https://bridge.walletconnect.org",
      qrcodeModalOptions: {
        mobileLinks: [
          "metamask",
        ],
      },
    })
)
