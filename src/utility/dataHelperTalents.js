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