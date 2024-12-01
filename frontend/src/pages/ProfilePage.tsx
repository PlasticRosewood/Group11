import SideNav from '../components/SideNav';
import './CategoriesPage.css';
import React, { useState } from 'react';

function ProfilePage(){

  const[togExpand, isTogExpand] = useState(false);

  return(
    <div className="categories-container">
        <div className={`left-container ${togExpand ? 'expanded' : 'collapsed'}`}>
          <SideNav onToggle={isTogExpand}/> {/* using awesome props */}
        </div>
    </div>
  );
}

export default ProfilePage;