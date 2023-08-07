import * as actionTypes from "./actionTypes";

export const setPdksXlsx = (file) => ({
  type: actionTypes.SET_PDKS_XLSX,
  payload: file,
});

export const setPdksOutput = (output) => ({
  type: actionTypes.SET_PDKS_OUTPUT,
  payload: output,
});
