import * as actionTypes from '../actions/actionTypes';

const initialState = {
    pdksIstXlsx: null,
    pdksIstOutput: null,
  };
  
  const pdksIstReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.SET_PDKS_IST_XLSX:
        return {
          ...state,
          pdksIstXlsx: action.payload,
        };
      case actionTypes.SET_PDKS_IST_OUTPUT:
        return {
          ...state,
          pdksIstOutput: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default pdksIstReducer;