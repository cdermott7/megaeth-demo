const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const ethers = require('ethers');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const provider = new ethers.providers.WebSocketProvider('wss://carrot.megaeth.com/ws');

async function setupSubscriptions() {
  try {
    console.log('Connecting to MegaETH testnet...');

    provider._websocket.on('open', () => {
      console.log('Connected to MegaETH Testnet WebSocket');
      io.emit('status', 'CONNECTED TO MEGAETH TESTNET');
    });

    const fragmentRequest = {
      jsonrpc: '2.0',
      method: 'eth_subscribe',
      params: ['fragments'],
      id: 84,
    };

    const stateRequest = {
      jsonrpc: '2.0',
      method: 'eth_subscribe',
      params: ['stateChange', ['0xdeaddeaddeaddeaddeaddeaddeaddeaddead0001']],
      id: 83,
    };

    const fragmentId = await provider.send(fragmentRequest.method, fragmentRequest.params);
    const stateId = await provider.send(stateRequest.method, stateRequest.params);

    let latestMiniBlock = null;
    let lastUpdateTime = Date.now();

    provider._websocket.on('message', (message) => {
      try {
        const update = JSON.parse(message);
        if (update.params) {
          if (update.params.subscription === fragmentId) {
            latestMiniBlock = update.params.result.timestamp;
          } else if (update.params.subscription === stateId) {
            const result = update.params.result;
            const now = Date.now();
            const latency = now - lastUpdateTime;
            io.emit('stateUpdate', {
              address: result.address,
              balance: ethers.utils.formatEther(result.balance),
              nonce: result.nonce,
              miniBlock: latestMiniBlock || 'unknown',
              latency: latency,
              timestamp: now
            });
            lastUpdateTime = now;
          }
        }
      } catch (err) {
        console.error('Message parsing error:', err.message);
      }
    });

    provider._websocket.on('error', (error) => {
      console.error('WebSocket error:', error);
      io.emit('status', 'ERROR: CONNECTION DROPPED');
    });

  } catch (error) {
    console.error('Error:', error);
    io.emit('status', 'ERROR: CONNECTION FAILED');
  }
}

setupSubscriptions();

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});