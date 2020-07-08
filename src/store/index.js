import { createStore, combineReducers } from "redux";
import hero from "../reducers/hero";
import language from "../reducers/language";
import enemy from "../reducers/enemy";

const allReducers = combineReducers({
    language,
    hero,
    enemy,
});

const store = createStore(allReducers);

export default store;