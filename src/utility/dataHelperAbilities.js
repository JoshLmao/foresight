// * Helper and utility functions to provide for retrieving data from "npc_abilities.json"
// * 

import { DOTAAbilities } from "../data/dota2/json/npc_abilities.json";
import { 
    EAbilityBehaviour, 
    EDamageType, 
    ESpellImmunityType,
    ESpecialBonusOperation
} from "../enums/abilities";

import {
    lang as DOTAEngAbilityStrings
} from "../data/dota2/languages/abilities_english.json";
import { containsLocalizedString } from "./data-helpers/language";
import { itemsContainsScepter } from "./dataHelperItems";
import { 
    tryGetTalentSpecialAbilityValue,
    talentsInclude
} from "./dataHelperTalents";

export function getAbilityInfoFromName(abilityName) {
    if (abilityName) {
        return DOTAAbilities[abilityName];
    } else {
        return null;
    }
}

export function tryGetAbilitySpecialAbilityValue (ability, specialValueKey, abilityLevel = 1) {
    let abilityInfo = getAbilityInfoFromName(ability);
    if (abilityInfo) {
        let specialValue = getAbilitySpecialAbilityValue(abilityInfo, specialValueKey, abilityLevel);
        if (specialValue) {
            return specialValue;
        }
    }
    return null;
}

export function getAbilitySpecialAbilityValue(abilityInfo, specialAbilityKey, abilityLevel = 1) {
    if (abilityInfo && abilityInfo.AbilitySpecial) {
        for(let i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
            let keys = Object.keys(abilityInfo.AbilitySpecial[i]);
            let matchingKey = keys.find(element => {
                return element === specialAbilityKey;
            });

            if (matchingKey) {
                let specialAbilityInfo = abilityInfo.AbilitySpecial[i];

                // If value contains a space, it can be levelled up needs to be split up
                let dataValue = specialAbilityInfo[matchingKey];
                if (typeof dataValue === "string" && dataValue.includes(' ')) {
                    let split = specialAbilityInfo[matchingKey].split(' ');
                    dataValue = split[abilityLevel - 1];
                }

                /// If wanting it for it's value, correctly convert and return
                if (matchingKey.includes("value") || specialAbilityInfo.var_type) {
                    if (specialAbilityInfo.var_type === "FIELD_INTEGER") {
                        return parseInt(dataValue);
                    } 
                    else if(specialAbilityInfo.var_type === "FIELD_FLOAT") {
                        return parseFloat(dataValue);
                    }
                } 
                /// else return whatever the value is
                else {
                    return dataValue;
                }
                
            }
        }
    }
}

/// Gets 
export function getAbilitySpecialCastRangeValue (abilityInfo, includePhrase, abilityLevel = 1) {
    if (abilityInfo && abilityInfo.AbilitySpecial) {
        for(let i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
            let keys = Object.keys(abilityInfo.AbilitySpecial[i]);
            let matchingKey = keys.find(element => {
                return element.includes(includePhrase) && !element.includes("scepter");
            });

            if (matchingKey) {
                let specialAbilityInfo = abilityInfo.AbilitySpecial[i];

                /// ignore if scepter 
                if (specialAbilityInfo.RequiresScepter) {
                    return null;
                }

                // If value contains a space, it can be levelled up needs to be split up
                let dataValue = specialAbilityInfo[matchingKey];
                
                /// Return dataValue in format
                return tryParseAbilitySpecialValue(specialAbilityInfo, dataValue, abilityLevel)
            }
        }
    }
}

