import { useState } from 'react';
import './LoginPage.css';
import Title from '../components/Title.tsx';

function LoginPage() {
  // hooks into login data
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // hook into style data
  const [signUpVisible, setSignUpVisible] = useState(true);
  const [logInVisible, setLogInVisible] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [showOptions, setShowOptions] = useState(true);

  function showSignUp(): void {
    setSignUpVisible(true);
    setLogInVisible(false);
    setPageTitle('Register');
    setShowOptions(false);
  }

  function showLogIn(): void {
    setSignUpVisible(false);
    setLogInVisible(true);
    setPageTitle('Login');
    setShowOptions(false);
  }

  // signup function
  async function signUp(e : any) : Promise<void>
  {
    e.preventDefault();

    // check if email is valid
    if (!validateEmail(email)) {
      alert('Invalid email format');
      return;
    }

    // package and send data to api/login
    let obj = {username:userName, email:email, password:password};
    let js = JSON.stringify(obj);

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        body: js,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let res = JSON.parse(await response.text());

      if (response.status !== 201) {
        throw new Error(res.message);
      }

      alert("Successfully Signed Up!");
      window.location.href = '/profile';

    } catch (error : any) {
      //todo: improve error handling
      alert(error.toString());
      return;
    }
  }

  // login function
  async function logIn(e : any) : Promise<void>
  {
    e.preventDefault(); 
    
     // package and send data to api/login
     let obj = {username:userName, password:password};
     let js = JSON.stringify(obj);
 
     try {
       const response = await fetch('http://localhost:5000/api/login', {
         method: 'POST',
         body: js,
         headers: {
           'Content-Type': 'application/json'
         }
       });
       let res = JSON.parse(await response.text());

       if (response.status !== 200) {
        throw new Error(res.message);
       }

       alert("Successfully logged in!");
       window.location.href = '/profile';
       
     } catch (error : any) {
       //todo: improve error handling
       alert(error.toString());
       return;
     }
  }

  // check if email follows valid email format (using regex)
  function validateEmail(email : string) : boolean
  {
    return /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }

  function back() {
    setShowOptions(true);
    setSignUpVisible(false);
    setLogInVisible(false);
    setPageTitle('');
  }

  return (
    <div className="outer-container">
      <div className="background">
        <div className="left-panel">
          {/* Wrapper directly inside left panel */}
          <div className="wrapper">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={index} className={`item item${index + 1}`}></div>
            ))}
          </div>
          <div className="wrapper">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={index} className={`item item${index + 1}`}></div>
            ))}
          </div>
        </div>
                <div className="right-panel">
          <div className="title-container">
            <Title className="titre" />
          </div>
          <div className="form-container">
            <div id="buttonContainer">
              <button id="openNewUser" className="button" onClick={showSignUp}>New User</button>
              <span className="line-break"></span>
              <button id="openExistingUser" className="button" onClick={showLogIn}>Existing User</button>
            </div>

            <div id="newUserForm" className={signUpVisible ? 'show' : ''}>
              <input type="text" id="newUserName" placeholder="Username" onChange={e => setUserName(e.target.value)} />
              <input type="email" id="newUserEmail" placeholder="Email" onChange={e => setEmail(e.target.value)} />
              <input type="password" id="newUserPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} />
              <button id="signUp" className="signup-btn" onClick={signUp}>Sign Up</button>
            </div>

            <div id="existingUserForm" className={logInVisible ? 'show' : ''}>
              <input type="text" id="existingUserName" placeholder="Username / Email" onChange={e => {
                setUserName(e.target.value);
                setEmail(e.target.value);
              }} />
              <input type="password" id="existingUserPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} />
              <button id="logIn" className="login-btn" onClick={logIn}>Log In</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
