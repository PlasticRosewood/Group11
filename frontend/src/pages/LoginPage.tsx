import React, { useState } from 'react';

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

  return (
    <>
    <div id="LoginSignupBox">
      <button id="openNewUser" onClick={showSignUp}>New User</button>
      <button id="openExistingUser" onClick={showLogIn}>Existing User</button>

      <div id="newUserForm" style={{ display: signUpVisible ? 'block' : 'none'}}>
        <input type="text" id="newUserName" placeholder="Username" onChange={e => setUserName(e.target.value)} />
        <input type="email" id="newUserEmail" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" id="newUserPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button id="signUp" onClick={signUp}>Sign Up</button>
      </div>

      <div id="existingUserForm" style={{ display: logInVisible ? 'block' : 'none'}}>
        <input type="text" id="existingUserName" placeholder="Username" onChange={e => setUserName(e.target.value)} />
        <input type="password" id="existingUserPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button id="logIn" onClick={logIn}>Log In</button>
      </div>      
    </div>
    </>
  )
}

export default LoginPage;