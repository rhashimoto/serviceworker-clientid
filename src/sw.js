globalThis.addEventListener('activate', event => {
  // Control pages immediately.
  // https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim
  //@ts-ignore ExtendableEvent
  event.waitUntil(clients.claim());
});

// Establish a MessageChannel to the Window for displaying status.
let messagePort;
globalThis.addEventListener('message', async event => {
  messagePort = event.ports[0];
  messagePort.start();
  messagePort.postMessage('Hello from Service Worker!');
});

// Watch for requests.
globalThis.addEventListener('fetch', async event => {
  if (messagePort) {
    // Log the clientId and all controlled clients.
    const url = new URL(event.request.url);
    const clients = (await globalThis.clients.matchAll({ type: 'all' }))
      .map(client => ({
        frameType: client.frameType,
        id: client.id,
        type: client.type,
        url: client.url
      }));
    messagePort.postMessage(`
      ${event.clientId} ${url.pathname}\n${JSON.stringify(clients, null, 2)}`.trim());
  }
});