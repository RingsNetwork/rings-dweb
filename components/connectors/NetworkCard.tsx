import { useEffect } from 'react'
import { hooks, network } from '../../connectors/network'
import { ConnectWithSelect } from '../ConnectWithSelect'

const {
  useChainId,
  useError,
  useIsActivating,
  useIsActive,
} = hooks

export default function NetworkCard(){
  const chainId = useChainId()
  const error = useError()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  // attempt to connect eagerly on mount
  useEffect(() => {
    void network.activate()
  }, [])

  return (
    <div>
      <ConnectWithSelect
        // @ts-ignore
        connector={network}
        chainId={chainId}
        isActivating={isActivating}
        error={error}
        isActive={isActive}
      />
    </div>
  )
}
