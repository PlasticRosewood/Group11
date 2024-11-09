import paper from '../assets/Paper.svg'; //Note: will create mail opening bg if time allows
import './Verification.css';  

function VerificationPage() {
    return (
        <> 
            <div
                style={{ //setting background to image
                    backgroundImage: `url(${paper})`,
                    backgroundSize: 'cover',              
                    backgroundPosition: 'center',         
                    backgroundRepeat: 'no-repeat',        
                    position: 'fixed',                   
                    top: 0,
                    left: 0,
                    width: '100vw',                   
                    height: '100vh',                   
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div className="verification-box"> 
                    Email Verified
                </div>
            </div>
        </>
    );
}

export default VerificationPage;
