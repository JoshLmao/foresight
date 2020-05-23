// * Helper and utility functions to provide for retrieving data from "npc_abilities.json"
// * 

import { DOTAAbilities } from "../data/dota2/json/npc_abilities.json";

export function getAbilityInfoFromName(abilityName) {
    if (abilityName) {
        return DOTAAbilities[abilityName];
    } else {
        return null;
    }
}

export function getAbilitySpecialAbilityValue(abilityInfo, specialAbilityKey, abilityLevel = 1) {
    if (abilityInfo && abilityInfo.AbilitySpecial) {
        for(var i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
            var keys = Object.keys(abilityInfo.AbilitySpecial[i]);
            var matchingKey = keys.find(element => {
                return element === specialAbilityKey;
            });

            if (matchingKey) {
                var specialAbilityInfo = abilityInfo.AbilitySpecial[i];

                // If value contains a space, it can be levelled up needs to be split up
                var dataValue = specialAbilityInfo[matchingKey];
                if (specialAbilityInfo[matchingKey].includes(' ')) {
                    var split = specialAbilityInfo[matchingKey].split(' ');
                    dataValue = split[abilityLevel - 1];
                }

                if (specialAbilityInfo.var_type === "FIELD_INTEGER") {
                    return parseInt(dataValue);
                } 
                else if(specialAbilityInfo.var_type === "FIELD_FLOAT") {
                    return parseFloat(dataValue);
                }
            }
        }
    }
}