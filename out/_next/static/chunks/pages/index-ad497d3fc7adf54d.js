(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{11752:function(e,t,r){e.exports=r(7905)},48312:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return r(20009)}])},20009:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return T}});var n=r(85893),o=r(67294),s=function(){return(s=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function a(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)0>t.indexOf(n[o])&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r}var i={color:"#38ad48",enabled:!0,size:50,style:{}},l=function(e){var t=function(t){var r=t.color,n=t.enabled,i=t.size,l=t.style,c=s(s({},a(t,["color","enabled","size","style"])),{style:s({color:r,overflow:"visible",width:parseFloat(i.toString()).toString()===i.toString()?i+"px":i.toString()},l)});return n?o.createElement(e,s({},c)):null};return t.defaultProps=i,t},c={speed:100,still:!1,thickness:100};function d(e,t){void 0===t&&(t={});var r=t.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],o=document.createElement("style");o.type="text/css","top"===r&&n.firstChild?n.insertBefore(o,n.firstChild):n.appendChild(o),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(document.createTextNode(e))}}s(s({},c),{secondaryColor:"rgba(0,0,0,0.44)"}),d("@keyframes spinners-react-round-filled-outer{40%,60%{transform:scale(0)}}@keyframes spinners-react-round-filled-center{30%,70%{transform:scale(0)}}@keyframes spinners-react-round-filled-inner{20%,80%{transform:scale(0)}}");var m=[{r:4},{name:"spinners-react-round-filled-inner",r:12.66},{name:"spinners-react-round-filled-center",r:20.32},{name:"spinners-react-round-filled-outer",r:27.5}],h=function(e){var t=e.speed,r=e.still,n=e.thickness,i=a(e,["speed","still","thickness"]);return o.createElement("svg",s({fill:"none"},i,{viewBox:"0 0 66 66"}),m.map(function(e){return o.createElement("circle",{key:e.name||"still",cx:"33",cy:"33",fill:"currentColor",r:e.r*(e.name?n/100:1),style:{opacity:e.name?.25:1,transformOrigin:"center",animation:!e.name||r?"none":e.name+" "+140/t+"s ease-in-out infinite"}})}))};h.defaultProps=c;var u=l(h);d("@keyframes spinners-react-dotted-center{0%,15%,85%,to{transform:scale(0)}40%,50%{transform:scale(1)}84%{transform:scale(.45)}}@keyframes spinners-react-dotted-shrink{50%{transform:translate(0)}}");var p=[{x:22,y:-20},{x:29,y:0},{x:22,y:20},{x:0,y:30},{x:-23,y:20},{x:-30,y:0},{x:-23,y:-20},{x:0,y:-30}],x=function(e){var t=e.speed,r=e.still,n=e.thickness,i=a(e,["speed","still","thickness"]),l=200/t;return o.createElement("svg",s({fill:"none",viewBox:"0 0 66 66"},i),p.map(function(e,t){return o.createElement("circle",{key:e.x+"-"+e.y,cx:"33",cy:"33",fill:"currentColor",r:3*(n/100),style:s({transform:"translate("+e.x+"px, "+e.y+"px)"},r?{}:{animation:"spinners-react-dotted-shrink "+l+"s cubic-bezier(0, 0.9, 0, 0.9) "+l/20*t+"s infinite"})})}),o.createElement("circle",{cx:"33",cy:"33",fill:"currentColor",r:6*(n/100),style:r?{display:"none"}:{animation:"spinners-react-dotted-center "+l+"s ease-out infinite",transformOrigin:"center"}}))};x.defaultProps=c;var f=l(x),v=r(9008),b=r.n(v),g=r(25675),w=r.n(g),k=r(11752),y=r.n(k),j=r(50555),N=r(58474).Z1,C=r(86316),A=r(82010);function E(){let{theme:e,setTheme:t}=(0,A.F)(),r=(0,o.useCallback)(()=>{t("light"===e?"dark":"light")},[e,t]);return(0,n.jsx)("div",{className:"hidden md:block fixed rounded-full bottom-20 right-8 bg-[var(--dropdown-bg)] p-2 cursor-pointer z-10",onClick:r,children:(0,n.jsx)("svg",{className:"w-6 flex-shrink-0 fill-[#ffce45] stroke-[#ffce45] duration-500",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:"1.5",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:(0,n.jsx)("path",{d:"M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"})})})}var S=r(50355),R=r(53940),O={src:"/_next/static/media/logo.e9473cec.png",height:196,width:2238,blurDataURL:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAABCAYAAADjAO9DAAAAJklEQVR4nGO8o6S68f///wxAcIKRkUEcyPwDZP9iZGSU/Pv/PwcA2QgMx/OYzt0AAAAASUVORK5CYII=",blurWidth:8,blurHeight:1};let{publicRuntimeConfig:W}=y()(),_={uniswap:"/ipfs/bafybeiacslced5p7r4kwu33jwovohv5eejwyq7vfgypwhdszmvzrdtgu2e","tornado.cash":"/ipns/tornadocash.eth"},P=[{title:"RingNetwork Twitter",link:"https://twitter.com/RingsNetworkio"},{title:"BNS Twitter",link:"https://twitter.com/bnsbtc"},{title:"RingsNetwork GitHub",link:"https://github.com/RingsNetwork"},{title:"RingNetwork Whitepaper",link:"https://raw.githubusercontent.com/RingsNetwork/whitepaper/master/rings.pdf"},{title:"BNS Whitepaper",link:"https://raw.githubusercontent.com/RingsNetwork/whitepaper/master/bns.pdf"},{title:"PoS Whitepaper",link:"https://raw.githubusercontent.com/RingsNetwork/whitepaper/master/pos.pdf"},{title:"RingNetwork Website",link:"https://ringsnetwork.io/"},{title:"BNS .BTC Register",link:"https://app.bns.org"}];function T(){let{account:e,accountName:t,setOpen:r}=(0,C.Z)(),{state:s,asyncSendMessage:a,node:i,nodeStatus:l}=N(),{toast:c}=(0,R.pm)(),[d,m]=(0,o.useState)(!1),[h,p]=(0,o.useState)("home"),x=(0,o.useCallback)(e=>{navigator.serviceWorker&&navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage(e)},[]);(0,o.useEffect)(()=>{"serviceWorker"in navigator&&(navigator.serviceWorker.onmessage=async e=>{if(console.log("event.data",e.data),i&&"asyncSend"===e.data.type){let t;switch(e.data.action){case"FETCH_UNISWAP_INDEX":t=await a({destination:i,method:"GET",path:"".concat(_.uniswap,"/index.html"),headers:{}});break;case"FETCH_UNISWAP_RESOURCE":t=await a({destination:i,method:"GET",path:"".concat(_.uniswap).concat(e.data.path),headers:{}});break;case"FETCH_TORNADOCASH_INDEX":t=await a({destination:i,method:"GET",path:"".concat(_["tornado.cash"],"/index.html"),headers:{}});break;case"FETCH_TORNADOCASH_RESOURCE":t=await a({destination:i,method:"GET",path:"".concat(_["tornado.cash"]).concat(e.data.path),headers:{}});break;default:t=[]}x({type:"asyncResolved",data:t,uuid:e.data.uuid,action:e.data.action,path:e.data.path})}})},[x,s.peerMap,a,i]);let v=()=>{let e="googlechrome://".concat(encodeURIComponent(window.location.href));window.location.href=e},g=(0,o.useCallback)(t=>{if(!navigator.serviceWorker){c({description:"This feature is not available in your current browser. Please open the link in Chrome to access all functionalities.",action:(0,n.jsx)(S.gD,{onClick:v,altText:"Open in chrome",children:"Open in chrome"})});return}if(["uniswap","tornadocash"].includes(t)){if(e)"connected"===l?(p(t),m(!0)):c({description:"Please wait till the service node is connected"});else{var r,o,s,a,i,d,h;null===(r=null===(o=null===(s=null===(a=document.querySelector("w3m-core-button"))||void 0===a?void 0:null===(i=a.shadowRoot)||void 0===i?void 0:i.children[0])||void 0===s?void 0:null===(d=s.shadowRoot)||void 0===d?void 0:d.children[0])||void 0===o?void 0:null===(h=o.shadowRoot)||void 0===h?void 0:h.querySelector("button"))||void 0===r||r.click()}}else p(t),m(!1)},[e,l,c]),k=(0,o.useCallback)(()=>{m(!1)},[]),y=(0,o.useCallback)(()=>{let e=document.querySelector("#tornadocash");if(e){let t=setInterval(()=>{e.contentDocument&&(e.contentDocument.documentElement.style.overflowX="hidden",e.contentWindow&&e.contentWindow.$nuxt&&e.contentDocument.querySelector("#__layout")&&(e.contentWindow.$nuxt.context.app.router.push("/"),clearInterval(t),m(!1)))},100)}},[]);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(b(),{children:[(0,n.jsx)("title",{children:"RingsNetwork Delabs"}),(0,n.jsx)("meta",{name:"description",content:""}),(0,n.jsx)("meta",{name:"viewport",content:"width=device-width,initial-scale=1,maximum-scale=1,shrink-to-fit=no"}),(0,n.jsx)("link",{rel:"icon",href:"/favicon.png"})]}),(0,n.jsxs)("main",{className:"flex items-center justify-around w-full min-h-screen md:h-screen md:w-screen backdrop-blur-sm",children:[(0,n.jsxs)("div",{className:"bg-[var(--theme-bg-color)] flex flex-col md:max-w-[1250px] md:max-h-[860px] w-full min-h-screen md:min-h-[90vh] md:h-[90vh] text-base font-bold md:rounded-3xl",children:[(0,n.jsxs)("div",{className:"flex justify-between items-center border-b border-[var(--border-color)] p-[20px] h-[58px]",children:[(0,n.jsx)("div",{className:"w-[180px] md:w-[228px] flex items-center",children:(0,n.jsx)(w(),{src:O,alt:""})}),(0,n.jsxs)("div",{className:"flex items-center",children:[e?i&&"connected"===l?(0,n.jsx)(u,{size:45,thickness:45,speed:60,color:"#36ad47"}):(0,n.jsx)(u,{size:45,thickness:45,speed:130,color:"rgba(195, 40, 42, 1)"}):null,(0,n.jsx)(j.tn,{label:"Connect Wallet",icon:"hide"})]})]}),(0,n.jsxs)("div",{className:"flex flex-col flex-grow md:flex-row",children:[(0,n.jsxs)("div",{className:"md:basis-60 md:border-r border-[var(--border-color)] p-6 flex-shrink-0 flex flex-col justify-between",children:[(0,n.jsxs)("div",{className:"flex flex-row md:flex-col font-medium text-[15px]",children:[(0,n.jsx)("div",{className:"hidden md:block text-[var(--inactive-color)] mb-2",children:"Home"}),(0,n.jsx)("div",{className:"flex items-center py-2 px-3 text-sm rounded-md cursor-pointer duration-300 hover:bg-[var(--hover-menu-bg)]".concat("home"===h?" bg-[var(--hover-menu-bg)]":""),onClick:()=>g("home"),children:"Home"}),(0,n.jsx)("div",{className:"hidden md:block text-[var(--inactive-color)] mb-2 mt-5",children:"dWeb"}),(0,n.jsx)("div",{className:"flex items-center md:my-1 py-2 px-3 mx-2 h-full md:mx-0 text-sm rounded-md cursor-pointer duration-300 hover:bg-[var(--hover-menu-bg)]".concat("uniswap"===h?" bg-[var(--hover-menu-bg)]":""),onClick:()=>g("uniswap"),children:"Uniswap"}),(0,n.jsx)("div",{className:"flex items-center py-2 px-3 text-sm rounded-md cursor-pointer duration-300 hover:bg-[var(--hover-menu-bg)]".concat("tornadocash"===h?" bg-[var(--hover-menu-bg)]":""),onClick:()=>g("tornadocash"),children:"TornadoCash"})]}),(0,n.jsxs)("div",{className:"hidden font-light md:block",children:[(0,n.jsxs)("div",{className:"mb-2 text-xs text-center whitespace-nowrap",children:["Rings Node: ",null==W?void 0:W.ringsNodeVersion]}),(0,n.jsxs)("div",{className:"mb-2 text-xs text-center",children:["Powered by ",(0,n.jsx)("a",{href:"https://ringsnetwork.io/",children:"Ringsnetwork"})]})]})]}),(0,n.jsxs)("div",{className:"bg-[var(--theme-bg-color)] flex-grow md:rounded-br-3xl relative",children:["home"===h?(0,n.jsxs)("div",{className:"text-[var(--theme-color)] px-8 pt-5",children:[(0,n.jsx)("div",{className:"mt-0",children:(0,n.jsx)("div",{className:"text-center text-[var(--content-title-color)] mb-3",children:"Rings Network makes Internet more fair, independent and private."})}),(0,n.jsxs)("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-3",children:[(0,n.jsxs)("div",{className:"p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)]",children:[(0,n.jsx)("div",{children:"Decentralized P2P"}),(0,n.jsx)("div",{className:"mt-5 text-sm font-normal",children:"Rings Network is a peer-to-peer private communication network, enabling users to interact among Web3 and Web2 applications."})]}),(0,n.jsxs)("div",{className:"p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)]",children:[(0,n.jsx)("div",{children:"Works in Browsers"}),(0,n.jsx)("div",{className:"mt-5 text-sm font-normal",children:"Full features node SDK for all modern browsers. Connect a full node with your web page in a minute."})]}),(0,n.jsxs)("div",{className:"p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)]",children:[(0,n.jsx)("div",{children:"Private key as DID"}),(0,n.jsx)("div",{className:"mt-5 text-sm font-normal",children:"Works with all ECDSA chains and wallets. Works with secp256k1 chains(Ethereum, BSC, Avalanche, etc.), ed25519 chains(Solana, Aptos, etc.)."})]}),P.map((e,t)=>{let{title:r,link:o}=e;return(0,n.jsx)("div",{className:"md:h-[166px] p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)] hover:scale-[1.02] hover:bg-[var(--theme-bg-color)]",children:(0,n.jsx)("div",{className:"w-full h-full",children:(0,n.jsx)("a",{className:"block w-full h-full",href:o,target:"_blank",rel:"noopener noreferrer",children:r})})},t)}),(0,n.jsx)("div",{className:"h-[100px] mb-5 md:mb-0 md:h-[166px] p-5 text-base rounded-2xl border border-[var(--border-color)] bg-[var(--content-bg)]",children:(0,n.jsxs)("div",{className:"w-full h-full",children:["Chrome Extension",(0,n.jsx)("div",{className:"mt-5 text-sm font-normal",children:"Coming soon"})]})})]})]}):null,"uniswap"===h?(0,n.jsx)("iframe",{className:"min-h-[calc(100vh-142px)] md:min-h-[calc(90vh-58px)] md:rounded-br-3xl",onLoad:k,id:"uniswap",width:"100%",height:"100%",src:"/uniswap"}):null,"tornadocash"===h?(0,n.jsx)("iframe",{className:"min-h-[calc(100vh-142px)] md:min-h-[calc(90vh-58px)] md:rounded-br-3xl",onLoad:y,id:"tornadocash",width:"100%",height:"100%",src:"tornadocash"}):null,d?(0,n.jsx)("div",{className:"absolute top-0 left-0 flex items-center justify-center w-full h-full transition-all duration-100 bg-black/50 backdrop-blur-sm md:rounded-br-3xl",children:(0,n.jsx)(f,{size:50,thickness:100,speed:100,color:"#36ad47",secondarycolor:"rgba(57, 172, 145, 0.21)"})}):null]})]})]}),(0,n.jsx)(E,{})]})]})}},9008:function(e,t,r){e.exports=r(42636)}},function(e){e.O(0,[774,888,179],function(){return e(e.s=48312)}),_N_E=e.O()}]);