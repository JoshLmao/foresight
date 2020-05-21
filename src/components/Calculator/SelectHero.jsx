import React, { Component } from 'react';
import {
    Button
} from "react-bootstrap";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import { DOTAHeroes } from "../../data/dota2/json/npc_heroes.json";

class SelectHero extends Component {
    constructor(props){
        super(props);

        // Remove any unwanted heroes from "npc_heroes"
        var selectableHeroes = Object.keys(DOTAHeroes).filter((value) => {
            if (value === "Version" || value === "npc_dota_hero_base") {
                return false;
            } else {
                return true;
            }
        });

        this.state = {
            open: false,
            heroes: selectableHeroes,

            onSelectHero: props.onSelectHero,
        };
        this.onToggleHeroSelect = this.onToggleHeroSelect.bind(this);
        this.onSelectHero = this.onSelectHero.bind(this);
    }

    onToggleHeroSelect(e) {
        this.setState({
            open: !this.state.open,
        });
    }

    onSelectHero (e) {
        //e.persist();
        //console.log(e);
        var hero = e.target.dataset.hero;
        this.state.onSelectHero(hero);
    }

    render() {
        return (
            <div>
                <Popup 
                    trigger={<Button onClick={this.onToggleHeroSelect}><FontAwesomeIcon icon={faPencilAlt} /></Button>} 
                    position="bottom center"
                    contentStyle={{ overflowY: "auto", overflowX: "hidden", height: "450px" }}>
                    <div>
                        {
                            this.state.heroes && this.state.heroes.map((value) => {
                                return <Button className="p-0" variant="outline-secondary" key={value} data-hero={value} onClick={this.onSelectHero}>{value}</Button>
                            })
                        }
                    </div>
                    
                </Popup>
            </div>
        );
    }
}

export default SelectHero;