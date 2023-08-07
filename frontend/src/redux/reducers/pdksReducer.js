import * as actionTypes from '../actions/actionTypes';

const initialState = {
    pdksXlsx: null,
    pdksOutput: null,
  };
  
  const pdksReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.SET_PDKS_XLSX:
        return {
          ...state,
          pdksXlsx: action.payload,
        };
      case actionTypes.SET_PDKS_OUTPUT:
        return {
          ...state,
          pdksOutput: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default pdksReducer;