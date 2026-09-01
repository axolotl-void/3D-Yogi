import fs from 'node:fs';

const base = 'http://localhost:3000';
const outputDir = '/var/folders/h8/l5vbsfdd5hx3663yfzlyyzwr0000gn/T/opencode';
const pages = await (await fetch('http://localhost:9222/json')).json();
const page = pages.find((entry) => entry.type === 'page');

if (!page) throw new Error('No debuggable Chrome page found');

const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
const events = [];
let sequence = 0;

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
  } else {
    events.push(message);
  }
});

await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

function command(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(JSON.stringify(result.exceptionDetails));
  }
  return result.result?.value;
}

async function screenshot(name) {
  const result = await command('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${outputDir}/${name}.png`, Buffer.from(result.data, 'base64'));
}

async function inspect(label) {
  const state = await evaluate(`(() => ({
    url: location.href,
    title: document.title,
    body: document.body.innerText,
    canvases: [...document.querySelectorAll('canvas')].map((canvas) => ({
      width: canvas.width,
      height: canvas.height,
      cssWidth: canvas.clientWidth,
      cssHeight: canvas.clientHeight,
      context: Boolean(canvas.getContext('webgl2')),
    })),
    bodyChildren: [...document.body.children].map((node) => ({
      tag: node.tagName,
      id: node.id,
      className: node.className,
    })),
    html: document.body.innerHTML.slice(0, 1200),
    webgl: (() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      return gl ? {
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
      } : null;
    })(),
  }))()`);
  console.log(label, JSON.stringify(state));
}

await command('Page.enable');
await command('Runtime.enable');
await command('Log.enable');
await command('Network.enable');
await command('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await command('Page.navigate', { url: `${base}/` });
await sleep(8000);
await inspect('initial');
await screenshot('webgl-initial');

await command('Input.dispatchMouseEvent', {
  type: 'mouseMoved',
  x: 720,
  y: 450,
});

for (let index = 0; index < 72; index += 1) {
  await command('Input.dispatchMouseEvent', {
    type: 'mouseWheel',
    x: 720,
    y: 450,
    deltaX: 0,
    deltaY: 240,
  });
  await sleep(150);
  if ([17, 35, 53, 71].includes(index)) {
    await sleep(1000);
    await inspect(`after-scroll-${index + 1}`);
    await screenshot(`webgl-after-scroll-${index + 1}`);
  }
}

for (let index = 0; index < 3; index += 1) {
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight' });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight' });
  await sleep(1500);
  await inspect(`after-right-${index + 1}`);
  await screenshot(`webgl-after-right-${index + 1}`);
}

const errors = events
  .filter((event) => event.method === 'Runtime.exceptionThrown' || event.method === 'Log.entryAdded')
  .map((event) => event.params?.exceptionDetails?.exception?.description || event.params?.entry?.text)
  .filter(Boolean);
console.log('errors', JSON.stringify(errors.slice(0, 20)));
console.log('response-errors', JSON.stringify(events
  .filter((event) => event.method === 'Network.responseReceived' && event.params?.response?.status >= 400)
  .map((event) => ({ status: event.params.response.status, url: event.params.response.url }))));
console.log('loading-failures', JSON.stringify(events
  .filter((event) => event.method === 'Network.loadingFailed')
  .map((event) => ({ error: event.params.errorText, url: event.params.requestId }))));
console.log('volume-responses', JSON.stringify(events
  .filter((event) => event.method === 'Network.responseReceived')
  .map((event) => ({ status: event.params.response.status, url: event.params.response.url }))
  .filter(({ url }) => url?.includes('axolotl') || url?.includes('volume'))));

socket.close();
