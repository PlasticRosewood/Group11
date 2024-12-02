import { useState } from 'react';
import './LoginPage.css';
import Title from '../components/Title.tsx';

function LoginPage() {
  // hooks into login data
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // hook into style data
  const [signUpVisible, setSignUpVisible] = useState(false);
  const [logInVisible, setLogInVisible] = useState(false);
  const[pageTitle, setPageTitle] = useState('');
  const[showOptions, setShowOptions] = useState(true);

  function showSignUp() : void
  {
    setSignUpVisible(true);
    setLogInVisible(false);
    setPageTitle('Register');
    setShowOptions(false);
  }

  function showLogIn() : void
  {
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
    if (!validateEmail(email))
    {
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

    } catch (error : any) {
      //todo: improve error handling
      alert(error.toString());
      return;
    }


    alert('sign up for ' + userName + ' with email ' + email + ' and password ' + password);
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
  
     } catch (error : any) {
       //todo: improve error handling
       alert(error.toString());
       return;
     }

    alert('login for ' + userName + ' with password ' + password);
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
    <>
    <div className="background">
      <div className="roations">
        <Title className="titre" />
      </div>
    <div id="loginSignupBox">
      <div className="header">

        {!showOptions && <button id="back" onClick={back}>Back</button>}
        {pageTitle && <h2 id="authTitle">{pageTitle}</h2>}
      </div>

      {showOptions ? (

        <div id="buttonContainer">
          <button id="openNewUser" onClick={showSignUp}>New User</button>
          <button id="openExistingUser" onClick={showLogIn}>Existing User</button>
        </ div>
      ) : (
        <div></div>
      )}

      <div id="newUserForm" style={{ display: signUpVisible ? 'grid' : 'none' }}>
        <input type="text" id="newUserName" placeholder="Username" onChange={e => setUserName(e.target.value)} />
        <input type="email" id="newUserEmail" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" id="newUserPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button id="signUp" onClick={signUp}>Sign Up</button>
      </div>

      <div id="existingUserForm" style={{ display: logInVisible ? 'grid' : 'none' }}>
        <input type="text" id="existingUserName" placeholder="Username / Email" onChange={e => {
          setUserName(e.target.value);
          setEmail(e.target.value);
        }} />
        <input type="password" id="existingUserPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button id="logIn" onClick={logIn}>Log In</button>
      </div>      
    </div>
  </div>
    </>
  )
}

export default LoginPage;