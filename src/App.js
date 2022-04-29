import logo from './logo.svg';
import './App.css';
import {HashRouter as Router,Route,Routes} from 'react-router-dom'

import React,{useState} from 'react';
import FirstPage from './firstpage';
import SecondPage from './secondpage';
import RegisterPage from './RegisterPage';
import axios from 'axios';



function App() {

 
  

  return (
    <div className="App">
        <Routes>
        <Route path="/" element={<FirstPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/welcome" element={<SecondPage/>}/>
        </Routes>
    </div>
  );
}




export default App;
