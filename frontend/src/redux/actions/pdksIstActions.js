import * as actionTypes from "./actionTypes";

export const setPdksIstXlsx = (file) => ({
  type: actionTypes.SET_PDKS_IST_XLSX,
  payload: file,
});

export const setPdksIstOutput = (output) => ({
  type: actionTypes.SET_PDKS_IST_OUTPUT,
  payload: output,
});
