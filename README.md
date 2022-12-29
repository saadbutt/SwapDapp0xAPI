# How to Build a Token Swap DApp using the 0x Swap API

### Pre-requisite

* npm (npx) version 8.5.5

* node version 16.13.1

### Setup

* npm install -g browserify`

* npm i qs


### Now recursively bundle up all the required modules starting at main.js into a single file called bundle.js

* browserify index.js --standalone bundle -o bundle.js

### How to do a Test run

* Select a from token (make sure your wallet has enough of that token; otherwise you will get an error)

* Select a to token

* Input a from amount (make sure your wallet has at least that amount; otherwise the quote won't carry through)

* Connect your MetaMask wallet, the "Swap" button should be enabled

* Click Approve to check allowance or do allowance.

* If you click "Swap" you should get a MetaMask pop-up asking if you approve the allowanceTarget, 0x Exchange Proxy contract address:       0xdef1c0ded9bec7f1a1670819833240f027b25eff !

### If you want to test through Goerli Do the following steps

* Change 0x Mainnet address to Goerli Address `0xf91bb752490473b8342a3e964e855b9f9a2a668e`

* Change 0x Mainnet endpoint to Goerli endpoint `https://goerli.api.0x.org/`

* To view the currently supported sources on Goerli refer to https://goerli.api.0x.org/swap/v1/sources. At the time of writing this guide 0x, MultiHop, SushiSwap, Uniswap, Uniswap_V2 and Uniswap_V3 are supported. The token you want to use for testing must have liquidity on at least one of these sources.