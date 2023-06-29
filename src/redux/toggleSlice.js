import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    vsComputer: true,
    hardLevel: true
};

const toggleSlice = createSlice({
    name: "toggle",
    initialState,
    reducers: {
        changePlayer: {
            reducer(state){
                state.vsComputer=!state.vsComputer;
            }
        },
        changeLevel: {
            reducer(state){
                state.hardLevel=!state.hardLevel;
            }
        }
    }
});

export const {changePlayer, changeLevel} = toggleSlice.actions;
export default toggleSlice.reducer;