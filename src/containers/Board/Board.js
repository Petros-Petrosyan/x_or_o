import React, { useState, useEffect } from 'react';
import update from 'react-addons-update';

// components
import { ViewBoard } from '../../components';

// constants
const winnerLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];


const Board = () => {
    const [cubes, setCubes] = useState([Array(9).fill(null)]);
    const [isPlayerX, setIsPlayerX] = useState(true);
    const [winnerPlayer, setWinnerPlayer] = useState(null);
    const [winnerPosition, setWinnerPosition] = useState(null);
    const [playerCount, setPlayerCount] = useState(null);

    useEffect(() => {
        const {winnerPlayer, winnerPosition} = calculateWinner(cubes[cubes.length-1]);
        setWinnerPosition(winnerPosition);
        setWinnerPlayer(winnerPlayer);
    }, [cubes]);

    const startGame = (playerCount) => {
        setPlayerCount(playerCount);
    }

    const changeCubeValue = (cubeIndex) => {
        const lastCubes = cubes[cubes.length-1];
        if (!winnerPlayer && lastCubes[cubeIndex] === null) {
            const copiedLastCubes = update(lastCubes, {
                [cubeIndex]: {$set: isPlayerX ? 'X' : 'O'}
            });
            const newCubes = update(cubes, {$splice: [[cubes.length, 0, copiedLastCubes]]})

            const LastLocalCube = [...lastCubes];
            LastLocalCube[cubeIndex] = 'X';
            const {winnerPlayer: _localWinnerPlayer} = calculateWinner(LastLocalCube);

            if (playerCount === 1 && !_localWinnerPlayer) {
                const nextStepIndex = generateNextStepIndex(cubeIndex, cubes);
                copiedLastCubes[nextStepIndex] = !isPlayerX ? 'X' : 'O';
            } else {
                setIsPlayerX(!isPlayerX);
            }
            setCubes(newCubes);
        }
    }

    const startNew = () => {
        setCubes([Array(9).fill(null)]);
        setIsPlayerX(true);
        setWinnerPlayer(null);
        setWinnerPosition(null);
        setPlayerCount(null);
    }

    const goBackStep = () => {
        if (cubes.length > 1) {
            const newCubes = update(cubes, {$splice: [[cubes.length-1, 1]]})
            setCubes(newCubes);
            if (playerCount !== 1) {
                setIsPlayerX(!isPlayerX);
            }
        }
    }

    return (
        <ViewBoard
            lastCubes={cubes[cubes.length-1]}
            winnerPosition={winnerPosition}
            isPlayerX={isPlayerX}
            isOneStep={cubes.length > 1}
            winnerPlayer={winnerPlayer}
            playerCount={playerCount}
            startGameHandler={startGame}
            changeCubeValueHandler={changeCubeValue}
            startNewHandler={startNew}
            goBackStepHandler={goBackStep}
        />
    )
}


function calculateWinner(cubes) {
    for (let i = 0; i < winnerLines.length; i++) {
        const [a, b, c] = winnerLines[i];
        if (cubes[a] && cubes[a] === cubes[b] && cubes[a] === cubes[c]) {
            return {
                winnerPlayer: cubes[a],
                winnerPosition: [a,b,c]
            };
        }
    }
    if (!cubes.includes(null)) {
        return {
            winnerPlayer: 'The game ended in a draw',
            winnerPosition: null
        };
    }
    return {
        winnerPlayer: null,
        winnerPosition: null
    };
}

const generateLogicalStep = (lastCubes, cubeIndex, player) => {
    let logicalStep = false;
    for (let i = 0; i < winnerLines.length; i++) {
        const [a, b, c] = winnerLines[i];
        const aIsNull = (lastCubes[b] && lastCubes[c]) && (lastCubes[b] === lastCubes[c] && lastCubes[c] === player) && (lastCubes[a] === null) && (cubeIndex !== a);
        const bIsNull = (lastCubes[a] && lastCubes[c]) && (lastCubes[a] === lastCubes[c] && lastCubes[c] === player) && (lastCubes[b] === null) && (cubeIndex !== b);
        const cIsNull = (lastCubes[a] && lastCubes[b]) && (lastCubes[a] === lastCubes[b] && lastCubes[b] === player) && (lastCubes[c] === null) && (cubeIndex !== c);

        if (aIsNull) {
            logicalStep = a;
        } else if (bIsNull) {
            logicalStep = b;
        } else if (cIsNull) {
            logicalStep = c;
        }
    }
    return logicalStep;
}

const generateNextStepIndex = (cubeIndex, cubes) => {
    let lastCubes = [...cubes[cubes.length-1]];
    lastCubes[cubeIndex] = 'X';
    let randomStepIndex = null;
    const freeCubes = lastCubes.filter((el) => el === null);

    if (freeCubes.length > 1) {
        while (true) {
            randomStepIndex = Math.floor(Math.random() * 9);
            if (lastCubes[randomStepIndex] === null && cubeIndex !== randomStepIndex) {
                break;
            }
        }

        const withOLogicalStepIndex = generateLogicalStep(lastCubes, cubeIndex, 'O');
        const withXLogicalStepIndex = generateLogicalStep(lastCubes, cubeIndex, 'X');

        if (withOLogicalStepIndex || withOLogicalStepIndex === 0) {
            return withOLogicalStepIndex;
        } else if (withXLogicalStepIndex || withXLogicalStepIndex === 0) {
            return withXLogicalStepIndex;
        } else {
            return randomStepIndex
        }
    }
}

export { Board };