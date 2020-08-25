import React, { Component } from 'react';
import {
    Row, 
    Col
} from "react-bootstrap";

import Item from "./Item";
import Neutral from "../Neutral";

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
                        <h6>ITEMS</h6>
                        <div className="d-flex flex-wrap">
                            {
                                this.state.items && this.state.items.map((value) => {
                                    return (
                                        <Item 
                                            key={value.slot}
                                            slot={value.slot}
                                            item={value.item} 
                                            onItemChanged={this.state.onItemChanged}
                                            dotaStrings={this.state.dotaStrings} 
                                            abilityStrings={this.state.abilityStrings} />
                                    )
                                })
                            }
                        </div>
                    </Col>
                    <Col md={backpackColWidth}>
                        <h6>BACKPACK</h6>
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
                        <h6>NEUTRAL</h6>
                        {/* Neutral Item */}
                        <div>
                            <Neutral 
                                neutralItem={this.state.neutral} 
                                onNewNeutralSelected={this.state.onNeutralChanged}
                                abilityStrings={this.state.abilityStrings} />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ItemsBar;