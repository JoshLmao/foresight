import { lang as EnglishStrings } from "../data/dota2/languages/abilities_english.json";
import { DOTAAbilities } from "../data/dota2/json/npc_abilities.json";

/// Gets info and formattable display name of a talent
export function getTalent(talent) {
    var englishKeys = Object.keys(EnglishStrings.Tokens);
    var matchingKeys = englishKeys.filter((key) => {
        if (key.includes(talent)) {
            return key;
        } else {
            return null;
        }
    });

    if (matchingKeys && matchingKeys.length > 0) {
        var talentInfo = DOTAAbilities[talent];
        var displayName = EnglishStrings.Tokens[matchingKeys[0]];
    
        return  {
            info: talentInfo,
            displayName: displayName,
        };    
    } else {
        return null;
    }

}