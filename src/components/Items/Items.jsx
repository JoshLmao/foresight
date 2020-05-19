import React, { Component } from 'react';
import {
    Row, 
    Col
} from "react-bootstrap";

class Items extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: props.items,
            backpack: props.backpack,
            neutral: props.neutral,
        };

        this.getItemIcon = this.getItemIcon.bind(this);
    }

    getItemIcon(item, width, height, scale) {
        // Width and height of each item in item_stylesheet
        if (item.item === "none") {
            return <span style={{ backgroundColor: "#212121", width: width, height: height, transform: `scale(${scale}, ${scale})`, display: "block" }} />
        } else {
            return <span className={ 'sprite sprite-' + item.item + '_png '} alt={item.item} style={{ transform: `scale(${scale}, ${scale})` }} />
        }
    }

    render() {
        var itemsColWidth = 6;
        var backpackColWidth = 6;
        return (
            <div>
                <Row>
                    <Col md={itemsColWidth}>
                        <h6>ITEMS</h6>
                    </Col>
                    <Col md={backpackColWidth}>
                        <h6>BACKPACK</h6>
                    </Col>
                </Row>
                <Row>
                    <Col md={itemsColWidth} className="d-flex">
                        {
                            this.state.items && this.state.items.map((value) => {
                                var scale = 0.7;
                                var width = "88px";
                                var height = "64px";
                                return (
                                <div
                                    key={value.slot}
                                    className="mx-1" 
                                    style={{ width: `calc(88px * ${scale})`, height: `calc(64px * ${scale})` }}>
                                    { this.getItemIcon(value, width, height, 0.7) }
                                </div>)
                            })
                        }
                    </Col>
                    <Col md={backpackColWidth} className="d-flex">
                            {
                                this.state.backpack && this.state.backpack.map((value) => {
                                    var scale = 0.7;
                                    var width = "88px";
                                    var height = "64px";
                                    return (
                                        <div 
                                            key={value.slot}
                                            className="mx-1" 
                                            style={{ width: `calc(88px * ${scale})`, height: `calc(64px * ${scale})` }}>
                                            { this.getItemIcon(value, width, height, scale) }
                                        </div>
                                    )
                                })
                            }
                            {/* Neutral Item */}
                            <div className="ml-3" style={{ width: `calc(88px * ${0.7})`, height: `calc(64px * ${0.7})`}}>
                                { this.getItemIcon(this.state.neutral, "88px", "64px", 0.7) }
                            </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Items;