import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  // hooks into login data
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // hook into style data
  const [signUpVisible, setSignUpVisible] = useState(false);
  const [logInVisible, setLogInVisible] = useState(false);

  function showSignUp() : void
  {
    setSignUpVisible(true);
    setLogInVisible(false);
  }

  function showLogIn() : void
  {
    setSignUpVisible(false);
    setLogInVisible(true);
  }

  // signup function
  function signUp(e : any) : void
  {
    e.preventDefault();

    // check if email is valid
    if (!validateEmail(email))
    {
      alert('Invalid email format');
      return;
    }

    // TODO: make proper api calls here
    alert('sign up for ' + userName + ' with email ' + email + ' and password ' + password);
  }

  // login function
  function logIn(e : any) : void
  {
    e.preventDefault();
    // TODO: make proper api calls here
    alert('login for ' + userName + ' with password ' + password);
  }

  // check if email follows valid email format (using regex)
  function validateEmail(email : string) : boolean
  {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }

  return (
    <>
    <div id="loginSignupBox">
      <button id="openNewUser" onClick={showSignUp}>New User</button>
      <button id="openExistingUser" onClick={showLogIn}>Existing User</button>

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
    </>
  )
}

export default LoginPage;