import { combineReducers } from "redux";
import leads from "./leads";
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";
import forms from "./forms";
import submission from "./submission";

export default combineReducers({
  leads,
  errors,
  messages,
  auth,
  forms,
  submission,
});
