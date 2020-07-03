import { DOTAAbilities } from "../data/dota2/json/npc_abilities.json";

/// Gets info and formattable display name of a talent
/// Returns both display name of talent and it's info in an object
export function getTalentInfoFromName(talent) {
    if (talent) {
        var talentInfo = DOTAAbilities[talent];
        return talentInfo;    
    } else {
        return null;
    }
}

export function getTalentDisplayNameFromStrings(abilityStrings, talent) {
    if (!abilityStrings || !talent) {
        return null;
    }

    var languageKeys = Object.keys(abilityStrings.Tokens);
    var matchingKeys = languageKeys.filter((key) => {
        if (key.includes(talent)) {
            return key;
        } else {
            return null;
        }
    });

    if (matchingKeys && matchingKeys.length > 0) {
        var displayName = abilityStrings.Tokens[matchingKeys[0]];
        return displayName;
    } else {
        return null;
    }
}