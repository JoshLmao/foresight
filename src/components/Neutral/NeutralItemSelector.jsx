import React, { Component } from 'react';
import {
    Button,
    Form,
    ListGroup
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

import {
    getAllNeutrals, getItemInfoFromName, getNeutralTierLayout, itemAliasIncludes,
} from "../../utility/dataHelperItems";

import "./NeutralItemSelector.css";
import { getItemIcon } from '../../utility/spriteHelper';
import { 
    getLocalizedString, 
    replaceStringValue,
} from '../../utility/data-helpers/language';

function ItemIcon(props) {
    let searchIconScale = 0.45;
    return (
        <div 
            key={props.keyName} 
            title={props.itemName} 
            onClick={props.onClick}
            data-item={props.itemName}
            className="m-1" 
            style={{ width: `calc(88px * ${searchIconScale})`, height: `calc(64px * ${searchIconScale})` }}>
            { 
                getItemIcon(props.itemName, "88px", "64px", searchIconScale) 
            }
        </div>
    );
}

/// HTML for one level of tiered neutral items
function NeutralTier (props) {
    return (
        <div>
            <div className="d-flex" style={{ color:"white" }}>
                <h6>
                    { replaceStringValue( getLocalizedString(props.dotaStrings, "DOTA_Shop_NeutralTier"), props.tier) } 
                </h6>
                <h6 className="ml-auto text-muted">
                    { props.time + "+" }
                </h6>
            </div>
            <div className="d-flex flex-wrap">
                {
                    props.neutrals && Object.keys(props.neutrals).map((neutralKey, index) => {
                        // Replace any recipes with actual item
                        let neutral = neutralKey;
                        if (neutral.includes("_recipe")) {
                            neutral = neutral.replace("_recipe", "");
                        }

                        let localizedName = getLocalizedString(props.abilityStrings, `DOTA_Tooltip_Ability_${neutral}`);
                        return (
                            <div 
                                className="m-1" 
                                key={ `${neutral}-${index}` } 
                                title={ localizedName }
                                onClick={ props.onNeutralSelected }
                                data-neutral={ neutral }
                                style={{ width: `calc(88px * ${props.iconScale})`, height: `calc(64px * ${props.iconScale})` }}>
                                { 
                                    getItemIcon(neutral, "88px", "64px", props.iconScale)
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

class NeutralItemSelector extends Component {
    constructor(props) {
        super(props);

        let allNeutrals = getAllNeutrals();
        let neutralTierList = getNeutralTierLayout();
        this.state = {
            allNeutrals: allNeutrals,
            queryNeutrals: null,
            neutralTierList: neutralTierList,

            iconScale: 0.49,
            onNewNeutralSelected: props.onNeutralSelected,

            dotaStrings: props.dotaStrings,
            abilityStrings: props.abilityStrings,
        };

        this.onNeutralSelected = this.onNeutralSelected.bind(this);
        this.onSearchChanged = this.onSearchChanged.bind(this);
    }

    onNeutralSelected(e) {
        let neutral = e.target.parentElement.dataset.neutral;
        this.state.onNewNeutralSelected({ item: neutral });
    }

    onSearchChanged (e) {
        let query = e.target.value;
        let filteredNeutrals = null;
        if (query) {
            filteredNeutrals = this.state.allNeutrals.filter((neutral, index) => {
                // Check query for match in localized string, should work most of the time
                let localizedName = getLocalizedString(this.state.abilityStrings, `DOTA_Tooltip_Ability_${neutral.item}`)?.toLowerCase();
                if (localizedName && localizedName.indexOf(query.toLowerCase()) !== -1) {
                    return true;
                }

                // Match query with any item aliases (only works for english)
                let aliasMatch = itemAliasIncludes(neutral.itemInfo.ItemAliases, query);
                if (aliasMatch) {
                    return true;
                }
            });
        }

        /// If no query, show all neutrals
        this.setState({
            queryNeutrals: filteredNeutrals,
        });
    }

    render() {
        return (
            <div className="neutral-item-card" style={{ color: "black" }}>
                <div className="neutral-item-card header d-flex p-2">
                    <div>
                        <Form.Control 
                            className="foresight-input-control"
                            type="text" 
                            placeholder="Search..." 
                            onChange={this.onSearchChanged}/>
                    </div>
                    <Button className="ml-auto" variant="outline-danger" onClick={this.onNeutralSelected} data-neutral={null}>
                        <FontAwesomeIcon icon={faMinus} data-neutral={null} />
                    </Button>
                </div>
                <div className="neutral-item-card content p-2">
                    {/* Query search term UI */}
                    {
                        this.state.queryNeutrals && 
                            <ListGroup className="foresight-list-group">
                                {
                                    <h6>
                                        { getLocalizedString(this.state.dotaStrings, "DOTA_Shop_Search_Results_Title") }
                                    </h6>
                                }
                                {
                                    this.state.queryNeutrals.map((itemInfo, index) => {
                                        let localizedName = getLocalizedString(this.state.abilityStrings, `DOTA_Tooltip_Ability_${itemInfo.item}`);
                                        return ( 
                                            <ListGroup.Item
                                                key={ `${itemInfo.item}-${index}`}
                                                onClick={this.onNeutralSelected}
                                                title={localizedName}
                                                data-neutral={itemInfo.item}
                                                action>
                                                <div className="d-flex" data-neutral={itemInfo.item}>
                                                    <ItemIcon 
                                                        itemName={itemInfo.item}
                                                        onClick={this.onNeutralSelected}  />
                                                    <h6 className="mx-1 my-auto" data-neutral={itemInfo.item}>
                                                        { localizedName }
                                                    </h6>
                                                </div>
                                            </ListGroup.Item>
                                        )
                                    })
                                }
                                {
                                    this.state.queryNeutrals.length <= 0 &&
                                        <h6>
                                            { 
                                                getLocalizedString(this.state.dotaStrings, "DOTA_Shop_Search_No_Results")
                                            }
                                        </h6>
                                }
                            </ListGroup>
                    }
                    
                    <div>
                        {
                            !this.state.queryNeutrals && this.state.neutralTierList && this.state.neutralTierList.map((tier, index) => {
                                let time = Object.keys(tier.drop_rates).filter((key) => {
                                    if (key.includes(":")) {
                                        return true;
                                    }
                                });
                                let array = tier.drop_rates[time[0]];
                                let tierDropAmt = Object.keys(array).length;

                                return (
                                    <NeutralTier 
                                        tier={index + 1}
                                        neutrals={tier.items}
                                        time={time}
                                        dropAmount={tierDropAmt}
                                        iconScale={this.state.iconScale}
                                        onNeutralSelected={this.onNeutralSelected}
                                        dotaStrings={this.state.dotaStrings}
                                        abilityStrings={this.state.abilityStrings}
                                        />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default NeutralItemSelector;