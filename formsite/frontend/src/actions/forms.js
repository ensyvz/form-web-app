import axios from "axios";
import { createMessage, returnErrors } from "./messages";

import {
  CREATE_FORM,
  GET_FORMS,
  DELETE_FORM,
  GET_FORM_DETAILS,
  EDIT_FORM,
} from "./types";

import { tokenConfig } from "./auth";

// GET FORMS
export const getForms = () => (dispatch, getState) => {
  axios
    .get("/api/forms/", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_FORMS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// GET FORM DETAILS
export const getFormDetails = (id) => (dispatch, getState) => {
  axios
    .get(`/api/forms/${id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_FORM_DETAILS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// CREATE FORM
export const createForm = (form) => (dispatch, getState) => {
  axios
    .post("/api/forms/", form, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ formCreated: "Form Created" }));
      dispatch({
        type: CREATE_FORM,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response) {
        dispatch(returnErrors(err.response.data, err.response.status));
      }
    });
};

// DELETE FORM
export const deleteForm = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/forms/${id}`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DELETE_FORM,
        payload: id,
      });
    })
    .catch((err) => {
      if (err.response) {
        dispatch(returnErrors(err.response.data, err.response.status));
      }
    });
};

// EDIT FORM
export const editForm = (id, changes) => (dispatch, getState) => {
  axios
    .patch(`/api/forms/${id}/`, changes, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: EDIT_FORM,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response) {
        dispatch(returnErrors(err.response.data, err.response.status));
      }
    });
};
