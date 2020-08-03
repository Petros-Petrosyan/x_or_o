import React from 'react';

// classes
import classes from './Cubes.module.scss';


const Cubes = (props) => {
    const {
        value,
        cubeIndex,
        winnerPosition,
        changeCubeValueHandler,
    } = props;

    const classNames = [classes.cub];
    if (value === 'X') {
        classNames.push(classes.green)
    } else {
        classNames.push(classes.red)
    }

    if (winnerPosition && winnerPosition.includes(cubeIndex)) {
        classNames.push(classes.winnerBg)
    }

    return (
        <div
            className={classNames.join(' ')}
            onClick={() => changeCubeValueHandler(cubeIndex)}
        >
            {value}
        </div>
    )
}

export { Cubes }