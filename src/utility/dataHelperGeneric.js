/// Takes a locale string that contains "%word_word%" phrases that are required to be replaced with the data value.
export function insertLocaleStringDataValues (localeString, infoObject, abilitySpecials) {
    if (!localeString) {
        return null;
    }

    // Regex to find a "%word_word%" phrase
    let replaceRegex = /%\w*?%/;
    // special character to use in placeholder of replacing in final string with ?
    let REPLACE_CHAR = "~";
    // Loop through all matches of the regex in the string
    while (localeString.match(replaceRegex)?.length > 0) {
        let phrase = localeString.match(replaceRegex)[0];
        if (phrase) {
            // Create key by removing %
            let infoKey = phrase.split("%").join("");
            let specialAbilityValue = null;
            // If no characters inbetween, needs to be a normal percentage sign
            if (infoKey === "") 
            {
                /// use the special REPLACE_CHAR
                specialAbilityValue = REPLACE_CHAR;
            }
            // if is an AbilitySpecial key as all contain a '_' 
            else if (infoKey.includes("_")) 
            {
                specialAbilityValue = getAbilitySpecialValue(abilitySpecials, infoKey);
            } 
            else 
            {
                // Check if infoKey is a key on the main itemInfo object
                specialAbilityValue = tryGetInfoValue(infoObject, infoKey);

                // could be AbilitySpecial key that contains no _
                if (!specialAbilityValue) {
                    specialAbilityValue = getAbilitySpecialValue(abilitySpecials, infoKey);
                }
            }
            
            // If not able to find a data value, use a question mark
            if (!specialAbilityValue) {
                specialAbilityValue = "?";
                console.error(`Unable to replace '${phrase}' phrase in locale string`);
            }
            // Replace and set
            localeString = localeString.replace(phrase, specialAbilityValue);
        }
    }

    /// replace REPLACE_CHAR with actual percentage sign
    let regexExp = new RegExp(REPLACE_CHAR, "g");
    localeString = localeString.replace(regexExp, "%");
    
    return localeString;
}

/// Searches an AbilitySpecial array for a key and get the key's value
export function getAbilitySpecialValue(abilitySpecials, key, abilityLevel = 1) {
    if (abilitySpecials && key) {
        // Loop through all AbilitySpecial and determine for a match
        for(let i = 0; i < abilitySpecials.length; i++) {
            let keys = Object.keys(abilitySpecials[i]);
            let matchingKey = keys.find(element => {
                return element === key;
            });
            // If has key, atempt parse
            if (matchingKey) {
                let specialAbilityInfo = abilitySpecials[i];
                return tryParseAbilitySpecialValue(specialAbilityInfo, specialAbilityInfo[matchingKey], abilityLevel);
            }
        }
    }
    return null;
}

// Attempts to parse the value of an AbilitySpecial value entry.
// For example: "spell_shield_resistance": "20 30 40 50" -> 40
export function tryParseAbilitySpecialValue (abilSpecialInfo, value, abilityLevel = 1) {
    // If data value is a string and has spaces to indicate the value at certain level, parse it
    if (typeof value === "string" && value.includes(' ')) {
        let split = value.split(' ');
        value = split[abilityLevel - 1];
    }

    /// Determine cast type and return
    if (abilSpecialInfo) {
        if (abilSpecialInfo.var_type === "FIELD_INTEGER") {
            return parseInt(value);
        } 
        else if(abilSpecialInfo.var_type === "FIELD_FLOAT") {
            return parseFloat(value);
        }
    }
    return value;
}

/// Try to get a value on the original Ability/Item object from a key
export function tryGetInfoValue (infoObject, key) {
    if (infoObject && key) {
        let keys = Object.keys(infoObject);
        let matchingKey = keys.find(element => {
            return element.toLowerCase() === key.toLowerCase();
        });

        if (matchingKey) {
            let infoValue = infoObject[matchingKey];
            if (infoValue.includes(".")) {
                return parseFloat(infoValue);
            } else {
                return parseInt(infoValue);
            }
        }
    }
    return null;
}