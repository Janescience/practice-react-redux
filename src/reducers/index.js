import { combineReducers } from "redux";
import auth from "./auth";
import transactions from "./transactions";
import message from "./message";

export default combineReducers({
  auth,
  transactions,
  message,
});