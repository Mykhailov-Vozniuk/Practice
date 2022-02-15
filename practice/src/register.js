import React, {useState, useEffect} from 'react';
import {Router, Route, Link, Switch} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';

function Register(props){

  const [login, setLogin] = useState()
  const [loginValid, setLoginValid] = useState()
  const [password, setPassword] = useState()
  const [passwordValid, setPasswordValid] = useState()
  const [name, setName] = useState()
  const [nameValid, setNameValid] = useState()
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
      case 'name':
        setName(value)
        setNameValid(value.length >= 3 ? true : false)
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
  }, [])

  function errors () {
    let errs = ""
    if(!loginValid){
      errs += "incorrect login\n"
    }
    if(!passwordValid){
      errs += "password is too short\n"
    }
    if(!nameValid){
      errs += "name is too short\n"
    }
    return errs
  }

  return (
    <form className = 'register' style = {style} onSubmit = {e => {
        e.preventDefault()
        console.log(login, loginValid, password, passwordValid, name, nameValid)
        let tmp = JSON.parse(`{"login": "${login}", "password": "${password}", "name": "${name}"}`)
        props.onSend(tmp)}}>
      <input name = 'login' value = {login} onChange = {handleUserInput} />
      <input name = 'password' value = {password} onChange = {handleUserInput} />
      <input name = 'name' value = {name} onChange = {handleUserInput} />
      <p class = 'errors'> {errors()}</p>
      <input type = "submit" value = "Register" disabled = {props.status === 'SENDING' || ! (loginValid && passwordValid && nameValid)} />
    </form>
  )
}

export default Register;