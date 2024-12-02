import './Title.css';
import { Link } from 'react-router-dom';

type TitleProps = {
    className?: string;
};

function Title({ className }: TitleProps) {
    return(
    <div className={`rotate ${className}`}>
        <Link to="/">
            <h2 className="stacked-text">
            Peak<br />
            or<br />
            Boo
            </h2>
        </Link>
    </div>
    );
}

export default Title;