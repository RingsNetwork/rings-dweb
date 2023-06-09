import { useEffect, useState, useCallback, createContext, useContext, useReducer, useRef } from 'react'

import init, { Client, MessageCallbackInstance, debug } from '@ringsnetwork/rings-node'

import useMultiWeb3 from '../hooks/useMultiWeb3'
import useBNS from '../hooks/useBNS';

import formatAddress from '../utils/formatAddress';
import { getAddressWithType } from '../utils';

import { ADDRESS_TYPE } from '../utils/const';

export interface HttpMessageProps {
  destination: string,
  method: string,
  path: string,
  headers: any 
}
export interface Chat_props {
  from: string,
  to: string,
  message: string
}

// export interface NodePeer {
//   address: string,
//   state: string | undefined,
//   transport_pubkey: string,
//   transport_id: string,
// }

interface RingsContext {
  client: Client | null,
  fetchPeers: () => Promise<Peer[]>,
  sendMessage: (to: string, message: string) => Promise<void>,
  connectByAddress: (address: string) => Promise<void>,
  createOffer: () => Promise<void>,
  answerOffer: (offer: any) => Promise<void>,
  acceptAnswer: (transportId: any, answer: any) => Promise<void>,
  turnUrl: string,
  setTurnUrl: (turnUrl: string) => void,
  nodeUrl: string,
  setNodeUrl: (nodeUrl: string) => void,
  status: string,
  node: string,
  nodeStatus: string,
  setStatus: (status: string) => void,
  disconnect: () => void,
  state: StateProps,
  dispatch: React.Dispatch<any>,
  startChat: (peer: string) => void,
  endChat: (peer: string) => void,
  asyncSendMessage: (message: HttpMessageProps) => Promise<any>
}

export interface Peer {
    address: string,
    state: string | undefined,
    transport_pubkey: string,
    transport_id: string,
    name: string,
    bns: string,
    ens: string,
    type: ADDRESS_TYPE,
}
interface PeerMapProps {
  [key: string]: Peer
}

export const RingsContext = createContext<RingsContext>({
  client: null,
  async fetchPeers(): Promise<Peer[]> { return []},
  sendMessage: async () => {},
  connectByAddress: async () => {},
  createOffer: async () => {},
  answerOffer: async () => {},
  acceptAnswer: async () => {},
  turnUrl: '',
  setTurnUrl: () => {},
  nodeUrl: '',
  setNodeUrl: () => {},
  status: 'disconnected',
  node: '',
  nodeStatus: 'disconnected',
  setStatus: () => {},
  disconnect: () => {},
  state: {peerMap: {}, chatMap: {}, activePeers: [], activePeer: ''} as StateProps,
  dispatch: () => {},
  startChat: () => {},
  endChat: () => {},
  async asyncSendMessage(message: HttpMessageProps): Promise<any> {}
})

export const useRings = () => useContext(RingsContext)

interface ChatMapProps {
  [key: string]: {
    messages: Chat_props[],
    status: string,
  }
}

interface StateProps {
  peerMap: PeerMapProps,
  chatMap: ChatMapProps,
  activePeers: string[],
  activePeer: string,
}

const FETCH_PEERS = 'FETCH_PEERS'
const CHANGE_NAME = 'CHANGE_NAME'
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
const ACTIVE_CHAT = 'ACTIVE_CHAT'
const END_CHAT = 'END_CHAT'

