import {Component, React,useEffect,useState} from "react";
import {ReactDOM} from 'react-dom';
import { Link } from "react-router-dom";
import SecondPage from "./secondpage";
import axios from 'axios'
import { render } from "@testing-library/react";

const api = axios.create();

class RegisterPage extends Component{


    constructor(props){
        super(props)
        this.state={
            email:'',
            name:'',
            password:''
        }
    }

  

     handleEmailChange=(event)=>{
        this.setState({
            email:event.target.value
        })
    }

    handleNameChange=(event)=>{
        this.setState({
            name:event.target.value
        })
    }

    handlePasswordChange=(event)=>{
        this.setState({
            password:event.target.value
        })
    }

    handleSubmit=(event)=>{
        event.preventDefault();
        api.post('http://localhost:8000/api/register/',{
        "email":this.state.email,
        "password":this.state.password,
        "name":this.state.name
     }).then(res=>{
         alert("registered")
     }).catch(err=>{
         alert('error')
     })
    }

    goToLoginPage=(event)=>{
        window.location='/';
    }

    render(){
        return (
            <div  style={{margin:'auto',width:'50%'}}>
            <form onSubmit={this.handleSubmit}>
            <h1>Movie Recommendation Site</h1>
            <h3>Register</h3>
            <div className="form-group">
            <input required className="form-control" type="text" placeholder='name' value={this.state.name} onChange={this.handleNameChange}/><br/>
            <input required className="form-control" type="text" placeholder='email' value={this.state.email} onChange={this.handleEmailChange}/><br/>
            <input required className="form-control" type="password" placeholder='password' value={this.state.password} onChange={this.handlePasswordChange}/><br/>
            <button className="btn btn-primary btn-block" type="submit" value="Submit" >Register</button>
            </div>
            </form>
            <div>
            <button className="btn btn-primary btn-block" type="button" onClick={this.goToLoginPage} style={{marginTop:'5px'}}>Go To Login Page</button>
            </div>
            </div>
        )
        }
}

export default RegisterPage;