import axios from "axios";
import { createMessage, returnErrors } from "./messages";

import {
  FORM_LOADING,
  GET_FORM_FOR_SUBMISSION,
  SUBMIT_SUBMISSION,
} from "./types";

// GET FORM FOR SUBMISSION
export const getFormForSubmission = (formId) => (dispatch) => {
  dispatch({ type: FORM_LOADING });
  axios
    .get(`/api/submission/${formId}`)
    .then((res) => {
      dispatch({
        type: GET_FORM_FOR_SUBMISSION,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// SUBMIT SUBMISSION
export const submitSubmission = (submission) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios
    .post("/api/submission/", submission, config)
    .then((res) => {
      dispatch({
        type: SUBMIT_SUBMISSION,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
