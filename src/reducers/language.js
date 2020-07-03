import {
    LANGUAGE_CHANGED
} from "../constants/actionTypes";
import { ELanguages } from "../enums/languages";
import initialState from "./initialState";

import { lang as EngAbilStrings } from "../data/dota2/languages/abilities_english.json";
import { lang as EngGenStrings } from "../data/dota2/languages/dota_english.json";

import { lang as SChineseAbilStrings } from "../data/dota2/languages/abilities_schinese.json";
import { lang as SChineseGenStrings } from "../data/dota2/languages/dota_schinese.json";

function getAbilityStrings(langCode) {
    switch(langCode) {
        case ELanguages.ENGLISH:
            return EngAbilStrings;
        case ELanguages.SCHINESE:
            return SChineseAbilStrings;
        default:
            return null;
    }
}

function getGeneralStrings(langCode) {
    switch(langCode) {
        case ELanguages.ENGLISH:
            return EngGenStrings;
        case ELanguages.SCHINESE:
            return SChineseGenStrings;
        default:
            return null;
    }
}

export default (state = initialState, action) => {
    switch(action.type) {
        case LANGUAGE_CHANGED:
            console.log(`${LANGUAGE_CHANGED}: ${action.value}`);
            return {
                ...state,
                lang: action.value,

                stringsAbilities: getAbilityStrings(action.value),
                stringsGeneral: getGeneralStrings(action.value),
            };
        default:
            return state;
    }
}