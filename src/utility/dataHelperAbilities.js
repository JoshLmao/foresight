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
                if (typeof dataValue === "string" && dataValue.includes(' ')) {
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

/// Gets the standard output damage of an ability from its level
export function getAbilityOutputDamage(abilityInfo, abilityLevel) {
    if (abilityInfo && abilityLevel) {
        var dmgVals = abilityInfo.AbilityDamage;
        if(dmgVals) {
            let value = dmgVals.split(' ')[abilityLevel - 1];
            return parseInt(value);
        }
        else if (abilityInfo.AbilitySpecial) 
        {
            //console.log(abilityInfo.AbilitySpecial);
            for (var i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
                var specAbil = abilityInfo.AbilitySpecial[i];
    
                /// Array of AbilitySpecial keys that deal damage
                var specialAbilityDamageKeys = [
                    //Generic
                    "damage",
                    // Abaddon
                    "target_damage", "damage_absorb", 
                    //Alchemist
                    "max_damage",
                    
                    //zeus
                    "arc_damage",
                ];
    
                // Find matching key in AbilitySpecial
                for(var j = 0; j < specialAbilityDamageKeys.length; j++) {
                    if (specAbil[specialAbilityDamageKeys[j]]) {
                        let value = specAbil[specialAbilityDamageKeys[j]].split(' ')[abilityLevel - 1];
                        return parseInt(value);
                    }
                }
            }
        }
    }
    return 0;
}