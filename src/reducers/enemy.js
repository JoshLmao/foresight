import initialState from "./initialState";

import {
    ENEMY_SELECTED,
    ENEMY_SELECTED_TALENT
} from "../constants/actionTypes";

export default (state = initialState, action) => {
    switch(action.type) {
        case ENEMY_SELECTED:
            return {
                ...state,

                enemy: action.value,
            };
        case ENEMY_SELECTED_TALENT:
            return {
                ...state,

                selectedEnemyTalents: [ ],
            }
        default:
            return state;
    }
}