const reducer = (state: StateProps, { type, payload }: { type: string, payload: any } ) => {
  // console.log('reducer', type, payload, state)

  switch (type) {
    // case FETCH_PEERS:
    //   const peerMap = state.peerMap
    //   const chatMap = state.chatMap

    //   const keys = Object.keys(state.peerMap)
    //   const disconnectedPeers = keys.filter(key => !payload.peers.includes(key))

    //   disconnectedPeers.forEach((address: string) => {
    //     peerMap[address] = {
    //       ...peerMap[address],
    //       state: 'disconnected',
    //     }
    //   })

    //   payload.peers.forEach(({ address, transport_pubkey, ...rest }: NodePeer) => {
    //     const { type, address: _address} = getAddressWithType(transport_pubkey.startsWith('1') ? transport_pubkey.replace(/^1/, '') : address)

    //     if (!state.peerMap[address]) {
    //         peerMap[address] = {
    //           ...rest,
    //           transport_pubkey: transport_pubkey.replace(/^1/, ''),
    //           address,
    //           name: formatAddress(_address),
    //           bns: '',
    //           ens: '',
    //           type,
    //         }

    //         chatMap[address] = {
    //           messages: [],
    //           status: ''
    //         }
    //     } else {
    //       peerMap[address] = {
    //         ...state.peerMap[address],
    //         ...rest,
    //       }
    //     }
    //   })

    //   return {
    //     ...state,
    //     peerMap,
    //     chatMap
    //   }
    case CHANGE_NAME:
      return {
        ...state,
        peerMap: {
          ...state.peerMap,
          [payload.peer]: {
            ...state.peerMap[payload.peer],
            [payload.key]: payload.name,
          }
        }
      }
    case ACTIVE_CHAT:
      return {
        ...state,
        chatMap: {
          ...state.chatMap,
          [payload.peer]: {
            ...state.chatMap[payload.peer],
            status: 'read',
          }
        },
        activePeer: payload.peer,
        activePeers: !state.activePeers.includes(payload.peer) ? [...state.activePeers, payload.peer] : state.activePeers
      }
    case END_CHAT:
      const activePeers = state.activePeers.filter(peer => peer !== payload.peer)

      return {
        ...state,
        chatMap: {
          ...state.chatMap,
          [payload.peer]: {
            ...state.chatMap[payload.peer],
            status: 'read',
          }
        },
        activePeer: activePeers.length ? activePeers[activePeers.length - 1] : '',
        activePeers
      }
    case RECEIVE_MESSAGE:
      return {
        ...state,
        chatMap: {
          ...state.chatMap,
          [payload.peer]: {
            messages: state.chatMap[payload.peer] ? [...state.chatMap[payload.peer].messages, payload.message] : [payload.message],
            status: state.activePeer === payload.peer ? 'read' : 'unread',
          }
        },
      }
    default: 
      return state
  }
}

interface MessageProps {
  [key: string]: number | string | null
}

interface TimerProps {
  [key: string]: ReturnType<typeof setInterval>
}

const RingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getBNS } = useBNS()
  const { account, unsignedInfo, signature, provider, addressType } = useMultiWeb3()

  const [turnUrl, setTurnUrl] = useState('')
  const [nodeUrl, setNodeUrl] = useState('')

  const MESSAGE = useRef<MessageProps>({})
  const TIMER = useRef<TimerProps>({})

  const [status, setStatus] = useState<string>('disconnected')

  const [client, setClient] = useState<Client | null>(null)
  const [wasm, setWasm] = useState<any>(null)

  const [node, setNode] = useState('')
  const [nodeStatus, setNodeStatus] = useState('disconnected')

  const [state, dispatch] = useReducer(reducer, { peerMap: {}, chatMap: {}, activePeers: [], activePeer: '' }) 

  const fetchPeers = useCallback(async () => {
    if (!client || status !== 'connected') {
      return []
    }

    const peers = await client.list_peers()
    // console.log(`peers`, peers)

    // if (peers && peers.length) {
    //   setNode(peers[0])
    //   setNodeStatus(peers[0].state)
    // }

    // dispatch({ type: FETCH_PEERS, payload: { peers } })

    // peers.forEach(({ address, state: status, transport_pubkey }: NodePeer) => {
    //   const { type } = getAddressWithType(transport_pubkey.startsWith('1') ? transport_pubkey.replace(/^1/, '') : address)

    //   let peer = address

    //   if (type === ADDRESS_TYPE.ED25519) {
    //     peer = transport_pubkey.replace(/^1/, '')
    //   }

    //   onlinerDispatch({ type: 'changeStatus', payload: { peer, status }})
    // })

    return peers
  }, [client, status, //onlinerDispatch
  ])

  const findServiceNode = useCallback(async () => {
    if (!client || status !== 'connected') {
      return 
    }

    if (node) {
      setNodeStatus('connected')

      return
    }

    try {
      console.group(`findServiceNode`)
      const serviceNodes = await client.lookup_service('ipfs_provider')
      console.log(`serviceNodes`, serviceNodes)

      if (serviceNodes && serviceNodes.length) {
        const node = serviceNodes.pop()
        setNode(node)
        setNodeStatus('connected')
      }
      console.groupEnd()
    } catch (e) {
      console.error(e)
    }
  }, [client, node, status])

  const resolveENS = useCallback(async (peers: string[]) => {
    if (provider) {
      peers.forEach(async (peer) => {
        const ens = await provider.lookupAddress(peer)

        if (ens) {
          const address = await provider.resolveName(ens)

          if (address && peer === address.toLowerCase()) {
            dispatch({ type: CHANGE_NAME, payload: { peer, key: 'ens', name: ens } })
          }
        }
      })
    }
  }, [provider])

  const resolveBNS = useCallback(async (peers: string[]) => {
    if (getBNS) {
      peers.forEach(async (peer) => {
        const bns = await getBNS(peer)

        if (bns) {
          dispatch({ type: CHANGE_NAME, payload: { peer, key: 'bns', name: bns } })
        }
      })
    }
  }, [getBNS])

  useEffect(() => {
    resolveBNS(Object.keys(state).filter((address) => state.peerMap[address] && state.peerMap[address].type === ADDRESS_TYPE.DEFAULT && !state.peerMap[address].bns))
    resolveENS(Object.keys(state).filter((address) => state.peerMap[address] && state.peerMap[address].type === ADDRESS_TYPE.DEFAULT && !state.peerMap[address].ens))
  }, [state, resolveENS, resolveBNS])

  const startChat = useCallback((address: string) => {
    if (address) {
      dispatch({ type: ACTIVE_CHAT, payload: { peer: address } })
    }
  }, [])

  const endChat = useCallback((address: string) => {
    if (address) {
      dispatch({ type: END_CHAT, payload: { peer: address } })
    }
  }, [])

  const sendMessage = useCallback(async (to: string, message: string) => {
    if (client) {
      console.group('send message')
      console.log(`to`, to)
      console.log(`message`, message)
      console.groupEnd()
      await client.send_message(to, new TextEncoder().encode(message))
      console.log(`send message success`)
      const { type } = getAddressWithType(account)

      dispatch({ type: RECEIVE_MESSAGE, payload: { peer: to, message: { from: type === ADDRESS_TYPE.DEFAULT ? account.toLowerCase() : account, to, message } } })
    }
  }, [client, account])

  const connectByAddress = useCallback(async (address: string) => {
    if (client && address) {
      const { type } = getAddressWithType(address)
      console.log(`connect by address: ${address} ${type}`)
      await client.connect_with_address(address, type)
      console.log(`connected`)
    }
  }, [client])

  const createOffer = useCallback(async () => {
    if (client) {
      const offer = await client.create_offer()

      return offer
    }
  }, [client])

  const answerOffer = useCallback(async (offer: any) => {
    if (client && offer) {
      const answer = await client.answer_offer(offer)

      return answer
    }
  }, [client])

  const acceptAnswer = useCallback(async (transportId: any, answer: any) => {
    if (client && transportId) {
      const result = await client.accept_answer(transportId, answer)

      return result
    }
  }, [client])

  const disconnect = useCallback(async () => {
    const peers = Object.keys(state.peerMap)

    if (client && peers.length) {
      try {
        console.log(`disconnect start`)
        const promises = peers.map(async (address) => await client.disconnect(address, addressType))

        await Promise.all(promises)
        console.log(`disconnect done`)
      } catch (e) {
        console.log(`disconnect error`, e)
      }
    }
  }, [client, state, addressType])

  const asyncSendMessage = useCallback((message: HttpMessageProps) => 
    new Promise(async (resolve, reject) => {
      try {
        if (!client) {
          reject('Not Connected to Node')
        }

        console.log(`message`, message)
        const { destination, method, path, headers } = message

        const txId = await client!.send_http_request(
          destination,
          'ipfs',
          method,
          path,
          BigInt(5000),
          headers
        )
        console.log(`txId`, txId)

        MESSAGE.current[txId as string] = 'pending' 
    
        let current = 0

        const interval = 1000
        // const timeout = 60 * 1000

        TIMER.current[txId as string] = setInterval(() => {
          if (MESSAGE.current[txId as string] !== 'pending') {
            clearInterval(TIMER.current[txId as string])
            delete TIMER.current[txId as string]

            resolve(MESSAGE.current[txId as string])
            delete MESSAGE.current[txId as string]
          }

          // current += interval

          // if (current > timeout) {
          //   clearInterval(TIMER.current[txId as string])
          //   delete TIMER.current[txId as string]

          //   reject(new Error('TIMEOUT'))
          // }
        } , interval)
    } catch (e) {
      reject(e)
    }
    }), [client])

  useEffect(() => {
    const turnUrl = localStorage.getItem('turnUrl') || process.env.NEXT_PUBLIC_TURN_URL!
    const nodeUrl = localStorage.getItem('nodeUrl') || process.env.NEXT_PUBLIC_NODE_URL!
    const node = localStorage.getItem('serviceNode') || process.env.NEXT_PUBLIC_SERVICE_NODE

    setTurnUrl(turnUrl)
    setNodeUrl(nodeUrl)

    if (node) {
      setNode(node)
      localStorage.setItem('serviceNode', node)
    }

    localStorage.setItem('turnUrl', turnUrl)
    localStorage.setItem('nodeUrl', nodeUrl)
  }, [])

  useEffect(() => {
    fetchPeers()

    const timer = setInterval(() => {
      fetchPeers()
    }, 5000)

    return () => {
      clearInterval(timer)
    }
  }, [fetchPeers])

  useEffect(() => {
    findServiceNode()
    
    const timer = setInterval(() => {
      if (node) {
        clearInterval(timer)
        return
      }

      findServiceNode()
    }, 3000)

    return () => {
      clearInterval(timer)
    }
  }, [client, status, findServiceNode, node])

  useEffect(() => {
    if (!wasm) {
      const initWasm = async () => {
        const w = await init()

        setWasm(w)
      }

      initWasm()
    }
  }, [wasm])

  const initClient = useCallback(async() => {
    if (account && wasm && turnUrl && nodeUrl && signature && unsignedInfo) {
      // console.log(`initClient`)
      debug(
        // process.env.NODE_ENV === 'development' || 
        typeof window !== 'undefined' && window.localStorage.getItem('debug') !== null
      ) 
      setStatus('connecting')

      const client = await Client.new_client(unsignedInfo, signature, turnUrl);
      // console.log(`client`, client)
      // @ts-ignore
      window.ringsNodeClient = client
      setClient(client)

      const callback = new MessageCallbackInstance(
        // custom message
        async (response: any, message: any) => {
          console.group('on custom message')
          const { relay } = response
          console.log(`relay`, relay)
          console.log(`destination`, relay.destination)
          console.log(message)
          console.log(new TextDecoder().decode(message))
          const to = relay.destination.replace(/^0x/, '')
          const from = relay.path[0].replace(/^0x/, '')
          console.log(`from`, from)
          console.log(`to`, to)
          console.groupEnd()

          dispatch({ 
            type: RECEIVE_MESSAGE, 
            payload: { 
              peer: from, 
              message: { 
                from, 
                to
                // message: new TextDecoder().decode(message) 
              } 
            } 
          })
        }, 
        // http response message
        async (response: any, message: any) => {
          console.group('on http response message')
          const { tx_id } = response
          console.log(`txId`, tx_id)
          console.log(`message`, message)
          if (MESSAGE.current[tx_id] === 'pending') {
            // const { http_server } = JSON.parse(new TextDecoder().decode(message))
            // console.log(`json`, http_server)
            if (message) {
              const { body, headers, ...rest }: { body: any, headers: Map<string, string>} = message
              const parsedHeaders: {[key: string]: string} = {}

              for (const [key, value] of headers.entries()) {
                parsedHeaders[key] = value
              }

              const parsedBody = new TextDecoder().decode(new Uint8Array(body))
              console.log(`parsed`, {...rest, headers: parsedHeaders, body: parsedBody })

              MESSAGE.current[tx_id] = JSON.stringify({ ...rest, headers: parsedHeaders, body: parsedBody })
            }
          }
          console.groupEnd()
        },
        async (
          relay: any, prev: String,
      ) => {
        // console.group('on builtin message')
        // console.log(relay)
        // console.log(prev)
        // console.groupEnd()
      },
      )

      await client.listen(callback)

      const promises = nodeUrl.split(';').map(async (url: string) => 
        await client.connect_peer_via_http(url)
      )

      try {
        await Promise.any(promises)
        setStatus('connected')
        // await client.connect_peer_via_http(nodeUrl)
      } catch (e) {
        console.error(e)
      }

      return () => {
        setStatus('disconnected')
      }
    }
  }, [account, wasm, turnUrl, nodeUrl, signature, unsignedInfo])

  useEffect(() => {
    if (account && wasm && turnUrl && nodeUrl && signature && unsignedInfo) {
      try {
        initClient()
      } catch (e) {
        console.log(`error`, e)
        setStatus('failed')
      }
    }
  }, [account, wasm, turnUrl, nodeUrl, initClient, signature, unsignedInfo])

  return (
    <RingsContext.Provider
      value={{
        client,
        fetchPeers,
        sendMessage,
        connectByAddress,
        createOffer,
        answerOffer,
        acceptAnswer,
        turnUrl,
        setTurnUrl,
        nodeUrl,
        setNodeUrl,
        status,
        node,
        nodeStatus,
        setStatus,
        disconnect,
        state,
        dispatch,
        startChat,
        endChat,
        asyncSendMessage
      }}
    >
      {children}
    </RingsContext.Provider>
  )
}

export default RingsProvider