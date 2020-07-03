import { DOTAHeroes } from "../data/dota2/json/npc_heroes.json";
import { lang as EngAbilStrings } from "../data/dota2/languages/abilities_english.json";
import { lang as EngGenStrings } from "../data/dota2/languages/dota_english.json";

import {
    parseNameFromModel,
} from "../utils";
import {
    getAllHeroAbilities,
    getHeroTalents,
} from "../utility/dataHelperHero";

const initialState = {
    /// Current selected hero by the user
    selectedHero: DOTAHeroes.npc_dota_hero_zuus,
    /// display name of the selectedHero
    selectedHeroName: parseNameFromModel(DOTAHeroes.npc_dota_hero_zuus.Model),
    /// Array of abilities of the selectedHero
    heroAbilities: getAllHeroAbilities(DOTAHeroes.npc_dota_hero_zuus),
    /// Array of talents of the selectedHero
    heroTalents: getHeroTalents(DOTAHeroes.npc_dota_hero_zuus),
    /// Array of talents selected by the user
    selectedTalents: [ ],
    /// Current level of the hero set by the user
    heroLevel: 1,

    /// Current items that have been selected
    items: [
        { slot: 0, item: "abyssal_blade" },
        { slot: 1, item: "" },
        { slot: 2, item: "" },
        { slot: 3, item: "" },
        { slot: 4, item: "" },
        { slot: 5, item: "" },
    ],
    /// Current backpack selected by user
    backpack: [
        { slot: 0, item: "" },
        { slot: 1, item: "" },
        { slot: 2, item: "" },
    ],
    /// Current neutral item selected by user
    neutralItem: { item: "orb_of_destruction" },

    // Current code of the selected UI language
    lang: "en",
    stringsAbilities: EngAbilStrings,
    stringsGeneral: EngGenStrings,
};

export default initialState;