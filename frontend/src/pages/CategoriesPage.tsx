import SideNav from '../components/SideNav';
import ThreeBox from '../components/ThreeBox';
import './CategoriesPage.css';
import React, { useState } from 'react';

function CategoriesPage(){

  const[togExpand, isTogExpand] = useState(false);

  return(
    <div className="categories-container">
        <div className={`left-container ${togExpand ? 'expanded' : 'collapsed'}`}>
          <SideNav onToggle={isTogExpand}/> {/* using awesome props */}
        </div>
        <div className="divider"></div>
        <div className={`right-container ${togExpand ? 'expanded' : 'collapsed'}`}>
          <ThreeBox />
        </div>
    </div>
  );
}

export default CategoriesPage;