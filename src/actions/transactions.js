import {
    CREATE_TRANSACTION,
    RETRIEVE_TRANSACTIONS,
    UPDATE_TRANSACTION,
    DELETE_TRANSACTION,
  } from "./types";

  import TransactionService from "../services/transaction.service";

  export const createTransaction = (newTransaction) => (dispatch) => {
    return TransactionService.createTransaction(newTransaction).then(
      (response) => {
  
        dispatch({
          type: CREATE_TRANSACTION,
          payload: response.data,
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return Promise.reject(message);
      }
    );
  };

  export const getTransactions = (userId) =>  (dispatch) => {
    return  TransactionService.getTransactions(userId).then(
      (response) => {
  
        dispatch({
          type: RETRIEVE_TRANSACTIONS,
          payload: response.data,
        });
  
        return Promise.resolve(response.data);
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();  
        return Promise.reject(message);
      }
    );
  };

  export const getTransactionsByType = (userId,type) =>  (dispatch) => {
    return TransactionService.getTransactionsByType(userId,type).then(
      (response) => {  
        dispatch({
          type: RETRIEVE_TRANSACTIONS,
          payload: response.data,
        });
  
        return Promise.resolve(response.data);
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();  
        return Promise.reject(message);
      }
    );
  };

  export const updateTransaction = (id,data) => (dispatch) => {
    return TransactionService.updateTransaction(id,data).then(
      (response) => {
  
        dispatch({
          type: UPDATE_TRANSACTION,
          payload: data,
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();  
        return Promise.reject(message);
      }
    );
  };

  export const deleteTransaction = (id) => (dispatch) => {
    return TransactionService.deleteTransaction(id).then(
      (response) => {
        dispatch({
          type: DELETE_TRANSACTION,
          payload: response.data,
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();  
        return Promise.reject(message);
      }
    );
  };
