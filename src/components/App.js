import { useEffect } from "react";
import { ethers } from "ethers";

import TOKEN_ABI from "../abis/Token.json";
import config from "../config.json";
import { useDispatch } from "react-redux";
import {
  loadAccount,
  loadExchange,
  loadNetwork,
  loadOrders,
  loadProvider,
  loadTokens,
  subscribeToEvents,
} from "../store/interactions";
import Navbar from "./Navbar";
import Markets from "./Markets";
import Balance from "./Balance";
import Order from "./Order";
import OrderBook from "./OrderBook";

function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    const provider = loadProvider(dispatch);

    const chainId = await loadNetwork(provider, dispatch);

    const DApp = config[chainId].DApp;
    const mETH = config[chainId].mETH;
    const exchangeConfig = config[chainId].exchange;
    // Fetch current account and balance from metamask

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", () => {
      loadAccount(dispatch, provider);
    });

    await loadTokens(provider, [DApp.address, mETH.address], dispatch);

    const exchange = await loadExchange(provider, exchangeConfig.address, dispatch);
    loadOrders(provider, exchange, dispatch);
    subscribeToEvents(exchange, dispatch);
  };

  useEffect(() => {
    loadBlockchainData();
  });

  return (
    <div>
      {/* Navbar */}
      <Navbar></Navbar>
      <main className="exchange grid">
        <section className="exchange__section--left grid">
          {/* Markets */}
          <Markets></Markets>
          {/* Balance */}
          <Balance></Balance>

          {/* Order */}
          <Order></Order>
        </section>
        <section className="exchange__section--right grid">
          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}
          <OrderBook></OrderBook>
        </section>
      </main>

      {/* Alert */}
    </div>
  );
}

export default App;