/// Searches an AbilityInfo's AbilitySpecial array for a property that includes the the "includePhrase"
/// in it's key. For example includePhrase = "charges" would return value of voice spirit's "max_charges"
export function getIncludesAbilitySpecialAbilityValue(abilityInfo, includePhrase, abilityLevel) {
    if (abilityInfo && abilityInfo.AbilitySpecial) {
        for(let i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
            let keys = Object.keys(abilityInfo.AbilitySpecial[i]);
            let matchingKey = keys.find(element => {
                return element.includes(includePhrase);
            });

            if (matchingKey) {
                let specialAbilityInfo = abilityInfo.AbilitySpecial[i];
                let dataValue = specialAbilityInfo[matchingKey];

                /// Return dataValue in format
                return tryParseAbilitySpecialValue(specialAbilityInfo, dataValue, abilityLevel);
            }
        }
    }
    return null;
}

/// Gets the standard output damage of an ability from its level
export function getAbilityOutputDamage(abilityInfo, abilityLevel) {
    let abilityDmg = {
        min: null,
        max: null,
        damage: null,
        isPercent: null,
    };

    if (abilityInfo && abilityLevel) {
        if (abilityInfo.AbilityDamage) {
            let dmgValue = abilityInfo.AbilityDamage.split(' ')[abilityLevel - 1];
            abilityDmg = {
                ...abilityDmg,
                damage: parseFloat(dmgValue),
            };
        }
        else if (abilityInfo.AbilitySpecial) 
        {
            for (let i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
                let specialAbilityElement = abilityInfo.AbilitySpecial[i];
                
                let abilSpecKeys = Object.keys(specialAbilityElement);
                for(let key of abilSpecKeys) {
                    // AbilitySpecial contains damage under a property
                    let lowerKey = key.toLowerCase();
                    
                    // Includes dmg & not scepter
                    if (lowerKey.includes("damage") && !lowerKey.includes("scepter")) 
                    {
                        let value = parseAbilityValueByLevel(specialAbilityElement[key], abilityLevel);
                        let dmgValue = parseFloat(value);

                        if (lowerKey.includes("min")) {
                            //min_damage
                            abilityDmg.min =  dmgValue;
                        }
                        if (lowerKey.includes("max")) {
                            abilityDmg.max = dmgValue;
                        } 
                        if (lowerKey.includes("pct")) {
                            abilityDmg.isPercent = true;
                        }

                        if (!abilityDmg.min && !abilityDmg.max) {
                            abilityDmg.damage = dmgValue;
                        }
                    }

                    // Stop iterate if have min&max or dmg
                    if (abilityDmg.min && abilityDmg.max || abilityDmg.damage) {
                        break;
                    }
                }
            }
        }
    }

    return abilityDmg;
}

/// Gets all behaviour options of an ability such as if it goes through BKB, damage type, etc
export function getAbilityBehaviours(abilityInfo) {
    if (!abilityInfo) {
        return null;
    }

    let behaviours = [];

    if (abilityInfo.AbilityBehavior) {
        let targeting = [];
        let splitBehaviours = abilityInfo.AbilityBehavior.split(' | ');
        for(let b of splitBehaviours) {
            switch(b) {
                case EAbilityBehaviour.UNIT_TARGET:
                    targeting.push("DOTA_ToolTip_Ability_Target");
                    break;
                case EAbilityBehaviour.POINT:
                    targeting.push("DOTA_ToolTip_Ability_Point");
                    break;
                case EAbilityBehaviour.PASSIVE:
                    targeting.push("DOTA_ToolTip_Ability_Passive");
                    break;
                case EAbilityBehaviour.NO_TARGET:
                    targeting.push("DOTA_ToolTip_Ability_NoTarget");
                    break;
            }
        }
    
        behaviours.push({
            key: "DOTA_ToolTip_Ability",
            value: targeting,
        });
    }

    if (abilityInfo.AbilityUnitDamageType) {
        let dmgTypeVal = "";
        let splitDmgTypes = abilityInfo.AbilityUnitDamageType.split(" | ");
        for(let type of splitDmgTypes) {
            switch(type) {
                case EDamageType.MAGICAL:
                    dmgTypeVal = "DOTA_Plus_Death_Screen_MagicalDamage";
                    break;
                case EDamageType.PURE:
                    dmgTypeVal = "DOTA_Plus_Death_Screen_PureDamage";
                    break;
                case EDamageType.PHYSICAL:
                    dmgTypeVal = "DOTA_Plus_Death_Screen_PhysicalDamage";
                    break;
                default:
                    dmgTypeVal = "Not Implemented";
                    break;
            }
        }

        behaviours.push({
            key: "DOTA_ToolTip_Damage",
            value: dmgTypeVal,
        });
    }

    if (abilityInfo.SpellImmunityType) {
        let pierceValue = "";
        switch(abilityInfo.SpellImmunityType) {
            case ESpellImmunityType.YES:
                pierceValue = "DOTA_ToolTip_PiercesSpellImmunity_Yes";
                break;
            case ESpellImmunityType.NO:
            case ESpellImmunityType.ALLIES_NO:
                pierceValue = "DOTA_ToolTip_PiercesSpellImmunity_No";
                break;
            case ESpellImmunityType.ALLIES_YES_ENEMIES_NO:
                pierceValue = "DOTA_ToolTip_PiercesSpellImmunity_AlliesYesEnemiesNo";
                break;
            default:
                pierceValue = "Unknown";
                break;
        }

        behaviours.push({
            key: "DOTA_ToolTip_PiercesSpellImmunity",
            value: pierceValue,
        });
    }

    return behaviours;
}

