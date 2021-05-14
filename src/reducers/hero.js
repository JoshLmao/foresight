import initialState from "./initialState";

import {
    SELECTED_HERO,
    SELECTED_ITEM,
    SELECTED_BACKPACK_ITEM,
    SELECTED_NEUTRAL,
    SELECTED_TALENT,
    UNSELECTED_TALENT,
    NEW_HERO_LEVEL,
    SELECTED_ABILITY_LEVEL,
    SHARD_SET
} from "../constants/actionTypes";

import {
    parseNameFromModel,
} from "../utils";

import {
    getAllHeroAbilities,
    getHeroAbilityLevels,
    getHeroTalents,
} from "../utility/dataHelperHero";

/* DotA 2 Import Data */
import { DOTAHeroes } from "../data/dota2/json/npc_heroes.json";

function replaceUpdatedAbilityLevel (abilityLevelArray, newAbilityLevel) {
    let newArray = abilityLevelArray.filter((val) => {
        if (val.ability !== newAbilityLevel.ability) {
            return val;
        }
    });
    newArray.push({
        ability: newAbilityLevel.ability,
        level: newAbilityLevel.level,
    });
    newArray.sort((a, b) => (a.ability > b.ability) ? 1 : -1);
    return newArray;
}

/// Takes the existing itemArray and removes the current slot item and
/// replaces with the newItem
function replaceUpdatedItem(itemArray, newItem) {
    /// Remove old slot insert new and sort by Slot
    let newArray = itemArray.filter((val) => {
        if (val.slot !== newItem.slot) {
            return val;
        }
    })
    newArray.push({ 
        slot: newItem.slot,
        item: newItem.item,
        extra: newItem.extra,
    });
    /// Sort by slot order 0 - 5
    newArray.sort((a, b) => (a.slot > b.slot) ? 1 : -1);
    return newArray;
}

function getNewTalentArray(talentArray, newTalent) {
    let newArray = talentArray.map((value => { return value }));
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
            let heroInfo = DOTAHeroes[action.value];
            let allHeroAbilities = getAllHeroAbilities(heroInfo);
            // If retrieved abilities, map them to index and level
            let heroAbilLevels = null;
            if (allHeroAbilities) {
                heroAbilLevels = allHeroAbilities.map((abil, index) => {
                    return {
                        ability: index,
                        level: 1,
                    };
                });
            }
            return {
                ...state,
                selectedHero: heroInfo,
                selectedHeroName: action.value,
                heroAbilities: allHeroAbilities,
                heroTalents: getHeroTalents(heroInfo),
                heroAbilityLevels: heroAbilLevels,

                // reset selected talents when new hero selected
                selectedTalents: [ ],
            };
        case SELECTED_ITEM:
            return {
                ...state,
                items: replaceUpdatedItem(state.items, action.value),
            };
        case SELECTED_BACKPACK_ITEM:
            return {
                ...state,
                backpack: replaceUpdatedItem(state.backpack, action.value),
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
        case SELECTED_ABILITY_LEVEL:
            return {
                ...state,
                heroAbilityLevels: replaceUpdatedAbilityLevel(state.heroAbilityLevels, action.value),
            };
        case SHARD_SET:
            return {
                ...state,
                shard: action.value,
            };
        default:
            return state;
    }
}

export default reducer;