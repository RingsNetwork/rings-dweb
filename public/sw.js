const ACTION = {
  FETCH_UNISWAP_INDEX: 'FETCH_UNISWAP_INDEX',
  FETCH_UNISWAP_RESOURCE: 'FETCH_UNISWAP_RESOURCE',
  FETCH_TORNADOCASH_INDEX: 'FETCH_TORNADOCASH_INDEX',
  FETCH_TORNADOCASH_RESOURCE: 'FETCH_TORNADOCASH_RESOURCE',
  FETCH_RESOURCE_DONE: 'FETCH_RESOURCE_DONE',
}

const RINGS_CACHE = 'RINGS_CACHE_V3'

const TIMER = {}

// message
const MESSAGE = {}

const isStaticResource = (url) => {
  return (
    !url.includes('favicon') &&
    // !url.includes('service-worker.js') &&
    (/.css$/.test(url) ||
      /.js$/.test(url) ||
      url.includes('.woff') ||
      url.includes('.woff2') ||
      url.includes('.jpg') ||
      url.includes('.png') ||
      url.includes('.svg') ||
      url.includes('.gif') ||
      url.includes('.ico') ||
      url.includes('.gz'))
  )
}

// send message to rings-node channel
const asyncSendMessage = (message) =>
  new Promise(async (resolve, reject) => {
    const uuid = crypto.randomUUID()

    MESSAGE[uuid] = null

    const allClients = await self.clients.matchAll()

    allClients.map((client) =>
      client.postMessage({...message, uuid, type: 'asyncSend'})
    )

    const interval = 10

    TIMER[uuid] = setInterval(() => {
      if (MESSAGE[uuid]) {
        clearInterval(TIMER[uuid])
        delete TIMER[uuid]

        resolve(MESSAGE[uuid])
        delete MESSAGE[uuid]
      }
    }, interval)
  })

self.addEventListener('message', (event) => {
  const {
    data: {data, uuid, path},
  } = event

  if (MESSAGE[uuid] === null) {
    MESSAGE[uuid] = data

    self.clients.matchAll().then((clients) =>
      clients.map((client) =>
        client.postMessage({
          path,
          action: ACTION.FETCH_RESOURCE_DONE,
          type: 'resolved',
        })
      )
    )
  }
})

const getUniswapIndex = async () => {
  const response = await asyncSendMessage({
    action: ACTION.FETCH_UNISWAP_INDEX,
    path: 'index.html',
  })
  const {body, headers, status} = response
  const options = {
    statusText: 'A Rings Network response!',
    status,
    headers,
  }

  return new Response(body, options)
}

const getUniswapResource = async (path) => {
  const response = await asyncSendMessage({
    action: ACTION.FETCH_UNISWAP_RESOURCE,
    path,
  })
  const {body, headers, status} = response
  const options = {
    statusText: 'A Rings Network response!',
    status,
    headers,
  }

  return new Response(body, options)
}

const getTornadoCashIndex = async () => {
  const response = await asyncSendMessage({
    action: ACTION.FETCH_TORNADOCASH_INDEX,
    path: 'index.html',
  })
  const {body, headers, status} = response
  const options = {
    statusText: 'A Rings Network response!',
    status,
    headers,
  }

  return new Response(body, options)
}

const getTornadoCashResource = async (path) => {
  const response = await asyncSendMessage({
    action: ACTION.FETCH_TORNADOCASH_RESOURCE,
    path,
  })
  const {body, headers, status, rawBody} = response
  const options = {
    statusText: 'A Rings Network response!',
    status,
    headers,
  }

  // .gz file shoud return raw body
  const isGz = headers['x-ipfs-path'] && headers['x-ipfs-path'].endsWith('.gz')

  return new Response(isGz ? rawBody : body, options)
}

// Here comes the install event!
// This only happens once, when the browser sees this
// version of the ServiceWorker for the first time.
self.addEventListener('install', function (event) {
  if (self.skipWaiting) {
    self.skipWaiting()
  }

  // We pass a promise to event.waitUntil to signal how
  // long install takes, and if it failed
  // if (typeof window !== 'undefined') {
  //   event.waitUntil(
  //     // We open a cache…
  //     caches.open('simple-sw-v1').then(function(cache) {
  //       // And add resources to it
  //       return cache.addAll([
  //         './',
  //         'style.css',
  //         'logging.js'
  //       ]);
  //     })
  //   );
  // }
})

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', async function (event) {
  const {
    request: {url, referrer},
  } = event
  const {pathname} = new URL(url)
  // console.log(event.request)
  // console.log(`url`, url)
  // console.log(`pathname`, pathname)

  if (referrer.includes('/uniswap') && isStaticResource(url)) {
    event.respondWith(
      caches.open(RINGS_CACHE).then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
          return (
            cachedResponse ||
            getUniswapResource(pathname).then((fetchedResponse) => {
              // console.log(`cache`, event.request, fetchedResponse.clone())
              if (fetchedResponse.ok) {
                cache.put(event.request, fetchedResponse.clone())
              }

              return fetchedResponse
            })
          )
        })
      )
    )

    return
    // } else if (
    //   url.includes('tornado.json.gz') ||
    //   url.includes('tornadoProvingKey.bin.gz')
    // ) {
    //   event.respondWith(getTornadoCashResource(pathname))
  } else if (
    url.includes('tornado.json.gz') ||
    url.includes('tornadoProvingKey.bin.gz') ||
    (referrer.includes('/tornadocash') && isStaticResource(url))
  ) {
    event.respondWith(
      caches.open(RINGS_CACHE).then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
          return (
            cachedResponse ||
            getTornadoCashResource(pathname).then((fetchedResponse) => {
              // console.log(`cache`, event.request, fetchedResponse.clone())
              if (fetchedResponse.ok) {
                cache.put(event.request, fetchedResponse.clone())
              }

              return fetchedResponse
            })
          )
        })
      )
    )

    return
  } else {
    if (pathname === '/uniswap') {
      // event.respondWith(getUniswapIndex())
      event.respondWith(
        caches.open(RINGS_CACHE).then((cache) => {
          return cache.match(event.request).then((cachedResponse) => {
            // console.log(`cachedResponse`, cachedResponse)
            return (
              cachedResponse ||
              getUniswapIndex().then((fetchedResponse) => {
                if (fetchedResponse.ok) {
                  cache.put(event.request, fetchedResponse.clone())
                }

                return fetchedResponse
              })
            )
          })
        })
      )

      return
    }

    if (pathname === '/tornadocash') {
      // event.respondWith(getTornadoCashIndex())
      event.respondWith(
        caches.open(RINGS_CACHE).then((cache) => {
          return cache.match(event.request).then((cachedResponse) => {
            // console.log(`cachedResponse`, cachedResponse)
            return (
              cachedResponse ||
              getTornadoCashIndex().then((fetchedResponse) => {
                if (fetchedResponse.ok) {
                  cache.put(event.request, fetchedResponse.clone())
                }

                return fetchedResponse
              })
            )
          })
        })
      )

      return
    }

    // Calling event.respondWith means we're in charge
    // of providing the response. We pass in a promise
    // that resolves with a response object
    event.respondWith(
      // First we look for something in the caches that
      // matches the request
      caches.match(event.request).then(function (response) {
        // If we get something, we return it, otherwise
        // it's null, and we'll pass the request to
        // fetch, which will use the network.
        return response || fetch(event.request)
      })
    )
  }
})
