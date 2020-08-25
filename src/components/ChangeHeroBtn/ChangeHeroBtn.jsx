import React, { Component } from 'react';
import {
    Button
} from "react-bootstrap";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import HeroSelector from "./HeroSelector";

import "./ChangeHeroBtn.css";

class ChangeHeroBtn extends Component {
    constructor(props){
        super(props);

        this.state = {
            open: false,

            onSelectHero: props.onSelectHero,
            dotaStrings: props.dotaStrings,
        };

        this.onToggleHeroSelect = this.onToggleHeroSelect.bind(this);
        this.onSelectHero = this.onSelectHero.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                dotaStrings: this.props.dotaStrings,
                onSelectHero: this.props.onSelectHero,
            });
        }
    }

    onToggleHeroSelect(e) {
        this.setState({
            open: !this.state.open,
        });
    }

    onSelectHero (e) {
        this.setState({
            open: !this.state.open,
        });
        
        let hero = e.target.dataset.hero;
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
                        onSelectedHero={this.onSelectHero} 
                        dotaStrings={this.state.dotaStrings}
                         />
                </Popup>
            </div>
        );
    }
}

export default ChangeHeroBtn;