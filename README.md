## Project Name & Pitch

Cryptocurrency Exchange

A simple decentralized cryptocurrency exchange. Users can create orders, fill orders, cancel orders, view order history and see visual data representation. 

## Project Status
Core functionality complete. Future plans are to fix some UI bugs and add better features to enhance user experience.

## Installation and Setup Instructions

#### Example:  

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

1) `npm install`  

2) Create .env file in the root folder. Add 3 key pieces of information to your .env file: 

INFURA_API_KEY="INSERT INFURA API KEY HERE"

ALCHEMY_API_KEYS="INSERT ALCHEMY API KEY HERE"

PRIVATE_KEYS="PRIVATE KEY 1, PRIVATE KEY 2"

You can get the api keys from both: https://infura.io/ and https://www.alchemy.com/. You can grab the any 2 private keys from your metamask account. Make sure Kovan and Mumbai are added to your networks on Metamask.

> **Warning**
Make sure you don't commit your .env file.

3) `npx hardhat node`  (This command creates a local blockchain node. Leave this open in a seperate terminal)

4) `npx hardhat run --network localhost scripts/1_deploy.js`  (This command deploys all the smart contracts and prints out the addresses. You will need to copy all these address and add it to the `config.json` file under `31337`.

5) `npx hardhat run --network localhost scripts/2_seed-exchange.js`  (This commands add some seed data to the exchange) 

6) `npm run start` (This starts the react application. Go to localhost:3000 to view the app!)

## Reflection

This was a fun side project to learn how to build a fully fledged blockchain based application (crypto exchange) where users can mimic a real exchange by placing/filling orders. 

One of the main challenges I ran into was handling transaction times. Generally it takes a few seconds to complete a transaction on the blockchain so I had to figure out how to manage that in the state and also inform the user whether the transaction was still pending/completed.

The technologies implemented in this project are React, Redux, Solidity, Hardhat, Chai & Ethers. 
