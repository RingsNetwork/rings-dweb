import { useEffect, useCallback, useState } from 'react';

import { SpinnerRoundFilled, SpinnerDotted } from 'spinners-react'

import Head from 'next/head'
import Image from 'next/image';
import getConfig from 'next/config';

import useRings from '../hooks/useRings'
import useMultiWeb3 from '../hooks/useMultiWeb3';

import ThemeSwitch from '@/components/ThemeSwitch'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"

import LOGO from '../assets/logo.png'
import UniswapLogo from '../assets/uniswap.png'
import TornadoLogo from '../assets/tornado.svg'

const { publicRuntimeConfig } = getConfig()

const APP = {
  'uniswap': '/ipfs/bafybeiacslced5p7r4kwu33jwovohv5eejwyq7vfgypwhdszmvzrdtgu2e',
  'tornado.cash': '/ipns/tornadocash.eth'
}

interface LinkProps {
  [key: string]: string
}

const LINKS: LinkProps[] = [
  {
    title: 'RingNetwork Twitter',
    link: 'https://twitter.com/RingsNetworkio',
  },
  {
    title: 'BNS Twitter',
    link: 'https://twitter.com/bnsbtc',
  },
  {
    title: 'RingsNetwork GitHub',
    link: 'https://github.com/RingsNetwork',
  },
  {
    title: 'RingNetwork Whitepaper',
    link: 'https://raw.githubusercontent.com/RingsNetwork/whitepaper/master/rings.pdf',
  },
  {
    title: 'BNS Whitepaper',
    link: 'https://raw.githubusercontent.com/RingsNetwork/whitepaper/master/bns.pdf',
  },
  {
    title: 'PoS Whitepaper',
    link: 'https://raw.githubusercontent.com/RingsNetwork/whitepaper/master/pos.pdf',
  },
  {
    title: 'RingNetwork Website',
    link: 'https://ringsnetwork.io/',
  },
  {
    title: 'BNS .BTC Register',
    link: 'https://app.bns.org',
  },
  // {
  //   title: 'Chrome Extension',
  //   link: '#',
  // },
]

