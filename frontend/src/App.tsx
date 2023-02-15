import EmailVerification from 'pages/auth/EmailVerification';
import ForgotPassword from 'pages/auth/ForgotPassword';
import Login from 'pages/auth/Login';
import Register from 'pages/auth/Register';
import ResetPassword from 'pages/auth/ResetPassword';
import UpdatePassword from 'pages/auth/UpdatePassword';
import UpdateProfile from 'pages/auth/UpdateProfile';
import EventsList from 'pages/events/EventsList';
import CreateEvent from 'pages/events/CreateEvent';
import EditEvent from 'pages/events/EditEvent';
import React from 'react';
import {Routes, Route} from 'react-router-dom';

const App = () => { // Main App Component

  return (

      <>

      <h1>Ether Tix Home</h1>

          <Routes>
              <Route path = '/register' element = {<Register />} />
              <Route path = '/login' element = {<Login />} />
              <Route path = '/forgot-password' element = {<ForgotPassword />} />

              <Route path = '/reset-password/:token' element = {<ResetPassword />} />
              <Route path = '/verify-email' element = {<EmailVerification />} />
              <Route path = '/update-password' element = {<UpdatePassword />} />
              <Route path = '/update-profile' element = {<UpdateProfile />} />
              <Route path = '/EditEvent' element = {<EditEvent />} />
              <Route path = '/CreateEvent' element = {<CreateEvent />} />
              <Route path = '/EventsList' element = {<EventsList />} />
         </Routes>

      </>


  );
}

export default App;
