import React, { useState } from 'react';
import './ThreeBoxes.css';
import { useNavigate } from 'react-router-dom';

function ThreeBoxes() {
  const navigate = useNavigate();
  const [currIndex, setCurrIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mouseOn, setMouseOn] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const nextBox = () => {
    if (disableButton) return;
    setDisableButton(true);
    setCurrIndex((prev) => (prev < 3 ? prev + 1 : 1));
    if (!mouseOn) {
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
    if (disableButton) return;
    setDisableButton(true);
    setCurrIndex((prev) => (prev > 1 ? prev - 1 : 3));
    if (!mouseOn) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 700);
    }
    setTimeout(() => {
      setDisableButton(false);
    }, 500);
  };

  const handleBoxClick = (category: string) => {
    navigate('/voting', { state: { category } });  
  };

  const handleMouseEnter = () => {
    setMouseOn(true);
    setIsAnimating(true);
  };

  const handleMouseLeave = () => {
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
      <div className="box-container">
        <div
          className={`box ${currIndex === 1 ? 'center-box' : currIndex === 2 ? 'left-box' : 'right-box'} ${isAnimating ? 'no-idle' : ''}`}
          onClick={() => handleBoxClick('Games')}
        >
          Games
        </div>
        <div
          className={`box ${currIndex === 2 ? 'center-box' : currIndex === 3 ? 'left-box' : 'right-box'} ${isAnimating ? 'no-idle' : ''}`}
          onClick={() => handleBoxClick('Movies')}
        >
          Movies
        </div>
        <div
          className={`box ${currIndex === 3 ? 'center-box' : currIndex === 1 ? 'left-box' : 'right-box'} ${isAnimating ? 'no-idle' : ''}`}
          onClick={() => handleBoxClick('Music')}
        >
          Music
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
