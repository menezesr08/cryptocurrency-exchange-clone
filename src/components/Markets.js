import config from "../config.json";
import { useSelector } from "react-redux";
import { loadTokens } from "../store/interactions";
import { useDispatch } from "react-redux";
const Markets = () => {
  const chainId = useSelector((state) => state.provider.chainId);
  const provider = useSelector((state) => state.provider.connection);
  const dispatch = useDispatch();
  const marketHandler = async (e) => {
    loadTokens(provider, (e.target.value).split(','), dispatch)
  }
  return (
    <div className="component exchange__markets">
      <div className="component__header">
        <h2>Select Markets</h2>
      </div>
      {chainId && config[chainId] ? (
        <select name="markets" id="markets" onChange={marketHandler}>
          <option
            value={`${config[chainId].DApp.address},${config[chainId].mETH.address}`}
          >
            DApp / mETH
          </option>
          <option
            value={`${config[chainId].DApp.address},${config[chainId].mDAI.address}`}
          >
            DApp / mDAI
          </option>
        </select>
      ) : (
        <div>
          <p>Not deployed to network</p>
        </div>
      )}

      <hr />
    </div>
  );
};

export default Markets;
