import * as actionTypes from "./actionTypes";

export const setGunSayisiXlsx = (file) => ({
  type: actionTypes.SET_GUN_SAYISI_XLSX,
  payload: file,
});

export const setGunSayisiOutput = (output) => ({
  type: actionTypes.SET_GUN_SAYISI_OUTPUT,
  payload: output,
});


