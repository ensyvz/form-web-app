import {
  GET_FORMS,
  CREATE_FORM,
  DELETE_FORM,
  GET_FORM_DETAILS,
  EDIT_FORM,
} from "../actions/types.js";

const initialState = {
  forms: [],
  detailedForm: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_FORMS:
      return {
        ...state,
        forms: action.payload,
        detailedForm: {},
      };
    case GET_FORM_DETAILS:
      return {
        ...state,
        detailedForm: action.payload,
      };
    case CREATE_FORM:
      return {
        ...state,
        forms: [...state.leads, action.payload],
      };
    case DELETE_FORM:
      return {
        ...state,
        forms: state.forms.filter((form) => form.id !== action.payload),
      };
    case EDIT_FORM:
      form = state.forms.find((form) => form.id === action.payload.id);
      form.name = action.payload.name;
      form.close_date = action.payload.close_date;
      form.status = action.payload.status;
      return {
        ...state,
        forms: state.forms,
      };
    default:
      return state;
  }
}
