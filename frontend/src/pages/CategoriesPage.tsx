import SideNav from '../components/SideNav';
import ThreeBox from '../components/ThreeBox';
import './CategoriesPage.css';
import React, { useState } from 'react';

function CategoriesPage() {
  const [togExpand, isTogExpand] = useState(false);

  return (
    <div className="categories-container">
      <div className={`left-container ${togExpand ? 'expanded' : 'collapsed'}`}>
        <SideNav onToggle={isTogExpand} disableToggle={true} /> {/* using awesome props */}
      </div>
      <div className="divider"></div>
      <div className={`right-container ${togExpand ? 'expanded' : 'collapsed'}`}>
        <div className="tile-container">
          {Array.from({ length: 200 }).map((_, index) => (
            <div className="tile" key={index}></div>
          ))}
        </div>
        <ThreeBox />
      </div>
    </div>
  );
}

export default CategoriesPage;
