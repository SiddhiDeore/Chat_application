import React from 'react';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import Profile from './components/Profile';
import CompleteProfile from './components/CompleProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<ChatRoom />} />
        <Route path="/login" element={<Login />} />
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/completeprofile' element={<CompleteProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
