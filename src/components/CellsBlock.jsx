import React, {useEffect, useRef, useState} from 'react';
import classes from "./CellsBlock.module.scss";
import {useSelector} from "react-redux";
import winCases from "../data/winCases";

const CellsBlock = ({refresh}) => {
    const myRef = useRef(null);

    const vsComputer = useSelector(state=>state.toggle.vsComputer);
    const hardLevel = useSelector(state=>state.toggle.hardLevel);
    const [cellHeight, setCellHeight] = useState(0);
    const [cells, setCells] = useState(createCells());
    const [gameFinished, setGameFinished]= useState(false);
    const [isDraw, setIsDraw] = useState(false);
    const [xTurn, setXTurn] = useState(true);
    const [winCase, setWinCase] = useState([]);


    const handleResize = ()=> {
        setCellHeight(myRef.current.clientWidth/3);
    };

    function createCells(){
        let cellsArr = [];
        const cellsCount = 9;
        for(let i=0; i < cellsCount; i++){
            cellsArr.push("");
        }

        return cellsArr;
    }

    const clearCells = ()=> {
        setXTurn(true);
        setWinCase([]);
        setGameFinished(false);
        setIsDraw(false);
        setCells(createCells());
    }

    const makeMove = (cellId)=> {
        const signToMove = xTurn ? "X" : "0";
        const allowedToMove = !(vsComputer && signToMove === "0");
        if(!cells[cellId] && !gameFinished && allowedToMove){
            setXTurn(prev=>!prev);
            setCells(prev=>prev.map((item,index)=>{
            return index===cellId ? signToMove : item;
            }));

        }
    };

    const computerMove = ()=> {
        const newCells = [...cells];

        if(!hardLevel){
            const emptyIndexes = [];
            let emptyCellIndex = cells.indexOf("");
            while(emptyCellIndex!==-1){
                emptyIndexes.push(emptyCellIndex);
                emptyCellIndex = cells.indexOf("", emptyCellIndex+1);
            }

            const randomIndex = Math.floor(Math.random()*emptyIndexes.length);
            const indexOfMove = emptyIndexes[randomIndex];
            newCells[indexOfMove]="0";
        }
        if(hardLevel) {
            let arrX = [];
            let arr0 = [];
            let playerWincaseIndexes = [];

            for (let item of winCases) {
                let i = 0;
                let n = 0;
                item.forEach((unit, index) => {
                    if (cells[unit] === "X" && cells[item[index + 1]] !== "0" && cells[item[index - 1]] !== "0" && cells[item[0]] !== "0") {
                        i++;
                    }
                    if (cells[unit] === "0" && cells[item[index + 1]] !== "X" && cells[item[index - 1]] !== "X" && cells[item[0]] !== "X") {
                        n++;
                    }
                });
                arrX.push(i);
                arr0.push(n);
            }

            const maxMatchX = arrX.some(item => item === 2) ? 2 : 1;
            const maxMatch0 = arr0.some(item => item === 2) ? 2 : 0;
            const maxMatch = maxMatch0 >= maxMatchX ? maxMatch0 : maxMatchX;
            const arrXor0 = maxMatch0 >= maxMatchX ? arr0 : arrX;
            let winIndex = arrXor0.indexOf(maxMatch);

            while (winIndex !== -1) {
                playerWincaseIndexes.push(winIndex);
                winIndex = arrXor0.indexOf(maxMatch, winIndex + 1);
            }

            const indexOfMove = Math.floor(Math.random() * playerWincaseIndexes.length);
            const computerIndexOfMove = playerWincaseIndexes[indexOfMove];
            let i = 0;

            for (let item of newCells) {
                if (winCases[computerIndexOfMove].some(unit => unit === i) && item === "") {
                    newCells[i] = "0";
                    break;
                }
                i++;
            }
        }

        setXTurn(true);
        setCells(newCells);
    }


    const cellsBlock = cells.map((item, index)=>{
        let currentStyle=classes.cells__standartCell
        if (winCase.includes(index)){
            currentStyle=classes.cells__winCell;
        }
        if(isDraw){
            currentStyle = classes.cells__drawCell
        }
        return <div key={index}
                    className={`${classes.cells__cell} ${currentStyle}`}
                    style={{height: cellHeight}}
                    onClick={()=>makeMove(index)}
                >
                <span>{item}</span>
            </div>
    });


    useEffect(()=>{
        if(!gameFinished) {
            let stopMove=false;
            for (let item of winCases) {
                if (item.every(index => (cells[index] === cells[item[0]] && cells[index] !== ""))) {
                    // console.log("Win Case of " + cells[item[0]] + "!");
                    stopMove=true;
                    setWinCase(item);
                    setGameFinished(true);
                    break;
                }
            }
            if(!cells.includes("") && winCase.length===0){
                // console.log("Its a draw!");
                setIsDraw(true);
                return setGameFinished(true);
            }
            if (!xTurn && vsComputer && !stopMove) {
                setTimeout(() => {
                    computerMove()
                }, 1000)
            }
        }
    }, [cells]);

    useEffect(()=>{
        clearCells();
    }, [refresh]);

    useEffect(()=>{
        handleResize();
        window.addEventListener('resize', handleResize);

        return ()=> window.removeEventListener("resize",handleResize);
    }, [])





    return (
        <div className={classes.cells} ref={myRef}>
            {cellsBlock}
        </div>
    );
};

export default CellsBlock;