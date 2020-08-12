import React, { Component } from 'react';
import {
    Button
} from "react-bootstrap";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import HeroSelector from "./HeroSelector";

import { DOTAHeroes } from "../../data/dota2/json/npc_heroes.json";

import "./ChangeHeroBtn.css";

class ChangeHeroBtn extends Component {
    constructor(props){
        super(props);

        // Filter and remove any unwanted heroes
        var selectableHeroes = Object.keys(DOTAHeroes).filter((value) => {
            var key = value.toLowerCase();
            if (key !== "version" && key !== "npc_dota_hero_base" && key !== "npc_dota_hero_target_dummy") {
                return true;
            }
            return false;
        })
        // Map only necessary data
        selectableHeroes = selectableHeroes.map((key) => {
            if (DOTAHeroes[key].workshop_guide_name) {
                return {
                    displayName: DOTAHeroes[key].workshop_guide_name,
                    name: key,
                    alias: DOTAHeroes[key].NameAliases ? DOTAHeroes[key].NameAliases.split(',') : null,
                };
            }
        });
        // sort by name property
        selectableHeroes.sort((a, b) => (a.name > b.name) ? 1 : -1)

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
        this.setState({
            open: !this.state.open,
        });
        
        var hero = e.target.dataset.hero;
        this.state.onSelectHero(hero);
    }

    render() {
        return (
            <div>
                <Popup 
                    trigger={isOpen => (
                        <Button onClick={this.onToggleHeroSelect}><FontAwesomeIcon icon={faPencilAlt} /></Button>
                    )} 
                    position="right top"
                    contentStyle={{ width: "750px" }}>
                     <HeroSelector 
                        heroes={this.state.heroes} 
                        onSelectedHero={this.onSelectHero} 
                         />
                </Popup>
            </div>
        );
    }
}

export default ChangeHeroBtn;