/// Parses an AbilitySpecial
export function parseAbilitySpecialValueByLevel (abilitySpecials, key, level = 1) {
    let valuesSplit = abilitySpecials[key].split(' ');
    if (valuesSplit.length > 1) {
        return valuesSplit[level - 1];
    } else {
        return abilitySpecials[key];
    }
}

/// Parses a value in an abilityInfo that could be alone or have multiple values per level
export function parseAbilityValueByLevel (value, level = 1) {
    if (level < 1) {
        return null;
    }
    
    let abilValue = 0;
    if (typeof value === "string") {
        let splitValues = value.split(" ");
        if (splitValues.length > 1) {
            abilValue = splitValues[level - 1];
        } else {
            abilValue = value;
        }

        abilValue = parseFloat(abilValue);
    } else {
        abilValue = value;
    }

    return abilValue;
}

export function isCooldownTalent (talent) {
    return isTalent(talent, "cooldown");
}

export function isDamageTalent (talent) {
    return isTalent(talent, "damage");
}

export function isCastRangeTalent (talent) {
    return isTalent(talent, "cast range");
}

export function isTalent (talent, lowerCasePhrase) {
    let abilityString = DOTAEngAbilityStrings.Tokens["DOTA_Tooltip_ability_" + talent];
    return abilityString && abilityString.toLowerCase().includes(lowerCasePhrase);
}

/// Checks the AbilityBehavior string on an AbilityInfo to
/// see if it contains all EBehaviours in array
export function isAbilityBehaviour (abilityBehaviour, ebehaviours) {
    if (abilityBehaviour) {
        // Split behaviours if contains " | "
        let splitBehaviours = abilityBehaviour.split(' | ');
        // Determine if it contains
        let contains = splitBehaviours.some((b) => ebehaviours.includes(b));
        return contains;
    }
    return false;
}

