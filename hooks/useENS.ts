import { useState, useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'

import formatAddress from '../utils/formatAddress'

import useBNS from './useBNS'

const useENS = () => {
  const { provider, account } = useWeb3React()
  const { getBNS } = useBNS()

  const [name, setName] = useState('')
  const [bns, setBNS] = useState<string>('')

  const resolveBns = useCallback(async () => {
    if (account) {
      const name = await getBNS(account)

      if (name) {
        setBNS(name)
      }
    }
  }, [account, getBNS])

  const resolveName = useCallback(async () => {
    if (provider && account) {
      const name = await provider.lookupAddress(account)

      if (name) {
        const address = await provider.resolveName(name)

        if (address && account.toLocaleLowerCase() === address.toLocaleLowerCase()) {
          setName(name)
        }
      }
    }
  }, [provider, account])

  useEffect(() => {
    if (account) {
      setName(formatAddress(account))
      resolveBns()
      resolveName()
    }
  }, [account, resolveName, resolveBns])

  return bns || name
}

export default useENS