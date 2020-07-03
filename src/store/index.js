import { createStore, combineReducers } from "redux";
import hero from "../reducers/hero";
import language from "../reducers/language";

const allReducers = combineReducers({
    language,
    hero,
});

const store = createStore(allReducers);

export default store;