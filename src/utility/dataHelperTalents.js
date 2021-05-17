import { DOTAAbilities } from "../data/dota2/json/npc_abilities.json";
import {
    getAbilityInfoFromName,
    getAbilitySpecialAbilityValue
} from "./dataHelperAbilities";

/// Gets info and formattable display name of a talent
/// Returns both display name of talent and it's info in an object
export function getTalentInfoFromName(talent) {
    if (talent) {
        let talentInfo = DOTAAbilities[talent];
        return talentInfo;    
    } else {
        return null;
    }
}

/// Checks if the talent name includes the phrase, then attempts to get the data value of that talent
export function tryGetTalentValueInclude (talentName, includePhrase) {
    if (talentName.includes(includePhrase)) {
        return tryGetTalentSpecialAbilityValue(talentName, "value");
    }
}

/// Attempts to get the data value of a talent from the AbilitySpecial array that matches "specialValueKey".
/// Tries to cast it to the "var_type" property if "shouldTryParseValue" is true
export function tryGetTalentSpecialAbilityValue (talent, specialValueKey, level = 1, shouldTryParseValue = true) {
    let talentInfo = getAbilityInfoFromName(talent);
    if(talentInfo) {
        let specialValue = getAbilitySpecialAbilityValue(talentInfo, specialValueKey, level, shouldTryParseValue);
        if (specialValue) {
            return specialValue;
        }
    }
    return null;
}

/// Checks the selected talents array to see if the targetTalent has been selected
export function talentsInclude(selectedTalents, targetTalent) {
    if (!selectedTalents) {
        return null;
    }

    for (let talent of selectedTalents) {
        if (talent === targetTalent) {
            return true;
        }
    }
    return false;
}