export default function Home() {
  const { account, accountName, setOpen } = useMultiWeb3()
  const { state, asyncSendMessage, node, nodeStatus } = useRings()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState('home')

  const sendMsg = useCallback((message: any) => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      //listen to messages
      navigator.serviceWorker.onmessage = async (event) => {
        if (node && event.data.type === 'asyncSend') {
          console.log(event.data)
          let data

          switch (event.data.action) {
            case 'FETCH_UNISWAP_INDEX':
              // console.log(`receive message from sw`, event.data)
              data = await asyncSendMessage({
                destination: node,
                method: 'GET',
                path: `${APP.uniswap}/index.html`,
                headers: {}
              })
              // console.log(`data`, JSON.parse(data))
              break
            case 'FETCH_UNISWAP_RESOURCE':
              data = await asyncSendMessage({
                destination: node,
                method: 'GET',
                path: `${APP.uniswap}${event.data.path}`,
                headers: {}
              })
              // console.log(`data`, JSON.parse(data))
              break
            case 'FETCH_TORNADOCASH_INDEX':
              // console.log(`receive message from sw`, event.data)
              data = await asyncSendMessage({
                destination: node,
                method: 'GET',
                path: `${APP['tornado.cash']}/index.html`,
                headers: {}
              })
              console.log(`data`, JSON.parse(data))
              break
            case 'FETCH_TORNADOCASH_RESOURCE':
              data = await asyncSendMessage({
                destination: node,
                method: 'GET',
                path: `${APP['tornado.cash']}${event.data.path}`,
                headers: {}
              })
              break
            default:
              data = []
              break
          }

          sendMsg({
            type: 'asyncResolved',
            data,
            uuid: event.data.uuid,
            action: event.data.action,
            path: event.data.path
          })
        }
      }
    }
  }, [sendMsg, state.peerMap, asyncSendMessage, node])

  const handleSwitchApp = useCallback((app: string) => {

    if (['uniswap', 'tornadocash'].includes(app)) {
      if (!account) {
        setOpen()
      } else {
        if (nodeStatus === 'connected') {
          setActive(app)
          setLoading(true)
        } else {
          toast({
            description: "Please wait till the service node is connected",
          })
        }
      }
    } else {
      setActive(app)
      setLoading(false)
    }
  }, [account, setOpen, nodeStatus, toast] )

  const handleUniswapIframeOnload = useCallback(() => {
    setLoading(false)
  }, [])

  const handleIframeOnload = useCallback(() => {
    const iframe: HTMLIFrameElement | null = document.querySelector('#tornadocash')

    if (iframe) {
      const timer: ReturnType<typeof setInterval> = setInterval(() => {
        if (iframe.contentDocument) {
          // document has a right padding 
          iframe.contentDocument.documentElement.style.overflow = 'hidden'

          // @ts-ignore
          if (iframe.contentWindow &&  iframe.contentWindow.$nuxt && iframe.contentDocument.querySelector('#__layout')) {
            // @ts-ignore
            iframe.contentWindow.$nuxt.context.app.router.push('/')
            clearInterval(timer)
            setLoading(false)
          }
        }
      }, 100)
    }
  }, [])

  return (
    <>
      <Head>
        <title>RingsNetwork Delab</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className='flex items-center justify-around w-screen h-screen backdrop-blur-sm'>
        {/* <div className="fixed top-0 right-0 w-full h-full">
          <video className='object-cover w-full h-full' width="320" height="240" autoPlay loop muted>
            <source src="https://assets.codepen.io/3364143/7btrrd.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div> */}

        <div className='relative bg-[var(--theme-bg-color)] flex flex-col max-w-[1250px] max-h-[860px] w-full h-[90vh] text-base font-bold rounded-3xl'>
          {/* header */}
          <div
            className="flex justify-between items-center border-b border-[var(--border-color)] p-[20px] h-[58px]"
          >
            <div className='w-[180px] md:w-[228px] flex items-center'>
              <Image src={LOGO} alt="" />
            </div>
            {
              account ? 
              <div className='flex items-center'>
                {
                  node && nodeStatus === 'connected' ?
                  <SpinnerRoundFilled size={45} thickness={45} speed={60} color="#36ad47" />:
                  <SpinnerRoundFilled size={45} thickness={45} speed={130} color="rgba(195, 40, 42, 1)" />
                }
                <div>
                  {accountName}
                </div>
              </div>:
              <Button onClick={setOpen}>Connect Wallet</Button>
            }
          </div>

          {/* wrapper */}
          <div className='flex flex-grow'>
            {/* sidebar */}
            <div className='basis-60 border-r border-[var(--border-color)] p-6 flex-shrink-0 flex flex-col justify-between'>
              <div className='font-medium text-[15px]'>
                <div className='text-[var(--inactive-color)] mb-2'>
                  Home
                </div>
                <div
                  className={`flex items-center py-2 px-3 text-sm rounded-md cursor-pointer duration-300 hover:bg-[var(--hover-menu-bg)]${active === 'home' ? ' bg-[var(--hover-menu-bg)]': ''}`}
                  onClick={() => handleSwitchApp('home')}
                >
                  {/* <svg viewBox="0 0 512 512" className='w-4 mr-2'>
                    <g xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                      <path d="M0 0h128v128H0zm0 0M192 0h128v128H192zm0 0M384 0h128v128H384zm0 0M0 192h128v128H0zm0 0" data-original="#bfc9d1" />
                    </g>
                    <path xmlns="http://www.w3.org/2000/svg" d="M192 192h128v128H192zm0 0" fill="currentColor" data-original="#82b1ff" />
                    <path xmlns="http://www.w3.org/2000/svg" d="M384 192h128v128H384zm0 0M0 384h128v128H0zm0 0M192 384h128v128H192zm0 0M384 384h128v128H384zm0 0" fill="currentColor" data-original="#bfc9d1" />
                  </svg> */}
                  Home
                </div>

                <div className='text-[var(--inactive-color)] mb-2 mt-5'>
                  dWeb
                </div>
                <div 
                  className={`flex items-center my-1 py-2 px-3 text-sm rounded-md cursor-pointer duration-300 hover:bg-[var(--hover-menu-bg)]${active === 'uniswap' ? ' bg-[var(--hover-menu-bg)]': ''}`}
                  onClick={() => handleSwitchApp('uniswap')}
                >
                  {/* <Image className='w-8 mr-1' src={UniswapLogo} alt="" /> */}
                  Uniswap
                </div>

                <div
                  className={`flex items-center py-2 px-3 text-sm rounded-md cursor-pointer duration-300 hover:bg-[var(--hover-menu-bg)]${active === 'tornadocash' ? ' bg-[var(--hover-menu-bg)]': ''}`}
                  onClick={() => handleSwitchApp('tornadocash')}
                >
                  {/* <Image className='w-6 mr-2' src={TornadoLogo} alt="" /> */}
                  TornadoCash
                </div>
              </div>

              <div className='font-light'>
                {/* <div className='text-xs text-[var(--inactive-color)] mb-3'>
                  Rings Node
                </div> */}
                <div className='mb-2 text-xs text-center whitespace-nowrap'>Rings Node: {publicRuntimeConfig?.ringsNodeVersion}</div>
                <div className='mb-2 text-xs text-center'>
                  Powered by <a href="https://ringsnetwork.io/">Ringsnetwork</a>
                </div>
              </div>

            </div>
            {/* content */}
            <div className='bg-[var(--theme-bg-color)] flex-grow rounded-br-3xl relative'>
              {
                active === 'home' ?
                <div className='text-[var(--theme-color)] px-8 pt-5'>
                  <div className='mt-0'>
                    <div className='text-center text-[var(--content-title-color)] mb-3'>Rings Network makes Internet more fair, independent and private.</div>
                  </div>
                  <div className='grid grid-cols-3 gap-4'>

                    <div className='p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)]'> 
                      <div>Decentralized P2P</div>
                      <div className='mt-5 text-sm font-normal'>
                        Rings Network is a peer-to-peer private communication network, enabling users to interact among Web3 and Web2 applications.
                      </div>
                    </div>

                    <div className='p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)]'> 
                      <div>Works in Browsers</div>
                      <div className='mt-5 text-sm font-normal'>
                        Full features node SDK for all modern browsers. Connect a full node with your web page in a minute.
                      </div>
                    </div>

                    <div className='p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)]'> 
                      <div>Private key as DID</div>
                      <div className='mt-5 text-sm font-normal'>
                        Works with all ECDSA chains and wallets. Works with secp256k1 chains(Ethereum, BSC, Avalanche, etc.), ed25519 chains(Solana, Aptos, etc.).
                      </div>
                    </div>

                    {
                      LINKS.map(({ title, link }, index ) => 
                        <div key={index} className='h-[166px] p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)] hover:scale-[1.02] hover:bg-[var(--theme-bg-color)]'> 
                          <div className='w-full h-full'>
                            <a className='block w-full h-full' href={link} target="_blank" rel="noopener noreferrer">
                              {title}
                            </a>
                          </div>
                        </div>
                      )
                    }

                    <div className='h-[166px] p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)]'> 
                      <div className='w-full h-full'>
                        Chrome Extension
                        <div className='mt-5 text-sm font-normal'>
                          Coming soon
                        </div>
                      </div>
                    </div>

                  </div>
                </div> :
                null
              }
              {
                active === 'uniswap' ?
                <iframe className='rounded-br-3xl' onLoad={handleUniswapIframeOnload} id="uniswap" width="100%" height="100%" src="/uniswap"></iframe> :
                null
              }
              {
                active === 'tornadocash' ?
                <iframe className='rounded-br-3xl' onLoad={handleIframeOnload} id="tornadocash" width="100%" height="100%" src="tornadocash"></iframe> :
                null
              }
              {
                loading ?
                <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full transition-all duration-100 bg-black/50 backdrop-blur-sm rounded-br-3xl'>
                  {/* @ts-ignore */}
                  <SpinnerDotted size={50} thickness={100} speed={100} color="#36ad47" secondaryColor="rgba(57, 172, 145, 0.21)" />
                </div>:
                null
              }
            </div>
          </div>
        </div> 

        <ThemeSwitch />
      </main>
    </>
  )
}
