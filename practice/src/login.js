import React, {useState, useEffect} from 'react';
import {Router, Route, Link, Switch} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';

function Login(props){

  const [login, setLogin] = useState()
  const [loginValid, setLoginValid] = useState()
  const [password, setPassword] = useState()
  const [passwordValid, setPasswordValid] = useState()
  const [style, setStyle] = useState()

  function handleUserInput(e) {
    validateField(e.target.name, e.target.value)
  }

  function validateField(fieldName, value) {
    let errs = ""
    switch(fieldName) {
      case 'login':
        setLogin(value)
        setLoginValid(value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? true : false)
        break;
      case 'password':
        setPassword(value)
        setPasswordValid(value.length >= 6 ? true : false)
        break;
    }
  }

  useEffect(() => {
    setStyle({style : {
      'width': '50%',
      'display': 'flex',
      'justifyContent': 'space-between',
      'textAlign': 'center',
    }})
    fetch("/login",{
      "method": "POST",
      "headers": {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(json => {
      console.log('You are logged in')
    })
  }, [])

  function errors () {
    let errs = ""
    if(!loginValid){
      errs += "incorrect login\n"
    }
    if(!passwordValid){
      errs += "password is too short\n"
    }
    return errs
  }

  return (
    <form className = 'register' style = {style} onSubmit = {e => {
        e.preventDefault()
        let tmp = JSON.parse(`{"login": "${login}", "password": "${password}"}`)
        props.onSend(tmp)}}>
      <input name = 'login' value = {login} onChange = {handleUserInput} />
      <input name = 'password' value = {password} onChange = {handleUserInput} />
      <p class = 'errors'> {errors()}</p>
      <input type = "submit" value = "Log in" disabled = {props.status === 'SENDING' || ! (loginValid && passwordValid)} />
    </form>
  )
}

export default Login;