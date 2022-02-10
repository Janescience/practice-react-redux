import {
    CREATE_TRANSACTION,
    RETRIEVE_TRANSACTIONS,
    UPDATE_TRANSACTION,
    DELETE_TRANSACTION,
} from "../actions/types";

const initialState = [];

const transactionsReducer = (transactions = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case CREATE_TRANSACTION:
          return payload ;
        case RETRIEVE_TRANSACTIONS:
          return payload ;
        case UPDATE_TRANSACTION:
          return payload ;
        case DELETE_TRANSACTION:
          return payload ;
        default:
          return transactions;
      }
}

export default transactionsReducer;