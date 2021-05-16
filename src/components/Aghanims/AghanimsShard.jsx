import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import { getAbilityInfoFromName } from '../../utility/dataHelperAbilities';
import { itemsContainsScepter } from '../../utility/dataHelperItems';

import { 
    AghanimsDescriptorTooltip
} from '../Aghanims';
import { getScepterIconPath, getShardIconPath } from './aghs-helper';

function determineScepterShardAbilities (heroAbilities) {
    let shardAbility = null, scepterAbility = null;
    if (heroAbilities) {
        for (let abilityName of heroAbilities) {
            let abilityInfo = getAbilityInfoFromName(abilityName);
            // Check Shard/Scepter is an ability when bought
            if (abilityInfo) {
                // Ability is granted to hero with shard/scepter
                // Single IF checks since one ability can be upgraded by both scepter/shard
                if (abilityInfo.IsGrantedByShard === '1') {
                    shardAbility = {
                        abilityName: abilityName,
                        type: "DOTA_AbilityTooltip_Aghs_New_Ability",
                    };
                } 
                if (abilityInfo.IsGrantedByScepter === '1') {
                    scepterAbility = {
                        abilityName: abilityName,
                        type: "DOTA_AbilityTooltip_Aghs_New_Ability",
                    };
                }
                // Ability has upgrade applied with shard/scepter
                if (abilityInfo.HasShardUpgrade === '1') {
                    shardAbility = {
                        abilityName: abilityName,
                        type: "DOTA_AbilityTooltip_Upgrade",
                    };
                }
                if (abilityInfo.HasScepterUpgrade === '1') {
                    scepterAbility = {
                        abilityName: abilityName,
                        type: "DOTA_AbilityTooltip_Upgrade",
                    };
                }
            }
        }
    }

    return {
        shard: shardAbility,
        scepter: scepterAbility,
    }
}

class AghanimsShard extends Component {
    constructor(props) {
        super(props);
        
        // Determine shard/scepter abilities
        
        let scepterShardAbils = determineScepterShardAbilities(props.abilities);
        let containsScepter = itemsContainsScepter(props.items);
        this.state = {
            shardOn: false,
            shardAbility: scepterShardAbils.shard,
            scepterOn: containsScepter,
            scepterAbility: scepterShardAbils.scepter,
            tooltipDisabled: false,

            hero: props.hero,
            abilities: props.abilities,
            items: props.items,

            dotaStrings: props.dotaStrings,
            abilityStrings: props.abilityStrings,

            onShardSet: props.onShardSet,
        };

        this.onShardClicked = this.onShardClicked.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.hero != prevProps.hero) {
            this.setState({
                hero: this.props.hero,
            });
        }
        if (this.props.items != prevProps.items) {
            let containsScepter = itemsContainsScepter(this.props.items);
            this.setState({
                items: this.props.items,
                scepterOn: containsScepter,
            });
        }
        if (this.props.abilities != prevProps.abilities) {
            let shardScepterAbils = determineScepterShardAbilities(this.props.abilities);
            this.setState({
                abilities: this.props.abilities,
                shardAbility: shardScepterAbils.shard,
                scepterAbility: shardScepterAbils.scepter,
            });
        }
        if (this.props.abilityStrings != prevProps.abilityStrings) {
            this.setState({
                abilityStrings: this.props.abilityStrings,
            });
        }
        if (this.props.dotaStrings != prevProps.dotaStrings) {
            this.setState({
                dotaStrings: this.props.dotaStrings,
            });
        }
    }

    onShardClicked(e) {
        // Toggle shard state and trigger event
        this.setState({
            shardOn: !this.state.shardOn,
        }, () => {
            this.state.onShardSet(this.state.shardOn);
        });
    }

    render() {
        return (
            <div>
                <Popup
                    trigger={isOpen => (
                        <div>
                            <div>
                                <img 
                                    src={getScepterIconPath(this.state.scepterOn)}
                                    />
                            </div>
                            <div 
                                onClick={this.onShardClicked}
                                style={{ cursor: "pointer" }}>
                                <img 
                                    src={getShardIconPath(this.state.shardOn)}
                                    />
                            </div>
                        </div>
                    )}
                    position="bottom"
                    closeOnDocumentClick
                    closeOnEscape
                    disabled={this.state.tooltipDisabled}
                    className="foresight-tooltip"
                    on="hover"
                    contentStyle={{ 
                        width: "450px",
                        height: "auto"
                    }}
                    >
                    <AghanimsDescriptorTooltip
                        shardOn={this.state.shardOn}
                        shardAbility={this.state.shardAbility}
                        scepterOn={this.state.scepterOn}
                        scepterAbility={this.state.scepterAbility}
                        hero={this.state.hero}
                        dotaStrings={this.state.dotaStrings}
                        abilityStrings={this.state.abilityStrings}
                        />
                </Popup>
            </div>
        );
    }
}

export default AghanimsShard;