/// Gets all AbilitySpecial extra information values with it's translation key 
export function getAbilitySpecialExtraValues (abilityName, abilityInfo, abilityLevel, items, selectedTalents) {
    if (!abilityInfo || (abilityInfo && !abilityInfo.AbilitySpecial)) {
        return null;
    }

    let abilitySpecials = [];
    let containsScepter = itemsContainsScepter(items);

    for (let specialInfo of abilityInfo.AbilitySpecial) {
        let abilitySpecialKeys = Object.keys(specialInfo);
        let currentAbilitySpecialObject = null;
        for (let key of abilitySpecialKeys) {

            // Store specific properties inside object for later
            if (key === "LinkedSpecialBonus") {
                currentAbilitySpecialObject = {
                    ...currentAbilitySpecialObject,
                    specialBonus: specialInfo[key],
                };
            } else if (key === "LinkedSpecialBonusOperation") {
                currentAbilitySpecialObject = {
                    ...currentAbilitySpecialObject,
                    specialBonusOperation: specialInfo[key],
                };
            }

            // Skip specific properties we don't need
            if (key.includes("var_type") || key.includes("RequiresScepter") || key === "damage") {
                continue;
            }
            
            // Ignore scepter info if no aghs in inventory
            if (key.includes("scepter") && !containsScepter) {
                continue;
            }

            // Create key for indexing inside locale files
            let translationKey = `DOTA_Tooltip_ability_${abilityName}_${key}`;

            let abilityValue = null;
            // if AbilitySpecial key doesn't contain an underscore, it references property on master AbilityInfo object
            if (!key.includes("_") && !key.includes("Linked")) {
                let containsKey = tryGetAbilityInfoValueFromKey(abilityInfo, key);
                if (containsKey) {
                    abilityValue = tryParseAbilitySpecialValue(abilityInfo, abilityInfo[containsKey], abilityLevel);
                }
            } else {
                abilityValue = tryParseAbilitySpecialValue(specialInfo, specialInfo[key], abilityLevel);
            }
            
            if (translationKey && abilityValue) {
                currentAbilitySpecialObject = {
                    ...currentAbilitySpecialObject,
                    key: translationKey,
                    value: abilityValue,
                };
            }
        }

        if (currentAbilitySpecialObject && currentAbilitySpecialObject.value) {
            let value = currentAbilitySpecialObject.value;

            // If AbilitySpecial has special bonus modifier and is selected
            if ( talentsInclude(selectedTalents, currentAbilitySpecialObject.specialBonus) ) {
                let specialBonusValue = tryGetTalentSpecialAbilityValue(currentAbilitySpecialObject.specialBonus, "value");

                /// Apply bonus operation to value
                if (currentAbilitySpecialObject.specialBonusOperation) {
                    switch (currentAbilitySpecialObject.specialBonusOperation) {
                        case ESpecialBonusOperation.SUBTRACT:
                            value -= specialBonusValue;
                            break;
                        case ESpecialBonusOperation.MULTIPLY:
                            value *= specialBonusValue;
                            break;
                        case ESpecialBonusOperation.PERCENT_ADD:
                            let percentBonus = (value / 100) * specialBonusValue;
                            value += percentBonus;
                            break;
                        default:
                            console.log(`Unknown SpecialBonusOperation: ${currentAbilitySpecialObject.specialBonusOperation}`);
                            break;
                    };
                } else {
                    /// If no special bonus operation, add new value on original
                    if (specialBonusValue) {
                        value += specialBonusValue;
                    }
                }
            }

            abilitySpecials.push({
                key: currentAbilitySpecialObject.key,
                value: value,
            });
        }
    }

    return abilitySpecials;
}

export function tryParseAbilitySpecialValue (abilSpecialinfo, value, abilityLevel = 1) {
    if (typeof value === "string" && value.includes(' ')) {
        let split = value.split(' ');
        value = split[abilityLevel - 1];
    }

    if (abilSpecialinfo) {
        if (abilSpecialinfo.var_type === "FIELD_INTEGER") {
            return parseInt(value);
        } 
        else if(abilSpecialinfo.var_type === "FIELD_FLOAT") {
            return parseFloat(value);
        }
    }
    return value;
}

/// Try get's a value on an AbilityInfo object from it's key, which can be upper/lower/CamelCase
export function tryGetAbilityInfoValueFromKey (abilityInfo, key) {
    let abilInfoKeys = Object.keys(abilityInfo);
    for(let abilInfoKey of abilInfoKeys) {
        if (abilInfoKey.toLowerCase() === key.toLowerCase()) {
            return  abilInfoKey;
        }
    }
    return null;
}
