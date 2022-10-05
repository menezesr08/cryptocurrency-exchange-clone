import logo from "../assets/logo.png";
import { useSelector } from "react-redux";
import Blockies from "react-blockies";
import { getFreeTokens, loadAccount } from "../store/interactions";
import { useDispatch } from "react-redux";
import eth from "../assets/eth.svg";
import config from "../config.json";

const Navbar = () => {
  const provider = useSelector((state) => state.provider.connection);
  const account = useSelector((state) => state.provider.account);
  const balance = useSelector((state) => state.provider.balance);
  const chainId = useSelector((state) => state.provider.chainId);
  const tokens = useSelector((state) => state.tokens.contracts);
  const exchange = useSelector((state) => state.exchange.contract);
  const dispatch = useDispatch();
  const connectHandler = async () => {
    await loadAccount(dispatch, provider);
  };
  const getTokensHandler = async (selectedToken) => {
    await getFreeTokens( provider, selectedToken, account, dispatch);
  }
  const networkHandler = async (e) => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: e.target.value }],
    });
  };
  return (
    <div className="exchange__header grid">
      <div className="exchange__header--brand flex">
        <img src={logo} className="logo" alt="DApp logo"></img>
        <h1>DApp Token Exchange</h1>
      </div>

      <div className="exchange__header--networks flex">
        <img src={eth} className="logo" alt="DApp Logo"></img>

        {chainId && (
          <select
            name="networks"
            id="networks"
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
            onChange={networkHandler}
          >
            <option value="0" disabled>
              Select network
            </option>
            <option value="0x7A69">Localhost</option>
            <option value="0x2a">Kovan</option>
            <option value="0x13881">Mumbai</option>
          </select>
        )}
      </div>
      <div className="exchange__tokens flex">
        <button className="button" onClick={() => getTokensHandler(tokens[0])}>Get DApp</button>
        <button className="button" onClick={ () => getTokensHandler(tokens[1])}>Get mETH</button>
      </div>
      <div className="exchange__header--account flex">
        {balance ? (
          <p>
            <small>My balance</small> {Number(balance).toFixed(4)}
          </p>
        ) : (
          <p>
            <small>My balance</small> 0 ETH
          </p>
        )}

        {account ? (
          <a

            href={
              
              config[chainId]
                ? `${config[chainId].explorerURL}/address/${account}`
                : `#`
            }
            target="_blank"
            rel="noreferrer"
          >
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
            <Blockies
              seed={account}
              className="identicon"
              size={10}
              scale={3}
              color="#28179D0"
              bgColor="#F1F2F9"
              spotColor="#767F92"
            ></Blockies>
          </a>
        ) : (
          <button className="button" onClick={connectHandler}>
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
