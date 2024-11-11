import SideNav from '../components/SideNav';
import ThreeBox from '../components/ThreeBox';
import './CategoriesPage.css';

function CategoriesPage(){
  return(
    <div className="categories-container">
        <div className="left-container">
          <SideNav />
        </div>
        <div className="divider"></div>
        <div className="right-container">
          <ThreeBox />
        </div>
    </div>
  );
}

export default CategoriesPage;