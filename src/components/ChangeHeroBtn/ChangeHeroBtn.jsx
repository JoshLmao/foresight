import React, { Component } from 'react';
import {
    Button
} from "react-bootstrap";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import HeroSelector from "./HeroSelector";

class ChangeHeroBtn extends Component {
    constructor(props){
        super(props);

        this.state = {
            onSelectHero: props.onSelectHero,
            dotaStrings: props.dotaStrings,
        };

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

    onSelectHero (e) {
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
                    closeOnDocumentClick
                    closeOnEscape
                    className="hero-selector"
                    contentStyle={{ 
                        width: "750px", 
                        padding: 0, 
                        border: 0
                    }}>
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