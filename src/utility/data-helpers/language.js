/// Searches the passed strings file for the related string
/// Very resource intensive
export function tryGetLocalizedString(languageStrings, stringKey) {
    if (!languageStrings || !stringKey) {
        return null;
    }

    var languageKeys = Object.keys(languageStrings.Tokens);
    var matchingKeys = languageKeys.filter((key) => {
        if (key.toLowerCase() === stringKey.toLowerCase()) {
            return key;
        } else {
            return null;
        }
    });

    if (matchingKeys && matchingKeys.length > 0) {
        var displayName = languageStrings.Tokens[matchingKeys[0]];
        return displayName;
    } else {
        return "?";
    }
}

export function tryGetTalentLocalizedString(languageStrings, stringKey) {
    if (!languageStrings || !stringKey) {
        return null;
    }

    var languageKeys = Object.keys(languageStrings.Tokens);
    var matchingKeys = languageKeys.filter((key) => {
        if (key.includes(stringKey)) {
            return key;
        } else {
            return null;
        }
    });

    if (matchingKeys && matchingKeys.length > 0) {
        var displayName = languageStrings.Tokens[matchingKeys[0]];
        return displayName;
    } else {
        return "?";
    }
}

/// Quick method for retrieving localized string
/// Main fast method to retrieve an exact key from strings
export function getLocalizedString(localeStrings, key) {
    let string = localeStrings.Tokens[key];
    return string ?? "?";
}

/// Gets a string from the dota strings that contain the prefix "DOTA_Toolip_"
/// Useful for getting general tooltip UI strings
export function getTooltipString(dotaStrings, tooltipKey) {
    if (!dotaStrings || !tooltipKey) {
        return null;
    }

    if (!tooltipKey.includes("DOTA_ToolTip_")) {
        tooltipKey = "DOTA_ToolTip_" + tooltipKey;
    }
    var match = dotaStrings.Tokens[tooltipKey];
    return match;
}

/// Gets a string from the abilities strings that contain the prefix "DOTA_Tooltip_ability"
/// Useful for retrieving localized strings of ability names
export function getTooltipAbilityString(abilityStrings, abilityKey) {
    if (!abilityStrings || !abilityKey) {
        return null;
    }
    if (!abilityKey.includes("DOTA_Tooltip_ability")) {
        abilityKey = "DOTA_Tooltip_ability_" + abilityKey;
    }
    var match = abilityStrings.Tokens[abilityKey];
    return match;
}

/// Places a value in a translation string that contains a "{s:value}" inside
export function replaceStringValue(string, value) {
    if (!string || !value) {
        return "?";
    }

    string = string.replace(/{.*}/, value);
    return string;
}