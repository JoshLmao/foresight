
// * Helper and utility functions to provide for retrieving data from "npc_items.json"
// * 
import { DOTAAbilities as DOTAItems } from "../data/dota2/json/items.json";
import { neutral_items as DOTANeutralsTierList } from "../data/dota2/json/neutral_items.json";
import { EAttributes } from "../enums/attributes";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

import { tryParseAbilitySpecialValue } from "./dataHelperAbilities";
import { 
    getAbilitySpecialValue, 
    insertLocaleStringDataValues, 
    tryGetInfoValue 
} from "./dataHelperGeneric";
import { 
    getLocalizedString, 
    getFuzzyEngAbilityLocalizedString 
} from "./data-helpers/language";

export function getItemInfoFromName (itemName) {
    if (itemName)
        return DOTAItems[itemName];
    else
        return null;
}

/// Try Gets a item info and sepcial value from it's item's Ability Special array
export function tryGetItemSpecialValue (item, specialAbilityValueKey, itemLvl = 1) {
    let itemInfo = getItemInfoFromName(item.item);
    if (itemInfo) {
        var specialValue = getAbilitySpecialValue(itemInfo.AbilitySpecial, specialAbilityValueKey, itemLvl);
        if (specialValue) {
            return specialValue;
        }
    }
    return null;
}

/// Try Gets a neutral item info and special value from it's items' AbilitySpecial array
export function tryGetNeutralSpecialValue (neutral, specialValueKey) {
    let foundNeutralInfo = getItemInfoFromName(neutral.item);
    if (foundNeutralInfo) {
        var specialValue = getAbilitySpecialValue(foundNeutralInfo.AbilitySpecial, specialValueKey);
        if (specialValue) {
            return specialValue;
        }
    }
    return null;
}

/// Gets all normal items in dota
export function getAllItems () {
    let selectableItems = Object.keys(DOTAItems).filter((value) => {
        let key = value.toLowerCase();
        let ability = DOTAItems[value];
        if (key !== "version" && !key.includes("recipe") && !ability.ItemIsNeutralDrop && !ability.IsObsolete) {
            return true;
        }
        return false;
    });

    // Convert keys to item data
    selectableItems = selectableItems.map((key) => {
        return {
            item:  DOTAItems[key],
            name: key,
        };
    })
    selectableItems.sort();

    return selectableItems;
}

/// Returns all neutral items
export function getAllNeutrals() {
     /// Filter out unused or unnecessary keys in items.json
     let selectableNeutrals = Object.keys(DOTAItems).filter((value, index, array) => {
        let key = value.toLowerCase();
        let ability = DOTAItems[value];
        
        // Make sure it's a neutral
        if (ability.ItemIsNeutralDrop === "1") {
            // Filter irrelevant results, ignore any neutral recipes and return full item
            if (key !== "version" && !ability.IsObsolete && !key.includes("recipe")) {
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

        let itemInfo = DOTAItems[itemKey];
        if (itemInfo.ItemIsNeutralDrop === "1") {
            return {
                item: itemKey,
                itemInfo: itemInfo,
            };
        }
    });

    return selectableNeutrals;
}

/// Gets the correct key inside items.json for the hero's primary attribute
export function primaryAttributeToItemBonusKey(primaryAttr) {
    switch(primaryAttr) {
        case EAttributes.ATTR_STRENGTH:
            return [ "bonus_strength" ];
        case EAttributes.ATTR_AGILITY:
            return [ "bonus_agility" ];
        case EAttributes.ATTR_INTELLIGENCE:
            return [ "bonus_intellect", "bonus_intelligence" ];
        default:
            return null;
    }
}

/// Checks if the items array contains an aghanims scepter
export function itemsContainsScepter (allItems) {
    return itemsIncludesItem(allItems, "ultimate_scepter");
}

/// Checks if allItems contains an item by performing .include() with "itemName" on each item's name
export function itemsIncludesItem (allItems, itemName) {
    for (let item of allItems) {
        if (item.item && item.item.includes(itemName)) {
            return true;
        }
    }
    return false;
}

/// Replaces a localized string with it's data values found inside AbilitySpecial 
/// or on ItemInfo object
export function replaceStringWithDataValues (string, itemInfo) {
    if (!string) {
        return null;
    }

    // Regex to find a "%word_word%" phrase
    let replaceRegex = /%\w*?%/;
    // special character to use in placeholder of replacing in final string with ?
    let REPLACE_CHAR = "~";

    // Loop through all matches of the regex in the string
    while (string.match(replaceRegex)?.length > 0) {
        let phrase = string.match(replaceRegex)[0];
        if (phrase) {
            let infoKey = phrase.split("%").join("");
            let specialAbilityValue = null;
            // no characters inbetween, needs to be a normal percentage sign
            if (infoKey === "") {
                /// use the special REPLACE_CHAR
                specialAbilityValue = REPLACE_CHAR;
            }
            // if is an AbilitySpecial key as all contain a '_' 
            else if (infoKey.includes("_")) {
                specialAbilityValue = getAbilitySpecialValue(itemInfo.AbilitySpecial, infoKey);
            }
            else {
                // Check if infoKey is a key on the main itemInfo object
                specialAbilityValue = tryGetInfoValue(itemInfo, infoKey);

                // could be AbilitySpecial key that contains no _
                if (!specialAbilityValue) {
                    specialAbilityValue = getAbilitySpecialValue(itemInfo.AbilitySpecial, infoKey);
                }
            }
            
            // If not able to find a data value, use a question mark
            if (!specialAbilityValue) {
                specialAbilityValue = "?";
            }
            // Replace and set
            string = string.replace(phrase, specialAbilityValue);
        }
    }


    /// replace REPLACE_CHAR with actual percentage sign
    let regexExp = new RegExp(REPLACE_CHAR, "g");
    string = string.replace(regexExp, "%");
    
    return string;
}

/// Converts a item description localized string into the correct displayable HTML
export function convertItemDescToHtml(itemDescString, itemName, itemInfo) {
    /// Replace active/passive item ability with the data values inside the itemInfo
    let dataString = insertLocaleStringDataValues(itemDescString, itemInfo, itemInfo.AbilitySpecial);
    if (!dataString) {
        return null;
    }

    /// Get english string to be able to check for "Active:" phrase
    let engDataString = getFuzzyEngAbilityLocalizedString(`${itemName}_Description`);
    let engSplitString = engDataString.split("\\n");

    /// Also split localized string to iterate over
    let localizedSplit = dataString.split("\\n");

    let totalHtmlSections = [];
    for(let i = 0; i < localizedSplit.length; i++) {
        let section = localizedSplit[i];
        let isActive = engSplitString[i].includes("Active:");
        if (isActive) {
            // Return HTML for an active ability on item
            totalHtmlSections.push(
                <div className="my-3 item-active" key={i}>
                    <div
                        className="d-flex justify-content-between align-items-center" 
                        style={{ position: "absolute", right: "1rem" }}>
                        {
                            itemInfo && itemInfo.AbilityManaCost &&
                            <div className="d-flex">
                                <div className="mx-1 my-1 mana-cost-box-icon" />
                                <div>
                                    { parseInt(itemInfo.AbilityManaCost) }
                                </div>
                            </div>
                        }
                        <div className="px-1" />
                        {
                            itemInfo && itemInfo.AbilityCooldown &&
                            <div className="d-flex">
                                <FontAwesomeIcon 
                                    className="mx-1 my-1" 
                                    icon={faClock} />
                                <div>
                                    { parseFloat(itemInfo.AbilityCooldown)  }
                                </div>
                            </div>
                        }
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: section }}>
                    </div>
                </div>
            )
        } else {
            /// HTML for passive ability on item
            totalHtmlSections.push(
                <div
                    key={i} 
                    className={`my-3 ${itemInfo.ItemQuality === "consumable" ? "item-consumable" : "item-passive"}`} 
                    dangerouslySetInnerHTML={{ __html: section }}>
                </div>
            );
        }
    }

    return totalHtmlSections;
}

