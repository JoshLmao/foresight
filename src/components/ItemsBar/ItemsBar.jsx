import React, { Component } from 'react';
import {
    Row, 
    Col
} from "react-bootstrap";

import Item from "./Item";
import Neutral from "../Neutral";
import { getLocalizedString } from '../../utility/data-helpers/language';

class ItemsBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: props.items,
            backpack: props.backpack,
            neutral: props.neutral,
            iconScale: 0.7,

            onNeutralChanged: props.onNeutralChanged,
            onItemChanged: props.onItemChanged,

            dotaStrings: props.dotaStrings,
            abilityStrings: props.abilityStrings,
        };
    }

    componentDidUpdate(prevProps) {
        //Update if previous props have changed
        if (prevProps.items !== this.props.items) {
            this.setState({
                items: this.props.items,
            });
        }

        if (prevProps.backpack !== this.props.backpack) {
            this.setState({
                backpack: this.props.backpack,
            });
        }

        if (prevProps.neutral !== this.props.neutral) {
            this.setState({
                neutral: this.props.neutral,
            });
        }

        if (prevProps.abilityStrings !== this.props.abilityStrings) {
            this.setState({ abilityStrings: this.props.abilityStrings });
        }
        if (prevProps.dotaStrings !== this.props.dotaStrings) {
            this.setState({ dotaStrings: this.props.dotaStrings });
        }
    }

    render() {
        var itemsColWidth = 5;
        var backpackColWidth = 5;
        var neutralColWidth = 2;
        return (
            <div>
                <Row>
                    <Col md={itemsColWidth}>
                        <h6>{ getLocalizedString(this.state.dotaStrings, "DOTA_SHOP_ITEMS") }</h6>
                        <div className="d-flex flex-wrap">
                            {
                                this.state.items && this.state.items.map((value) => {
                                    return (
                                        <Item 
                                            key={value.slot}
                                            slot={value.slot}
                                            item={value.item} 
                                            onItemChanged={this.state.onItemChanged}
                                            onItemExtraChnaged={this.state.onItem}
                                            dotaStrings={this.state.dotaStrings} 
                                            abilityStrings={this.state.abilityStrings} />
                                    )
                                })
                            }
                        </div>
                    </Col>
                    <Col md={backpackColWidth}>
                        <h6>{ getLocalizedString(this.state.dotaStrings, "DOTA_HUD_BackpackHintTitle").toUpperCase() }</h6>
                        <div className="d-flex flex-wrap">
                            {
                                this.state.backpack && this.state.backpack.map((value) => {
                                    return (
                                        <Item
                                            key={value.slot}
                                            slot={value.slot}
                                            item={value.item}

                                            isBackpack={true}
                                            onItemChanged={this.state.onItemChanged}
                                            dotaStrings={this.state.dotaStrings}
                                            abilityStrings={this.state.abilityStrings} />
                                    )
                                })
                            }
                        </div>
                    </Col>
                    <Col md={neutralColWidth}>
                        <h6>{ getLocalizedString(this.state.dotaStrings, "UI_NEUTRALS") }</h6>
                        {/* Neutral Item */}
                        <div>
                            <Neutral 
                                neutralItem={this.state.neutral} 
                                onNewNeutralSelected={this.state.onNeutralChanged}
                                dotaStrings={this.state.dotaStrings}
                                abilityStrings={this.state.abilityStrings} />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ItemsBar;