import initialState from "./initialState";

import {
    SELECTED_HERO,
    SELECTED_ITEM,
    SELECTED_BACKPACK_ITEM,
    SELECTED_NEUTRAL,
    SELECTED_TALENT,
    UNSELECTED_TALENT,
    NEW_HERO_LEVEL,
} from "../constants/actionTypes";

import {
    parseNameFromModel,
} from "../utils";

import {
    getAllHeroAbilities,
    getHeroTalents,
} from "../utility/dataHelperHero";

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
    var newArray = talentArray.map((value => { return value }));
    newArray.push(newTalent);
    return newArray;
}

function removeTalent (talentArray, unselectedTalent) {
    /// Filter to get all but the unselectedTalent
    var array = talentArray.filter((talent) => {
        if (talent && talent !== unselectedTalent) {
            return talent;
        }
    });
    return array;
}

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
            case UNSELECTED_TALENT:
                return {
                    ...state,
                    selectedTalents: removeTalent(state.selectedTalents, action.value),
                }
        case NEW_HERO_LEVEL:
            return {
                ...state,
                heroLevel: action.value,
            };
        default:
            return state;
    }
}

export default reducer;