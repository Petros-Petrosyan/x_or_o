import React from 'react';

// classes
import classes from './ViewBoard.module.scss';

// components
import { Cubes } from '../';


const ViewBoard = (props) => {
    const {
        lastCubes,
        winnerPosition,
        isPlayerX,
        isOneStep,
        winnerPlayer,
        playerCount,
        changeCubeValueHandler,
        startNewHandler,
        goBackStepHandler,
        startGameHandler
    } = props;

    const printCubes = lastCubes.map((cube, i) => {
        return <Cubes
            key={i}
            value={cube}
            winnerPosition={winnerPosition}
            cubeIndex={i}
            changeCubeValueHandler={changeCubeValueHandler}
        />
    });

    let currentPlayer;
    let startBtn = null;
    let previousStepBtn = null;
    if(winnerPlayer) {
        let currentPlayerText = winnerPlayer.length > 1 ? winnerPlayer : `Winner Player: ${winnerPlayer}`;
        currentPlayer = <h2>{currentPlayerText}</h2>
        startBtn = (
            <div className={classes.main__button}>
                <button onClick={startNewHandler}>Start new</button>
            </div>
        );
    } else {
        currentPlayer = <h2>Player {isPlayerX ? 'X' : 'O'}</h2>
        if (isOneStep) {
            previousStepBtn = (
                <div className={classes.main__button}>
                    <button onClick={goBackStepHandler}>Back to the previous step</button>
                </div>
            )
        }
    }

    let content = (
        <main className={classes.main}>
            <header><h1>Tic Tac Toe</h1></header>
            <section className={classes.main__start}>
                <div onClick={() => startGameHandler(2)} className={classes.main__start__section}>PLAY WITH FRIENDS</div>
                <div onClick={() => startGameHandler(1)} className={classes.main__start__section}>PLAY WITH COMPUTER</div>
            </section>
        </main>
    )

    if (playerCount) {
        content = (
            <main className={classes.main}>
                <header>
                    <h1>Tic Tac Toe</h1>
                    {currentPlayer}
                </header>
                <section className={classes.main__container}>
                    {printCubes}
                </section>
                <footer>
                    {startBtn}
                    {previousStepBtn}
                </footer>
            </main>
        )
    }

    return content
}

export { ViewBoard }