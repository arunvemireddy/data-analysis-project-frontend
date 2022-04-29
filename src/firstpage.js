import {Component, React,useEffect,useState} from "react";
import {ReactDOM} from 'react-dom';
import { Link } from "react-router-dom";
import SecondPage from "./secondpage";
import { render } from "@testing-library/react";
import axiosInstance from "./utils/axiosInstance";



 class FirstPage extends Component{

    constructor(props){
        super(props)
        this.state={
            username:'',
            password:''
        }
    }

    componentDidMount(){
        localStorage.clear();
    }

     handleUsernameChange=(event)=>{
        this.setState({
            username:event.target.value
        })
    }

    handlePasswordChange=(event)=>{
        this.setState({
            password:event.target.value
        })
    }

    handleSubmit=(event)=>{
        event.preventDefault();
        console.log(this.state.username);
        console.log(this.state.password);
        axiosInstance.post('/api/login/',{
        "email":this.state.username,
        "password":this.state.password
     }).then(res=>{
         localStorage.setItem('token',res.data['jwt'])
         localStorage.setItem('userName',res.data['userName'])
         localStorage.setItem('userId',res.data['userId'])
         window.location='/welcome'
     })
    }

    goToRegisterPage=(event)=>{
        window.location='/register';
    }
    render(){
    return (
        <div style={{margin:'auto',width:'50%',height:'100%'}}>
        <form onSubmit={this.handleSubmit}>
        <h1>Movie Recommendation Site</h1>
        <h3>Login Page</h3>
        <div className="form-group">
        <input required className="form-control" type="text" placeholder='email' value={this.state.username} onChange={this.handleUsernameChange}/><br/>
        </div>
        <div className="form-group">
        <input required className="form-control" type="password" placeholder='password' value={this.state.password} onChange={this.handlePasswordChange}/><br/>
        </div>
        <button className="btn btn-primary btn-block" type="submit" value="Submit" >Login</button>
        
        </form>
         <button className="btn btn-primary btn-block" type="button" onClick={this.goToRegisterPage} style={{marginTop:'5px'}}>Go to Registration Page</button>
        </div>
    )
    }
 }


export default FirstPage;