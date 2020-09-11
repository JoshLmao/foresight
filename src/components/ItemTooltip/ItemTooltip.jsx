import React, { Component } from 'react';

import {
    getItemInfoFromName, 
    convertItemDescToHtml,
    getItemStatistics,
    isDissassembleRule
} from "../../utility/dataHelperItems";
import { 
    getLocalizedString
} from '../../utility/data-helpers/language';
import { calculateItemSellCost } from "../../utility/calculate";
import {
    EDisassembleRule, EItemQuality
} from "../../enums/items";

import "./ItemTooltip.css";
import { getItemIcon } from '../../utility/spriteHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCampground } from '@fortawesome/free-solid-svg-icons';

function replaceItemStatLocalizeString (localizeString, value) {
    // If generic one tha contains $value, split and insert value
    if(localizeString.includes("$")) {
        let split = localizeString.split('$');
        split.splice(1, 0, value);
        return split.join(" ");
    } 
    // If contains %, arrange it correctly
    else if (localizeString.includes("%")) {
        return localizeString.replace("%+", `+ ${value}% `);
    }
    /// If negative value
    else if (localizeString.includes("-")) {
        return localizeString.replace("-", `- ${Math.abs(value)} `);
    }
    return localizeString;
}

class ItemTooltip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemName: props.itemName,
            dotaStrings: props.dotaStrings,
            abilityStrings: props.abilityStrings,

            itemInfo: getItemInfoFromName(props.itemName),  
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                itemName: this.props.itemName,
                dotaStrings: this.props.dotaStrings,
                abilityStrings: this.props.abilityStrings,
                itemInfo: getItemInfoFromName(this.props.itemName),  
            });
        }
    }

    render() {
        let scale = 0.7;
        let width = "88px";
        let height = "64px";
        let goldIconSize = 20;

        let itemStats = getItemStatistics(this.state.itemInfo);
        let loreString = getLocalizedString(this.state.abilityStrings, `DOTA_Tooltip_ability_${this.state.itemName}_Lore`);
        /// Get localized string and filter it to correct html
        let descString = getLocalizedString(this.state.abilityStrings, `DOTA_Tooltip_ability_${this.state.itemName}_Description`);
        let descFiltered = convertItemDescToHtml(descString, this.state.itemName, this.state.itemInfo);
        return (
            <div className="item-tooltip">
                <div className="d-flex p-1">
                    <div className="m-2" style={{ width: `calc(${width} * ${scale})`, height: `calc(${height} * ${scale})` }}>
                        {  
                            getItemIcon(this.state.itemName, width, height, 0.7) 
                        }
                    </div>
                    <div>
                        <h4>
                            { getLocalizedString(this.state.abilityStrings, `DOTA_Tooltip_Ability_${this.state.itemName}`) }
                        </h4>
                        {
                            //If has an item cost and is more than 0
                            this.state.itemInfo?.ItemCost && this.state.itemInfo?.ItemCost > 0 &&
                            <div className="d-flex">
                                {
                                    this.state.itemInfo?.ItemQuality &&
                                        <FontAwesomeIcon icon={this.state.itemInfo?.ItemQuality == EItemQuality.SECRET_SHOP ? faCampground : faHome } className="align-item-center" />
                                }
                                <img 
                                    className="mx-1"
                                    src={process.env.PUBLIC_URL + "/images/dota2/gold_icon_ui.png"} 
                                    height={goldIconSize}
                                    width={goldIconSize} />
                                <h6 className="gold-amount">
                                    { parseInt(this.state.itemInfo?.ItemCost) }
                                </h6>
                            </div>
                        }
                    </div>
                </div>
                <div className="item-content p-2">
                    {/* item stat info */}
                    {
                        itemStats &&
                            <div className="pb-1">
                                { 
                                    itemStats.map((value) => {
                                        /// attempt to get localized string and display
                                        let string = getLocalizedString(this.state.abilityStrings, `DOTA_Tooltip_ability_${this.state.itemName}_${value.key}`);
                                        if (string) {
                                            /// Check if item stat is a generic one that can be applied to most items and replace variable with localized string
                                            let genericKeys = [
                                                "health", "mana", "armor", "damage", "str", "int", "agi", "all", "attack", "hp_regen",
                                                "mana_regen", "spell_amp", "move_speed", "evasion", "spell_resist", "selected_attrib",
                                                "attack_range", "attack_range_melee", "cast_range", "status_resist"
                                            ];
                                            // split and use variable to compare
                                            let splitCompare = string.split("$")[1];
                                            for (let key of genericKeys) {
                                                if (splitCompare === key) {
                                                    /// get localized generic and replace variable in existing string
                                                    let localized = getLocalizedString(this.state.abilityStrings, `dota_ability_variable_${key}`);
                                                    string = string.replace(key.toString(), localized);
                                                    break;
                                                }
                                            }
                                            
                                            return (
                                                <div key={value.key} dangerouslySetInnerHTML={{ __html: replaceItemStatLocalizeString(string, value.value) }}>
                                                </div>
                                            );
                                        }
                                    })
                                }
                            </div>
                    }

                    {/* abilities */}
                    {
                        descString && descString != "?" &&
                            <div className="p-1">
                                { descFiltered }
                            </div>
                    }

                    {/* lore */}
                    {
                        loreString && loreString != "?" &&   
                            <div className="p-1 m-1 lore">
                                { loreString }
                            </div>
                    }

                    {/* sell price */}
                    {
                        this.state.itemInfo?.ItemCost && !this.state.itemInfo?.ItemIsNeutralDrop &&
                            <div className="px-1"> 
                                {
                                    getLocalizedString(this.state.dotaStrings, "DOTA_Item_Tooltip_Sell_Price")
                                    .replace("%s1", calculateItemSellCost(this.state.itemInfo))
                                }
                            </div>
                    }

                    {/* dissassemble */}
                    {
                        isDissassembleRule(this.state.itemInfo, EDisassembleRule.ALWAYS) && 
                            <div className="px-1">
                                { getLocalizedString(this.state.dotaStrings, "DOTA_Item_Tooltip_Disassemble") }
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default ItemTooltip;