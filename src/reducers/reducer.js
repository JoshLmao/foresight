import { DOTAHeroes } from "../data/dota2/json/npc_heroes.json";

import {
    SELECTED_HERO,
    SELECTED_ITEM,
    SELECTED_BACKPACK_ITEM,
    SELECTED_NEUTRAL,
    SELECTED_TALENT,
} from "../constants/actionTypes";

import {
    parseNameFromModel,
    getAllHeroAbilities,
    getHeroTalents,
} from "../utils";

function getNewItemArray(itemArray, newItem) {
    /// Remove old slot insert new and sort by Slot
    var newArray = itemArray.filter((val) => {
        if (val.slot !== newItem.slot) {
            return val;
        }
    })
    newArray.push({ slot: newItem.slot, item: newItem.item });
    newArray.sort((a, b) => (a.slot > b.slot) ? 1 : -1);
    return newArray;
}

function getNewTalentArray(talentArray, newTalent) {
    var newArray = talentArray.filter((val) => {
        if (val.level !== newTalent.level) {
            return val;
        }
    });
    newArray.push(newTalent);
    newArray.sort((a, b) => a.level < b.level ? 1 : -1);
    return newArray;
}

const initialState = {
    /// Current selected hero by the user
    selectedHero: DOTAHeroes.npc_dota_hero_zuus,
    /// display name of the selectedHero
    selectedHeroName: parseNameFromModel(DOTAHeroes.npc_dota_hero_zuus.Model),
    /// Array of abilities of the selectedHero
    heroAbilities: getAllHeroAbilities(DOTAHeroes.npc_dota_hero_zuus),
    /// Array of talents of the selectedHero
    heroTalents: getHeroTalents(DOTAHeroes.npc_dota_hero_zuus),
    /// Array of talents selected by the user
    selectedTalents: [ ],

    /// Current items that have been selected
    items: [
        { slot: 0, item: "abyssal_blade" },
        { slot: 1, item: "" },
        { slot: 2, item: "" },
        { slot: 3, item: "" },
        { slot: 4, item: "" },
        { slot: 5, item: "" },
    ],
    /// Current backpack selected by user
    backpack: [
        { slot: 0, item: "" },
        { slot: 1, item: "" },
        { slot: 2, item: "" },
    ],
    /// Current neutral item selected by user
    neutralItem: { item: "orb_of_destruction" },
};

function reducer(state = initialState, action) {
    switch(action.type)
    {
        case SELECTED_HERO:
            return {
                ...state,
                selectedHero: action.value,
                selectedHeroName: parseNameFromModel(action.value.Model),
                heroAbilities: getAllHeroAbilities(action.value),
                heroTalents: getHeroTalents(action.value),
                
                // reset selected talents when new hero selected
                selectedTalents: [ ],
            };
        case SELECTED_ITEM:
            return {
                ...state,
                items: getNewItemArray(state.items, action.value),
            };
        case SELECTED_BACKPACK_ITEM:
            return {
                ...state,
                backpack: getNewItemArray(state.backpack, action.value),
            }
        case SELECTED_NEUTRAL:
            return {
                ...state,
                neutralItem: action.value,
            };
        case SELECTED_TALENT:
            return {
                ...state,
               selectedTalents: getNewTalentArray(state.selectedTalents, action.value),
            }
        default:
            return state;
    }
}

export default reducer;