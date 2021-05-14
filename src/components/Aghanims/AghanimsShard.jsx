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
                if (abilityInfo.IsGrantedByShard === '1') {
                    shardAbility = {
                        abilityName: shardAbility,
                        type: "ability",
                    };
                } else if (abilityInfo.IsGrantedByScepter === '1') {
                    scepterAbility = {
                        abilityName: abilityName,
                        type: "ability",
                    };
                }
                // Ability has upgrade applied with shard/scepter
                if (abilityInfo.HasShardUpgrade === '1') {
                    shardAbility = {
                        abilityName: abilityName,
                        type: "upgrade",
                    };
                } else if (abilityInfo.HasScepterUpgrade === '1') {
                    scepterAbility = {
                        abilityName: abilityName,
                        type: "upgrade",
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
        this.state = {
            shardOn: false,
            shardAbility: scepterShardAbils.shard,
            scepterOn: itemsContainsScepter(props.items),
            scepterAbility: scepterShardAbils.scepter,
            tooltipDisabled: false,

            hero: props.hero,
            abilities: props.abilities,
            items: props.items,

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
            this.setState({
                items: this.props.items,
                scepterOn: itemsContainsScepter(this.props.items),
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
    }

    onShardClicked(e) {
        this.setState({
            shardOn: !this.state.shardOn,
        }, () => {
            this.state.onShardSet(this.state.on);
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
                    position="right"
                    closeOnDocumentClick
                    closeOnEscape
                    disabled={this.state.tooltipDisabled}
                    className="foresight-tooltip"
                    >
                    <AghanimsDescriptorTooltip
                        shardOn={this.state.shardOn}
                        shardAbility={this.state.shardAbility}
                        scepterOn={this.state.scepterOn}
                        scepterAbility={this.state.scepterAbility}
                        hero={this.state.hero}
                        abilityStrings={this.state.abilityStrings}
                        />
                </Popup>
            </div>
        );
    }
}

export default AghanimsShard;