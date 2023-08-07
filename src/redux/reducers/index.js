import { combineReducers } from "redux";
import pdksReducer from "./pdksReducer";
import gunSayisiReducer from "./gunSayisiReducer";
import pdksIstReducer from "./pdksIstReducer";

const reducers = combineReducers({
  pdks: pdksReducer,
  gunSayisi: gunSayisiReducer,
  pdksIst: pdksIstReducer
});

export default reducers;