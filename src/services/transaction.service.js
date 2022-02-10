import http from "../commons/http-common";
import authHeader from "./auth-header";

const getTransactions = (userId) => {
    return http.get("transactions?user=" + userId , { headers : authHeader() });
};

const getTransactionsByType = (userId,type) => {
    return http.get("transactions?user=" + userId + "&type=" + type , { headers : authHeader() });
};

const createTransaction = (newTransaction) => {
    return http.post("transaction", { headers : authHeader() , newTransaction });
};

const deleteTransaction = (id) => {
    return http.delete(`transaction/${id}`, { headers : authHeader() });
};

const updateTransaction = (id,transaction) => {
    return http.put(`transaction/${id}`, { headers : authHeader() },transaction);
};

export default {
    getTransactions,
    getTransactionsByType,
    createTransaction,
    deleteTransaction,
    updateTransaction
};