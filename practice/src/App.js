import React, {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route, Link, Switch} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import Login from './login.js';
import Register from './register.js';

const logregReducer = (state, action) => {
  const {type} = action
  if(!state){
    return{
      status: 'NONE'
    }
  }
  else{
    if(type === "SENT"){
      return{
        ...state,
        status: 'SENT'
      }
    }
    if(type === "SENDING"){
      return{
        ...state,
        status: 'SENDING'
      }
    }
  }
}

const store = createStore(logregReducer)
//const delay = ms => new Promise(ok => setTimeout(ok,ms))

store.subscribe(() => console.log('store.getState ', store.getState()))

const ActionRegister = (obj) => {
  console.log(obj)
  fetch("/register",{
    "method": "POST",
    "headers": {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  .then(res => res.json())
  .then(json => store.dispatch({type: "SENT"}))
  return {type: "SENDING"}
}

const ActionLogin = (obj) => {
  console.log(obj)
  fetch("/login",{
    "method": "POST",
    "headers": {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify(obj)
  })
  .then(res => res.json())
  .then(json => {
    localStorage.setItem("token", json)
    store.dispatch({type: "SENT"})
  })
  return {type: "SENDING"}
}



let RegisterConnected = connect(st => ({status: st.status}), {onSend: ActionRegister})(Register)
let LoginConnected = connect(st => ({status: st.status}), {onSend: ActionLogin})(Login)

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element = {<RegisterConnected />} />
          <Route path="/login" element = {<LoginConnected />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App;
