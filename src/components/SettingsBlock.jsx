import React from 'react';
import classes from "./SettingsBlock.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {changeLevel, changePlayer} from "../redux/toggleSlice";

const SettingsBlock = () => {
    const dispatch = useDispatch();
    const vsComputer = useSelector(state=>state.toggle.vsComputer);
    const hardLevel = useSelector(state=>state.toggle.hardLevel);

    const toggleCheckbox = (e)=> {
        const action = e.target.name === "vsComputer" ? changePlayer: changeLevel;

        return dispatch(action());
    };


    return (
        <div className={classes.settings}>
            <div className={classes.settings__toggler}>
                <label>
                    <input
                        name="vsComputer"
                        type="checkbox"
                        checked={vsComputer}
                        onChange={toggleCheckbox}
                    />
                    <span> </span>
                </label>
            <span>vs Computer</span>
            </div>

            <div className={classes.settings__toggler} style={{opacity: vsComputer ? 1 : 0}}>
                <label>
                    <input
                        name="hardLevel"
                        type="checkbox"
                        checked={hardLevel}
                        onChange={toggleCheckbox}
                        disabled={!vsComputer}
                    />
                    <span className={classes.settings__slider}> </span>
                </label>
                <span>Hard</span>
            </div>


        </div>
    );
};

export default SettingsBlock;