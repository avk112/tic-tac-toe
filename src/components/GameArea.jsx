import React, {useState} from 'react';
import classes from "./GameArea.module.scss";
import CellsBlock from "./CellsBlock";
import SettingsBlock from "./SettingsBlock";

const GameArea = () => {
    const [refresh, setRefresh]= useState(Date.now());


    const refreshGame = ()=> {
        setRefresh(Date.now());
    };



    return (
        <div className={classes.gameArea}>
            <SettingsBlock/>
            <CellsBlock
               refresh={refresh}
            />
            <button onClick={refreshGame}>
                New Game
            </button>
        </div>
    );
};

export default GameArea;