import React, { useState } from 'react';
import './ThreeBoxes.css';

function ThreeBoxes() {
  const [currIndex, setCurrIndex] = useState(1); // checking for center box
  const [isAnimating, setIsAnimating] = useState(false); // must check if in middle of animation b/c messes up sliding animation from box to box
  const [mouseOn, setMouseOn] = useState(false); // checking if mouse on button, purpose of it is for animation purposes
  const [disableButton, setDisableButton] = useState(false); // looks weird if you can spam the next and back buttons so set to half a second 


  const nextBox = () => { //determining which box is currently centered
    if(disableButton) return;
    setDisableButton(true);
    setCurrIndex((prev) => (prev < 3 ? prev + 1 : 1)); //checks all three until wrap around from 3 to 1

    if(!mouseOn) { // checking for idling animation purposes
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
        }, 700); 
      }
        setTimeout(() => {
            setDisableButton(false);
        }, 500);
    };
  const prevBox = () => {
    if(disableButton) return;
    setDisableButton(true);
    setCurrIndex((prev) => (prev > 1 ? prev - 1 : 3)); 
    if(!mouseOn) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
        }, 700); 
      }
        setTimeout(() => {
            setDisableButton(false);
        }, 500);
  };


  const handleMouseEnter = () => { //handling moouse placement on buttons
    setMouseOn(true);
    setIsAnimating(true);
  };
  
  const handleMouseLeave = () => { // have to put timeout otherwise leads to more idle situations
    setMouseOn(false);
    setTimeout(() => {
      setIsAnimating(false);
    }, 100); 
  };

  return (
    <div className="three-boxes-container"> 
      <button
        className="scroll-button left-scroll"
        onClick={prevBox}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Back
      </button>
      <div className="box-container"> {/* super cool but using ternary op to determine which css to apply to each box */}
        <div className={`box ${currIndex === 1 ? 'center-box' : currIndex === 2 ? 'left-box' : 'right-box'} ${isAnimating ? 'no-idle' : ''}`}>
          Box 1 {/* changed from box component to this for now*/}
        </div>
        <div className={`box ${currIndex === 2 ? 'center-box' : currIndex === 3 ? 'left-box' : 'right-box'} ${isAnimating ? 'no-idle' : ''}`}>
          Box 2
        </div>
        <div className={`box ${currIndex === 3 ? 'center-box' : currIndex === 1 ? 'left-box' : 'right-box'} ${isAnimating ? 'no-idle' : ''}`}>
          Box 3
        </div>
      </div>
      <button
        className="scroll-button right-scroll"
        onClick={nextBox}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Next
      </button>
    </div>
  );
}

export default ThreeBoxes;