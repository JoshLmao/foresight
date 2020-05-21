import { DOTAHeroes } from "../data/dota2/json/npc_heroes.json";

import {
    SELECTED_HERO,
    SELECTED_ITEM,
    SELECTED_NEUTRAL,
} from "../constants/actionTypes";

import {
    parseNameFromModel,
    getAllHeroAbilities
} from "../utils";

const initialState = {
    selectedHero: DOTAHeroes.npc_dota_hero_zuus,
    selectedHeroName: parseNameFromModel(DOTAHeroes.npc_dota_hero_zuus.Model),
    selectedHeroAbilities: getAllHeroAbilities(DOTAHeroes.npc_dota_hero_zuus),
    items: [
        { slot: 0, item: "abyssal_blade" },
        { slot: 1, item: "" },
        { slot: 2, item: "" },
        { slot: 3, item: "" },
        { slot: 4, item: "" },
        { slot: 5, item: "" },
    ],
    backpack: [
        { slot: 0, item: "" },
        { slot: 1, item: "" },
        { slot: 2, item: "" },
    ],
    neutralItem: { item: "orb_of_destruction" },
};

function reducer(state = initialState, action) {
    switch(action.type)
    {
        case SELECTED_HERO:
            return {
                selectedHero: action.value,
                selectedHeroName: parseNameFromModel(action.value.Model),
                selectedHeroAbilities: getAllHeroAbilities(action.value),
            };
        case SELECTED_ITEM: 
            return state;
        case SELECTED_NEUTRAL:
            return {
                neutralItem: action.value,
            };
        default:
            return state;
    }
}

export default reducer;