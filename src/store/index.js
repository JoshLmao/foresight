import { createStore } from "redux";
import { DOTAHeroes } from "../data/dota2/json/npc_heroes.json";

function parseName(modelString) {
    var dashSplit = modelString.split('.')[0].split('/');
    return dashSplit[dashSplit.length - 1];
}

function getHeroAbilities(heroInfo) {
    return [
        heroInfo.Ability1, heroInfo.Ability2, heroInfo.Ability3, heroInfo.Ability4, heroInfo.Ability5, heroInfo.Ability6, heroInfo.Ability7,
    ];
}

const initialState = {
    selectedHero: DOTAHeroes.npc_dota_hero_zuus,
    selectedHeroName: parseName(DOTAHeroes.npc_dota_hero_zuus.Model),
    selectedHeroAbilities: getHeroAbilities(DOTAHeroes.npc_dota_hero_zuus),
    items: [
        { slot: 0, item: "abyssal_blade" },
        { slot: 1, item: "" },
        { slot: 2, item: "" },
        { slot: 3, item: "" },
        { slot: 4, item: "" },
        { slot: 5, item: "" },
    ],
    backpack: [
        { slot: 0, item: "" },
        { slot: 1, item: "" },
        { slot: 2, item: "" },
    ],
    neutralItem: { item: "orb_of_destruction" },
};

function reducer(state = initialState, action) {
    switch(action.type)
    {
        case "SELECTEDHERO":
            return {
                selectedHero: action.value,
                selectedHeroName: parseName(action.value.Model),
                selectedHeroAbilities: getHeroAbilities(action.value),
            };
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;