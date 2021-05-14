import { DOTAHeroes } from "../data/dota2/json/npc_heroes.json";
import { lang as EngAbilStrings } from "../data/dota2/languages/abilities_english.json";
import { lang as EngDotaStrings } from "../data/dota2/languages/dota_english.json";

import {
    parseNameFromModel,
} from "../utils";
import {
    getAllHeroAbilities,
    getHeroTalents,
} from "../utility/dataHelperHero";

const initialState = {
    /// Current selected hero info by the user
    selectedHero: DOTAHeroes.npc_dota_hero_abaddon,
    /// Internal string name of the hero
    selectedHeroName: "npc_dota_hero_abaddon",
    /// Array of abilities of the selectedHero
    heroAbilities: getAllHeroAbilities(DOTAHeroes.npc_dota_hero_abaddon),
    heroAbilityLevels: getAllHeroAbilities(DOTAHeroes.npc_dota_hero_abaddon).map((val, index) => {
        return {
            ability: index,
            level: 1,
        };
    }),
    /// Array of talents of the selectedHero
    heroTalents: getHeroTalents(DOTAHeroes.npc_dota_hero_abaddon),
    /// Array of talents selected by the user
    selectedTalents: [ ],
    /// Current level of the hero set by the user
    heroLevel: 1,

    /// Current items that have been selected
    items: [
        { slot: 0, item: "" },
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
    neutralItem: { item: "" },
    /// Is Aghanims Shard enabled for the current hero?
    shard: false,

    // Current code of the selected UI language
    lang: "en",
    stringsAbilities: EngAbilStrings,
    stringsDota: EngDotaStrings,

    /// Selected enemy hero 
    selectedEnemyHero: DOTAHeroes.npc_dota_hero_target_dummy,
    selectedEnemyHeroName: parseNameFromModel(DOTAHeroes.npc_dota_hero_target_dummy.Model[1]),
    enemyHeroTalents: getHeroTalents(DOTAHeroes.npc_dota_hero_target_dummy),
    enemyHeroAbilities: getAllHeroAbilities(DOTAHeroes.npc_dota_hero_target_dummy),
    selectedEnemyTalents: [ ],
    enemyHeroItems: [
        { slot: 0, item: "ultimate_scepter" },
        { slot: 1, item: "" },
        { slot: 2, item: "" },
        { slot: 3, item: "" },
        { slot: 4, item: "" },
        { slot: 5, item: "" },
    ],
};

export default initialState;