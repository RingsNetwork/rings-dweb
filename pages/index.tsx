import { useEffect, useCallback, useState, useRef } from 'react';

import { SpinnerRoundFilled, SpinnerDotted } from 'spinners-react'
import { Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Head from 'next/head'
import Image from 'next/image';
import getConfig from 'next/config';

import { Web3Button } from "@web3modal/react"
import { useRings, Status } from '@ringsnetwork/rings-provider'

import useMultiWeb3 from '../hooks/useMultiWeb3';

import ThemeSwitch from '@/components/ThemeSwitch'
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"

import { useToast } from "@/hooks/useToast"

import LOGO from '../assets/logo.png'

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
  const { account, unsignedInfo, signature } = useMultiWeb3()
  const { 
    ringsNodeClient, 
    createRingsNodeClient, 
    serviceNodeStatus, 
    sendHttpRequest, 
    clearCache
  } = useRings()
  
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState('home')

  const sendMsg = useCallback((message: any) => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message)
    }
  }, [])

  const handleClearCache = useCallback(() => {
    clearCache()

    toast({
      title: 'Cache cleared',
      duration: 2000,
    })
  }, [clearCache, toast])

  useEffect(() => {
    if (!ringsNodeClient && account && unsignedInfo && signature) {
      createRingsNodeClient({ 
        unsignedInfo, 
        signature, 
        autoConnectServiceNode: true, 
      })
    }
  }, [account, ringsNodeClient, unsignedInfo, signature, createRingsNodeClient])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      //listen to messages
      navigator.serviceWorker.onmessage = async (event) => {
        // console.log(`event.data`, event.data)
        if (
          serviceNodeStatus === Status.CONNECTED && 
          event.data.type === 'asyncSend'
        ) {
          let data

          switch (event.data.action) {
            case 'FETCH_UNISWAP_INDEX':
              // console.log(`receive message from sw`, event.data)
              data = await sendHttpRequest({
                method: 'GET',
                path: `${APP.uniswap}/index.html`,
                headers: {}
              })
              break
            case 'FETCH_UNISWAP_RESOURCE':
              data = await sendHttpRequest({
                method: 'GET',
                path: `${APP.uniswap}${event.data.path}`,
                headers: {}
              })
              break
            case 'FETCH_TORNADOCASH_INDEX':
              // console.log(`receive message from sw`, event.data)
              data = await sendHttpRequest({
                method: 'GET',
                path: `${APP['tornado.cash']}/index.html`,
                headers: {}
              })
              break
            case 'FETCH_TORNADOCASH_RESOURCE':
              data = await sendHttpRequest({
                method: 'GET',
                path: `${APP['tornado.cash']}${event.data.path}`,
                headers: {}
              })
              break
            default:
              data = []
              break
          }
          // console.log(`data`, data)

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
  }, [sendMsg, sendHttpRequest, serviceNodeStatus])

  const handleOpenInChrome = () => {
    const universalLink = `googlechrome://${encodeURIComponent(window.location.href)}`

    window.location.href = universalLink
  }

  const handleSwitchApp = useCallback((app: string) => {
    if (typeof window !== 'undefined' && !navigator.serviceWorker) {
      toast({
        description: "This feature is not available in your current browser. Please open the link in Chrome to access all functionalities.",
        action: <ToastAction onClick={handleOpenInChrome} altText="Open in chrome">Open in chrome</ToastAction>
      })

      return
    }

    if (['uniswap', 'tornadocash'].includes(app)) {
      if (!account) {
        // setOpen()
        document.querySelector('w3m-core-button')?.shadowRoot?.children[0]?.shadowRoot?.children[0]?.shadowRoot?.querySelector('button')?.click()
      } else {
        if (serviceNodeStatus === Status.CONNECTED) {
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
  }, [account, serviceNodeStatus, toast] )

  const handleUniswapIframeOnload = useCallback(() => {
    setLoading(false)
  }, [])

  const handleIframeOnload = useCallback(() => {
    const iframe: HTMLIFrameElement | null = document.querySelector('#tornadocash')

    if (iframe) {
      const timer: ReturnType<typeof setInterval> = setInterval(() => {
        if (iframe.contentDocument) {
          // document has a right padding 
          iframe.contentDocument.documentElement.style.overflowX = 'hidden'

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
        <title>RingsNetwork Delabs</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,shrink-to-fit=no" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className='flex items-center justify-around w-full min-h-screen md:h-screen md:w-screen backdrop-blur-sm'>
        <div className='bg-[var(--theme-bg-color)] flex flex-col md:max-w-[1250px] md:max-h-[860px] w-full min-h-screen md:min-h-[90vh] md:h-[90vh] text-base font-bold md:rounded-3xl'>
          {/* header */}
          <div
            className="flex justify-between items-center border-b border-[var(--border-color)] p-[20px] h-[58px]"
          >
            <div className='w-[160px] md:w-[228px] flex items-center'>
              <Image src={LOGO} alt="" />
            </div>
            <div className='flex items-center'>
              {
                account ?
                serviceNodeStatus === Status.CONNECTED ?
                <SpinnerRoundFilled size={45} thickness={45} speed={60} color="#36ad47" />:
                <SpinnerRoundFilled size={45} thickness={45} speed={130} color="rgba(195, 40, 42, 1)" /> :
                null
              }
              <Web3Button label="Connect Wallet" icon="hide" />
              <DropdownMenu>
                <DropdownMenuTrigger><Settings className='ml-2' size="18" /></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Button onClick={handleClearCache} variant="link">Clear Cache</Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* {
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
            } */}
          </div>

          {/* wrapper */}
          <div className='flex flex-col flex-grow md:flex-row'>
            {/* sidebar */}
            <div className='md:basis-60 md:border-r border-[var(--border-color)] p-6 flex-shrink-0 flex flex-col justify-between'>
              <div className='flex flex-row md:flex-col font-medium text-[15px]'>
                <div className='hidden md:block text-[var(--inactive-color)] mb-2'>
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

                <div className='hidden md:block text-[var(--inactive-color)] mb-2 mt-5'>
                  dWeb
                </div>
                <div 
                  className={`flex items-center md:my-1 py-2 px-3 mx-2 h-full md:mx-0 text-sm rounded-md cursor-pointer duration-300 hover:bg-[var(--hover-menu-bg)]${active === 'uniswap' ? ' bg-[var(--hover-menu-bg)]': ''}`}
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

              <div className='hidden font-light md:block'>
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
            <div className='bg-[var(--theme-bg-color)] flex-grow md:rounded-br-3xl relative'>
              {
                active === 'home' ?
                <div className='text-[var(--theme-color)] px-8 pt-5'>
                  <div className='mt-0'>
                    <div className='text-center text-[var(--content-title-color)] mb-3'>Rings Network makes Internet more fair, independent and private.</div>
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>

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
                        <div key={index} className='md:h-[166px] p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)] hover:scale-[1.02] hover:bg-[var(--theme-bg-color)]'> 
                          <div className='w-full h-full'>
                            <a className='block w-full h-full' href={link} target="_blank" rel="noopener noreferrer">
                              {title}
                            </a>
                          </div>
                        </div>
                      )
                    }

                    <div className='h-[100px] mb-5 md:mb-0 md:h-[166px] p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)]'> 
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
                <iframe className='min-h-[calc(100vh-142px)] md:min-h-[calc(90vh-58px)] md:rounded-br-3xl' onLoad={handleUniswapIframeOnload} id="uniswap" width="100%" height="100%" src="/uniswap"></iframe> :
                null
              }
              {
                active === 'tornadocash' ?
                <iframe className='min-h-[calc(100vh-142px)] md:min-h-[calc(90vh-58px)] md:rounded-br-3xl' onLoad={handleIframeOnload} id="tornadocash" width="100%" height="100%" src="tornadocash"></iframe> :  
                null
              }
              {
                loading ?
                <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full transition-all duration-100 bg-black/50 backdrop-blur-sm md:rounded-br-3xl'>
                  {/* @ts-ignore */}
                  <SpinnerDotted size={50} thickness={100} speed={100} color="#36ad47" secondarycolor="rgba(57, 172, 145, 0.21)" />
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
