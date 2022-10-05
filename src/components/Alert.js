import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import {
  myExchangeEventsSelector,
  myTokensEventsSelector,
} from "../store/selectors";

import config from "../config.json";
import { clearAlerts } from "../store/interactions";
import { useDispatch } from "react-redux";

const Alert = () => {
  const alertRef = useRef(null);
  const dispatch = useDispatch();
  const network = useSelector((state) => state.provider.network);

  const account = useSelector((state) => state.provider.account);
  // Listen to exchange state
  const isPending = useSelector(
    (state) => state.exchange.transaction.isPending
  );
  const isError = useSelector((state) => state.exchange.transaction.isError);
  const exchangeEventsSelector = useSelector(myExchangeEventsSelector);
  // Listen to token state
  const tokenTransferIsPending = useSelector((state) => state.tokens.isPending);
  const tokenTransferIsError = useSelector((state) => state.tokens.isError);
  const tokensEventsSelector = useSelector(myTokensEventsSelector);

  const removeHandler = async (e) => {
    alertRef.current.className = "alert--remove";
     clearAlerts(dispatch);
  };
  useEffect(() => {
    if (
      (tokensEventsSelector[0] ||
        exchangeEventsSelector[0] ||
        isPending ||
        isError ||
        tokenTransferIsPending ||
        tokenTransferIsError) &&
      account
    ) {
      alertRef.current.className = "alert";
    }
  }, [
    isPending,
    account,
    isError,
    tokensEventsSelector,
    exchangeEventsSelector,
    tokenTransferIsPending,
    tokenTransferIsError,
  ]);

  return (
    <div>
      {isPending || tokenTransferIsPending ? (
        <div
          className="alert alert--remove"
          onClick={removeHandler}
          ref={alertRef}
        >
          <h1>Transaction Pending...</h1>
        </div>
      ) : isError || tokenTransferIsError ? (
        <div
          className="alert alert--remove"
          onClick={removeHandler}
          ref={alertRef}
        >
          <h1>Transaction Will Fail</h1>
        </div>
      ) : !tokenTransferIsPending && tokensEventsSelector[0] ? (
        <div
          className="alert alert--remove"
          onClick={removeHandler}
          ref={alertRef}
        >
          <h1>You got some free tokens!</h1>
          <a
            href={
              config[network]
                ? `${config[network].explorerURL}/tx/${tokensEventsSelector[0].transactionHash}`
                : "#"
            }
            target="_blank"
            rel="noreferrer"
          >
            {tokensEventsSelector[0]
              ? tokensEventsSelector[0].transactionHash.slice(0, 6) +
                "..." +
                tokensEventsSelector[0].transactionHash.slice(60, 66)
              : ""}
          </a>
        </div>
      ) : !isPending && exchangeEventsSelector[0] ? (
        <div
          className="alert alert--remove"
          onClick={removeHandler}
          ref={alertRef}
        >
          <h1>Transaction successful</h1>
          <a
            href={
              config[network]
                ? `${config[network].explorerURL}/tx/${exchangeEventsSelector[0].transactionHash}`
                : "#"
            }
            target="_blank"
            rel="noreferrer"
          >
            {exchangeEventsSelector[0]
              ? exchangeEventsSelector[0].transactionHash.slice(0, 6) +
                "..." +
                exchangeEventsSelector[0].transactionHash.slice(60, 66)
              : ""}
          </a>
        </div>
      ) : (
        <div
          className="alert alert--remove"
          onClick={removeHandler}
          ref={alertRef}
        ></div>
      )}
    </div>
  );
};

export default Alert;
