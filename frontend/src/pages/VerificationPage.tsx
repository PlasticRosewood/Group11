import paper from '../../assets/paper.png';

function VerificationPage() {
    return ( // setting the background image as the background page 
        // NOTE: Image quality needs to be fixed 
        <> 
            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                html, body, #root {
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                }
            `}</style>

            <div
                style={{
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
                Hellooooooooooooooooooooooooooooooooooooo
            </div>
        </>
    );
}

export default VerificationPage;
