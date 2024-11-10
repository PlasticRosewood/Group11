import React, { useState } from 'react';
import './ThreeBoxes.css';

function ThreeBoxes() {

    const[currIndex, setCurrIndex] = useState(1);

    const nextBox = () => { //determining which box is currently centered
        setCurrIndex((prev) => (prev < 3 ? prev + 1 : 1)); //checks all three until wrap around from 3 to 1
    };
    const prevBox = () => {
        setCurrIndex((prev) => (prev > 1 ? prev - 1 : 3));
    };

    return (
        <div className="three-boxes-container">
            <button className="scroll-button left-scroll" onClick={prevBox}>
                Back
            </button>
            <div className="box-container">
                <div className={`box ${currIndex === 1 ? 'center-box' : currIndex === 2 ? 'right-box' : 'left-box'}`}>
                    Box 1
                </div>
                <div className={`box ${currIndex === 2 ? 'center-box' : currIndex === 3 ? 'right-box' : 'left-box'}`}>
                    Box 2
                </div>
                <div className={`box ${currIndex === 3 ? 'center-box' : currIndex === 1 ? 'right-box' : 'left-box'}`}>
                    Box 3
                </div>
            </div>
            <button className="scroll-button right-scroll" onClick={nextBox}>
                Next
            </button>
        </div>
    );
}

export default ThreeBoxes;