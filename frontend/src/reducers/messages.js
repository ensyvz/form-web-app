import { CREATE_MESSAGE, DELETE_MESSAGE } from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_MESSAGE:
      return (state = action.payload);
    case DELETE_MESSAGE:
      return (state = {});
    default:
      return state;
  }
}
