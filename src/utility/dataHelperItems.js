
// * Helper and utility functions to provide for retrieving data from "npc_items.json"
// * 
import { DOTAAbilities as DOTAItems } from "../data/dota2/json/items.json";

export function getItemInfoFromName (itemName) {
    if (itemName)
        return DOTAItems["item_" + itemName];
    else
        return null;
}

/// Gets the value of an item's AbilitySpecial array
export function getItemSpecialAbilityValue (itemInfo, specialAbilityValueKey) {
    if (itemInfo && itemInfo.AbilitySpecial) {
        for(var i = 0; i < itemInfo.AbilitySpecial.length; i++) {
            var keys = Object.keys(itemInfo.AbilitySpecial[i]);
            var matchingKey = keys.find(element => {
                return element === specialAbilityValueKey;
            });

            if (matchingKey) {
                var specialAbilityInfo = itemInfo.AbilitySpecial[i];
                if (specialAbilityInfo.var_type === "FIELD_INTEGER") {
                    return parseInt(specialAbilityInfo[matchingKey]);
                } 
                else if(specialAbilityInfo.var_type === "FIELD_FLOAT") {
                    return parseFloat(specialAbilityInfo[matchingKey]);
                }
            }
        }
    }
}