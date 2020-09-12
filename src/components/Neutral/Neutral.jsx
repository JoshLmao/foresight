import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

import NeutralItemSelector from "./NeutralItemSelector";
import ItemTooltip from '../ItemTooltip';

import { itemNameToElement } from "../../utils";
import { getItemIcon } from '../../utility/spriteHelper';

class Neutral extends Component {
    constructor(props) {
        super(props);

        this.state = {
            neutralItem: props.neutralItem,
            onNewNeutralSelected: props.onNewNeutralSelected,
            dotaStrings: props.dotaStrings,
            abilityStrings: props.abilityStrings,

            iconScale: 0.7,
            neutralSelectorDisabled: false,
        };

        this.onNeutralSelected = this.onNeutralSelected.bind(this);
    }

    componentDidUpdate (prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                neutralItem: this.props.neutralItem,
                dotaStrings: this.props.dotaStrings,
                abilityStrings: this.props.abilityStrings,
                onNewNeutralSelected: this.props.onNewNeutralSelected,
            });
        }
    }

    onNeutralSelected (neutral) {
        this.setState({
            neutralSelectorDisabled: true,
        });

        if (this.state.onNewNeutralSelected) {
            this.state.onNewNeutralSelected(neutral);
        }
    }

    render() {
        if(this.state.neutralSelectorDisabled) {
            this.setState({ neutralSelectorDisabled: false });
        }

        return (
            <div>
                {
                    this.state.neutralItem && this.state.neutralItem.item &&
                        <Popup
                            trigger={isOpen => (
                                <div
                                    className="ml-2 mt-1" 
                                    style={{ position:"absolute", zIndex: 1 }}>
                                    <FontAwesomeIcon icon={faInfo} />
                                </div>
                            )}
                            position="right center"
                            on="hover"
                            contentStyle={{ width: "350px", overflowY: "auto", padding: 0, border: 0 }}>
                                <ItemTooltip
                                    itemName={this.state.neutralItem.item}
                                    dotaStrings={this.state.dotaStrings}
                                    abilityStrings={this.state.abilityStrings}
                                    />
                        </Popup>
                }
                <Popup
                    trigger={isOpen => {
                        return getItemIcon(this.state.neutralItem.item, "88px", "64px", this.state.iconScale);
                    }}
                    position="right center"
                    disabled={this.state.neutralSelectorDisabled}
                    contentStyle={{ 
                        width: "325px", 
                        overflowY: "auto", 
                        padding: 0, 
                        border: 0,
                    }}>
                        <NeutralItemSelector 
                            onNeutralSelected={this.onNeutralSelected}
                            dotaStrings={this.state.dotaStrings} 
                            abilityStrings={this.state.abilityStrings}
                            />
                </Popup>
            </div>
        );
    }
}

export default Neutral;