import {
  GET_FORM_FOR_SUBMISSION,
  SUBMIT_SUBMISSION,
  FORM_LOADING,
} from "../actions/types.js";

const initialState = {
  form: {},
  isLoading: true,
  isSubmitted: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FORM_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_FORM_FOR_SUBMISSION:
      return {
        ...state,
        form: action.payload,
        isLoading: false,
      };
    case SUBMIT_SUBMISSION:
      return {
        ...state,
        isSubmitted: true,
      };
    default:
      return state;
  }
}