/// Gets all bonuses the item provides, returning a key value list
export function getItemStatistics (itemInfo, itemExtras) {
    if (!itemInfo || !itemInfo?.AbilitySpecial) {
        return null;
    }

    let statistics = [];
    // Array of phrases/keys to include check on AbilitySpecial keys
    let itemStatIncludePhrases = [
        "bonus", "spell", "attack", "multiplier", "regen",
        "resistance", "night_vision"
    ];

    let itmLevel = 1;
    if (itemExtras && itemExtras.level) {
        itmLevel = itemExtras.level;
    }

    for (let i = 0; i < itemInfo.AbilitySpecial.length; i++) {
        let keys = Object.keys(itemInfo.AbilitySpecial[i]);
        // Iterate over each AbilitySpecial key and take 
        // matching keys in phrase array
        for(let key of keys) {
            for(let phrase of itemStatIncludePhrases) {
                if (key.includes(phrase)) {
                    let val = tryParseAbilitySpecialValue(itemInfo.AbilitySpecial[i], itemInfo.AbilitySpecial[i][key], itmLevel);
                    statistics.push({
                        key: key,
                        value: val,
                    });
                }
            }
        }
    }

    return statistics;
}

/// Checks an ItemInfo Disassemble rule if it matches the given rule
export function isDissassembleRule(itemInfo, eDisassembleRule) {
    if (itemInfo && itemInfo.ItemDisassembleRule) {
        let split = itemInfo.ItemDisassembleRule.split(" | ");
        for(let rule of split) {
            if (rule === eDisassembleRule) {
                return true;
            }
        }
    }
    return false;
}

/// Checks if an item requires charges to function
export function itemRequiresCharges (itemName) {
    let itemInfo = getItemInfoFromName(itemName);
    if (itemInfo) {
        return itemInfo.ItemRequiresCharges === "1";
    }
    return false;
}

/// Checks an item alias from an ItemInfo to see if the phrase is included
export function itemAliasIncludes (itemAlias, includePhrase) {
    if (itemAlias && includePhrase) {
        let split = itemAlias.split(";");
        for (let alias of split) {
            if (alias.toLowerCase().indexOf(includePhrase.toLowerCase()) !== -1) {
                return true;
            }
        }
    }
    return false;
}

/// Gets the list of enabled/disabled Neutrals in their tiers
export function getNeutralTierLayout () {
    if (DOTANeutralsTierList) {
        return DOTANeutralsTierList;
    }
    return null;
}

/// Attempts to get a DOTA_Tooltip_[Aa]bility_{tooltipKey} string in the 
export function getFuzzyTooltipAbilityString (abilityStrings, key) {
    let str = getLocalizedString(abilityStrings, `DOTA_Tooltip_ability_${key}`);
    if (!str) {
        str = getLocalizedString(abilityStrings, `DOTA_Tooltip_Ability_${key}`);
    }
    return str;
}