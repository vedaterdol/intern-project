import * as actionTypes from "../actions/actionTypes";

const initialState = {
  gunSayisiXlsx: null,
  gunSayisiOutput: null,
};

const gunSayisiReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_GUN_SAYISI_XLSX:
      return {
        ...state,
        gunSayisiXlsx: action.payload,
      };
    case actionTypes.SET_GUN_SAYISI_OUTPUT:
      return {
        ...state,
        gunSayisiOutput: action.payload,
      };
    default:
      return state;
  }
};

export default gunSayisiReducer;