import React, { Component } from 'react';
import {
    Button,
    Form
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

import { itemNameToElement } from "../../utils";
import {
    getAllNeutrals
} from "../../utility/dataHelperItems";

import "./NeutralItemSelector.css";

class NeutralItemSelector extends Component {
    constructor(props) {
        super(props);

        let allNeutrals = getAllNeutrals();
        this.state = {
            allNeutrals: allNeutrals,
            queryNeutrals: allNeutrals,

            iconScale: 0.5,
            onNewNeutralSelected: props.onNeutralSelected,
        };

        this.onNeutralSelected = this.onNeutralSelected.bind(this);
        this.onSearchChanged = this.onSearchChanged.bind(this);
    }

    onNeutralSelected(e) {
        var neutral = e.target.parentElement.parentElement.dataset.neutral;
        this.state.onNewNeutralSelected({ item: neutral });
    }

    onSearchChanged (e) {
        let query = e.target.value;
        let filteredNeutrals = null;
        if (query) {
            filteredNeutrals = this.state.allNeutrals.filter((neutral) => {
                return neutral.item.indexOf(query.toLowerCase()) !== -1; 
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
                <div className="neutral-item-card header d-flex">
                    <div>
                        <Form.Control type="text" placeholder="Search..." onChange={this.onSearchChanged}/>
                    </div>
                    <Button className="ml-auto" variant="outline-danger" onClick={this.onNeutralSelected} data-neutral={null}>
                        <FontAwesomeIcon icon={faMinus} data-neutral={null} />
                    </Button>
                </div>
                <div className="neutral-item-card content">
                    <div className="d-flex flex-wrap">
                        {
                            this.state.queryNeutrals && this.state.queryNeutrals.map((itemInfo) => {
                                return ( 
                                    <div 
                                        className="m-1" 
                                        key={itemInfo.item} 
                                        onClick={this.onNeutralSelected} 
                                        title={itemInfo.item}
                                        data-neutral={itemInfo.item}>
                                        { itemNameToElement(itemInfo, this.state.iconScale) }
                                    </div>
                                )
                            })
                        }
                        {
                            !this.state.queryNeutrals && this.state.allNeutrals.map((itemInfo) => {
                                return ( 
                                    <div 
                                        className="m-1" 
                                        key={itemInfo.item} 
                                        onClick={this.onNeutralSelected} 
                                        title={itemInfo.item}
                                        data-neutral={itemInfo.item}>
                                        { itemNameToElement(itemInfo, this.state.iconScale) }
                                    </div>
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