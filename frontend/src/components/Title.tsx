import './Title.css';


type TitleProps = {
    className?: string;
};

function Title({ className }: TitleProps) {
    return(
    <div className={`rotate ${className}`}>
        <h2 className="stacked-text">
          Peek<br />
          or<br />
          Boo
    </h2>
    </div>
    );
}

export default Title;