
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
    return undefined;
}

/// Try Gets a item info and sepcial value from it's item's Ability Special array
export function tryGetItemSpecialValue (item, specialAbilityValueKey) {
    var itemInfo = getItemInfoFromName(item.item);
    if (itemInfo) {
        var specialValue = getItemSpecialAbilityValue(itemInfo, specialAbilityValueKey);
        if (specialValue) {
            return specialValue;
        }
    }
    return null;
}

/// Try Gets a neutral item info and special value from it's items' AbilitySpecial array
export function tryGetNeutralSpecialValue (neutral, specialValueKey) {
    var foundNeutralInfo = getItemInfoFromName(neutral.item);
    if (foundNeutralInfo) {
        var specialValue = getItemSpecialAbilityValue(foundNeutralInfo, specialValueKey);
        if (specialValue) {
            return specialValue;
        }
    }
    return null;
}

/// Returns all neutral items
export function getAllNeutrals() {
     /// Filter out unused or unnecessary keys in items.json
     var selectableNeutrals = Object.keys(DOTAItems).filter((value) => {
        var key = value.toLowerCase();
        var ability = DOTAItems[value];
        if (key !== "version" && !ability.IsObsolete) {
            if (ability.ItemIsNeutralDrop === "1") {
                return true;
            }
        }
        return false;
    });
    selectableNeutrals.sort();

    // Map to an object
    selectableNeutrals = selectableNeutrals.map((key) => {
        let itemKey = key;
        if (itemKey.includes("recipe")) {
            // remove recipe and retrieve item version
            itemKey = itemKey.replace("_recipe", "");
        }

        var itemInfo = DOTAItems[itemKey];
        if (itemInfo.ItemIsNeutralDrop === "1") {
            // Remove 'item_' prefix, split by _, remove "item" and join again
            var name = itemKey.split('_');
            name.shift();
            name = name.join('_');

            return {
                item: name,
                itemInfo: itemInfo,
            };
        }
    });

    return selectableNeutrals;
}