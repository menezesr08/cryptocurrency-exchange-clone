import { ethers } from "ethers";

export const provider = (state = {}, action) => {
  switch (action.type) {
    case "PROVIDER_LOADED":
      return {
        ...state,
        connection: action.connection,
      };
    case "NETWORK_LOADED":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "ACCOUNT_LOADED":
      return {
        ...state,
        account: action.account,
      };
    case "ETHER_BALANCE_LOADED":
      return {
        ...state,
        balance: action.balance,
      };

    default:
      return state;
  }
};

const DEFAULT_TOKENS_STATE = {
  loaded: false,
  contracts: [],
  symbols: [],
  balances: [],
  events: [],
  transferIsPending: false,
  isError: false,
};
export const tokens = (state = DEFAULT_TOKENS_STATE, action) => {
  let currentBalance, newBalance, convertedNewBalance;
  switch (action.type) {
    case "TOKEN_1_LOADED":
      return {
        ...state,
        loaded: true,
        contracts: [action.token],
        symbols: [action.symbol],
      };
    case "TOKEN_1_LOADED_BALANCE":
      return {
        ...state,
        balances: [action.balance],
      };
    case "TOKEN_1_UPDATE_BALANCE":
      if (state.balances.length > 0) {
        currentBalance = ethers.utils.parseUnits(state.balances[0], 18);
        newBalance = currentBalance.add(action.value);
        convertedNewBalance = ethers.utils.formatUnits(newBalance, 18);
      }

      return {
        ...state,
        balances: [convertedNewBalance, state.balances[1]],
        isPending: false,
        events: [action.event, ...state.events],
      };
    case "TOKEN_2_LOADED":
      return {
        ...state,
        loaded: true,
        contracts: [...state.contracts, action.token],
        symbols: [...state.symbols, action.symbol],
      };
    case "TOKEN_2_LOADED_BALANCE":
      return {
        ...state,
        balances: [...state.balances, action.balance],

      };
    case "TOKEN_2_UPDATE_BALANCE":
      if (state.balances.length > 0) {
        currentBalance = ethers.utils.parseUnits(state.balances[1], 18);
        newBalance = currentBalance.add(action.value);
        convertedNewBalance = ethers.utils.formatUnits(newBalance, 18);
      }

      return {
        ...state,
        balances: [state.balances[0], convertedNewBalance],
        isPending: false,
        events: [action.event, ...state.events],
      };
    case "TOKEN_TRANSFER_REQUEST":
      return {
        ...state,
        isPending: true,
        isError: false
      };
    case "TOKEN_TRANSFER_FAIL":
      return {
        ...state,
        isPending: false,
        isError: true,
      };

    case "CLEAR_TOKEN_EVENTS":
      return {
        ...state,
        events: [],
      }
    default:
      return state;
  }
};

const DEFAULT_EXCHANGE_STATE = {
  loaded: false,
  contract: {},
  transaction: { isSuccessful: false },
  events: [],
  allOrders: {
    loaded: false,
    data: [],
  },
  filledOrders: {
    data: [],
  },
  cancelledOrders: {
    data: [],
  },
};

export const exchange = (state = DEFAULT_EXCHANGE_STATE, action) => {
  let index, data;
  switch (action.type) {
    case "EXCHANGE_LOADED":
      return {
        ...state,
        loaded: true,
        contract: action.exchange,
      };
    case "CANCELLED_ORDERS_LOADED":
      return {
        ...state,
        cancelledOrders: {
          loaded: true,
          data: action.cancelledOrders,
        },
      };

    case "FILLED_ORDERS_LOADED":
      return {
        ...state,
        filledOrders: {
          loaded: true,
          data: action.filledOrders,
        },
      };
    case "ALL_ORDERS_LOADED":
      return {
        ...state,
        loaded: true,
        allOrders: {
          loaded: true,
          data: action.allOrders,
        },
      };
    case "ORDER_CANCEL_REQUEST":
      return {
        ...state,
        transaction: {
          transactionType: "Cancel",
          isPending: true,
          isSuccessful: false,
        },
      };
    case "ORDER_CANCEL_SUCCESS":
      return {
        ...state,
        transaction: {
          transactionType: "Cancel",
          isPending: false,
          isSuccessful: true,
        },
        cancelledOrders: {
          ...state.cancelledOrders,
          data: [...state.cancelledOrders.data, action.order],
        },
        events: [action.event, ...state.events],
      };
    case "ORDER_CANCEL_FAIL":
      return {
        ...state,
        transaction: {
          transactionType: "Cancel",
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
      };
    // FILLING ORDER
    case "ORDER_FILL_REQUEST":
      return {
        ...state,
        transaction: {
          transactionType: "Fill Order",
          isPending: true,
          isSuccessful: false,
        },
      };
    case "ORDER_FILL_SUCCESS":
      index = state.filledOrders.data.findIndex(
        (order) => order.id.toString() === action.order.id.toString()
      );

      if (index === -1) {
        data = [...state.filledOrders.data, action.order];
      } else {
        data = state.filledOrders.data;
      }
      return {
        ...state,
        transaction: {
          transactionType: "Fill Order",
          isPending: false,
          isSuccessful: true,
        },
        filledOrders: {
          ...state.filledOrders,
          data,
        },
        events: [action.event, ...state.events],
      };
    case "ORDER_FILL_FAIL":
      return {
        ...state,
        transaction: {
          transactionType: "Fill Order",
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
      };

    case "EXCHANGE_TOKEN_1_LOADED_BALANCE":
      return {
        ...state,
        loaded: true,
        balances: [action.balance],
      };
    case "EXCHANGE_TOKEN_2_LOADED_BALANCE":
      return {
        ...state,
        loaded: true,
        balances: [...state.balances, action.balance],
      };
    case "TRANSFER_REQUEST":
      return {
        ...state,
        transaction: {
          transactionType: "Transfer",
          isPending: true,
          isSuccessful: false,
        },
        transferInProgress: true,
      };
    case "TRANSFER_SUCCESS":
      return {
        ...state,
        transaction: {
          transactionType: "Transfer",
          isPending: false,
          isSuccessful: true,
        },
        transferInProgress: false,
        events: [action.event, ...state.events],
      };
    case "TRANSFER_FAIL":
      return {
        ...state,
        transaction: {
          transactionType: "Transfer",
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
        transferInProgress: false,
      };
    case "NEW_ORDER_REQUEST":
      return {
        ...state,
        transaction: {
          transactionType: "New Order",
          isPending: true,
          isSuccessful: false,
        },
      };
    case "NEW_ORDER_FAIL":
      return {
        ...state,
        transaction: {
          transactionType: "New Order",
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
      };
    case "NEW_ORDER_SUCCESS":
      // Prevent duplicate orders
      index = state.allOrders.data.findIndex(
        (order) => order.id.toString() === action.order.id.toString()
      );
      if (index === -1) {
        data = [...state.allOrders.data, action.order];
      } else {
        data = state.allOrders.data;
      }
      return {
        ...state,
        transaction: {
          transactionType: "New Order",
          isPending: false,
          isSuccessful: true,
        },
        allOrders: {
          ...state,
          data,
        },
        events: [action.event, ...state.events],
      };
      case "CLEAR_EXCHANGE_EVENTS":
        return {
          ...state,
          events: []
        }
    default:
      return state;
  }
};
