import { useState, useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
// @ts-ignore
import { normalize } from '@ensdomains/eth-ens-namehash'

import { setupENS, ENS } from '@ringsnetwork/bns-util'

const useBNS = () => {
  const { provider } = useWeb3React()

  const [bns, setBNS] = useState<ENS | null>(null)

  const getBNS = useCallback(async (address: string) => {
    if (bns) {
      let name

      const { name: reverseName } = await bns.getName(address)
      const reverseAddress = await bns.getAddress(reverseName)
      const normalisedName = normalize(reverseName)

      if (
        parseInt(address) === parseInt(reverseAddress) &&
        reverseName === normalisedName
      ) {
        name = reverseName
      }

      return name
    }
  }, [bns])

  useEffect(() => {
    const setup = async () => {
      if (provider) {
        try {
          const { ens } = await setupENS({
            customProvider: null,
            reloadOnAccountsChange: false,
            enforceReload: false,
            enforceReadOnly: false,
            ensAddress: '',
            infura: false
          })

          setBNS(ens)
        } catch (e) {
          console.error(e)
        }
      }
    }

    if (provider) {
      setup()
    }

  }, [provider])

  return {
    bns,
    getBNS
  }
}

export default useBNS