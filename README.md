# MegaETH Real-Time Demo

This project demonstrates MegaETH's real-time blockchain capabilities, specifically its Realtime API, with a split-screen interface showing code on the left and real-time updates on the right, highlighting 10-millisecond block times.

## Prerequisites

- Node.js (version 14 or higher)
- A modern web browser (Chrome, Firefox, etc.)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cdermot7/megaeth-demo.git
2. Navigate to the project directory:
    ```bash
    cd megaeth-demo
3. Install dependencies:
    ```bash
    npm install

## Running the Project
1. Start the server:
    ```bash
    node server.js
2. Open your web browser and navigate to:
    ```bash
    http://localhost:3000

## Usage
- Left Panel (Codebase): Displays the JavaScript code connecting to the MegaETH testnet using ethers.js, subscribing to account state changes.
- Right Panel (Realtime Output): Shows real-time updates including address, balance, nonce, mini block number, latency, and timestamp, reflecting live testnet activity.

## Dependencies
- express: For serving static files.
- socket.io: For real-time communication between server and client.
- ethers: For Ethereum blockchain interaction (MegaETH testnet).
- ws: For WebSocket functionality.

## Important Notice
This demo uses the MegaETH testnet, which may have rate limits and is subject to change. Do not use this for production or financial transactions.