import { Component, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import './secondpage.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from "axios";
import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";
import React from "react";
import axiosInstance from "./utils/axiosInstance";




class SecondPage extends React.Component {



    constructor(props) {


        super(props);

        this.state = {
            moviename: '',
            data: [],
            spin: true,
            PageNo: 1,
            movie_list: [],
            movie_dropdown_list: ['a', 'b'],
            movie_user_dropdown_list: ['a', 'b'],
            user_movie_data: [],
            rated_movie_data:[],
            not_seen_list: [],
            userName: '',
            userId: '',
            pages: ''

        }
    }

    componentDidMount() {
        this.setState({ userName: localStorage.getItem('userName'), userId: localStorage.getItem('userId') })
    }

    handleMovieName = (event) => {
        this.setState({
            moviename: event.target.value
        })
        if (this.state.moviename.length > 1) {
            axiosInstance.post('/api/searchmovie/', {
                "moviename": this.state.moviename
            }).then(res => {
                this.setState({ movie_dropdown_list: res.data.message })
            }).catch(err => {


            })
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ spin: false })
        axiosInstance.post('/api/recommendmovie/', {
            "moviename": this.state.moviename
        }).then(res => {
            this.setState({ spin: true })
            this.setState({ data: res.data.message })
        }).catch(err => {

            this.setState({ spin: true })
        })
    }

    handleUserMovieName = (event) => {
        this.setState({
            moviename: event.target.value
        })
        if (this.state.moviename.length > 3) {
            axiosInstance.post('/api/searchusermovie/', {
                "movie_name": this.state.moviename
            }).then(res => {
                this.setState({ movie_user_dropdown_list: res.data.message })
            }).catch(err => {


            })
        }
    }

    handleUserSubmit = (event) => {
        event.preventDefault();
        this.setState({ spin: false })
        axiosInstance.post('/api/recommendusermovie/',
            {
                "movie_name": this.state.moviename
            }).then(res => {
                this.setState({ spin: true })
                this.setState({ user_movie_data: res.data.message.Title })
            }).catch(err => {
                alert('No movies found')
                this.setState({ spin: true })
            })
    }


    GetMoviesList(pageNumber) {
        axiosInstance.post('/api/getMovies/',
            {
                "page_number": pageNumber,
                "userId": this.state.userId
            }).then(res => {
                this.setState({ movie_list: res.data.message });
                this.setState({ pages: res.data.pages });
            }).catch(err => {

            })
    }

    // pageIncrement=()=>{
    //         this.setState({
    //             PageNo:this.state.PageNo+1
    //         })
    //         // this.GetMoviesList(this.state.PageNo);
    // }

    // pageDecrement=()=>{
    //     if(this.state.PageNo>0){
    //         this.setState({
    //             PageNo:this.state.PageNo-1
    //         })
    //         this.GetMoviesList(this.state.PageNo);
    //      }

    // }

    saveUserMove(event) {
        console.log(event);
    }

    openTab(value) {
        document.querySelector("#search").style = 'display: none'
        document.querySelector("#recommend").style = 'display: none'
        document.querySelector("#list").style = 'display: none'
        document.querySelector("#rated").style = 'display: none'
        document.querySelector("#notseen").style = 'display: none'
        let valId = '#' + value
        document.querySelector(valId).style = "display: block"
        if (value == 'list') {
            this.GetMoviesList(1);
        }
        if (value == 'recommend') {
            this.RecommendList();
        }
        if (value == 'rated') {
            this.RatedList();
        }
        if (value == 'notseen') {
            this.NotSeenList();
        }
    }

    RecommendList() {
        axiosInstance.post('/api/userMov/',
            {
                "user_id": this.state.userId
            }).then(res => {
                this.setState({ user_movie_data: res.data.recommended });
            
            }).catch(err => {

            })
    }

    RatedList() {
        axiosInstance.post('/api/userMov/',
            {
                "user_id": this.state.userId
            }).then(res => {
                this.setState({ rated_movie_data: res.data.highrating });
             
            }).catch(err => {

            })
    }

    NotSeenList(){
        axiosInstance.post('/api/notseen/',
            {
                "userId": this.state.userId
            }).then(res => {
                this.setState({ not_seen_list: res.data.message });
           
            }).catch(err => {

            })
    }

    LogOut() {
        localStorage.removeItem('token');
        axiosInstance.post('/api/logout/', {
        }).then(res => {

        }).catch(err => {

        })
        window.location = '/';
    }

    SubmitNotSeen(value,input){
        if(input>=0&&input!=undefined&&input.length>0){
            console.log(input);
            axiosInstance.post('/api/insertdoc/', {
                "userId": this.state.userId,
                "movieId":value.movieId,
                "rating":input,
            }).then(res => {
                window.location.reload()
               this.NotSeenList();
            }).catch(err => {
    
            })
        }else{
            alert("enter rating");
        }
    }





    render() {
        return (
            <div>
                <div className="tab">
                    <button className="tablinks" onClick={() => this.openTab('list')}>Watch List</button>
                    <button className="tablinks" onClick={() => this.openTab('search')}>Search Movie</button>
                    <button className="tablinks" onClick={() => this.openTab('recommend')}>Recommended Movies</button>
                    <button className="tablinks" onClick={() => this.openTab('notseen')}>Not Watched List</button>
                    {/* <button className="tablinks" onClick={() => this.openTab('rated')}>Your Highest Rated Movies</button> */}
                    <button style={{ float: 'right' }} onClick={() => this.LogOut()}>Logout</button>
                    <span style={{ 'float': 'right' }}>
                        <label>User -</label>
                        <input type="text" value={this.state.userName} disabled style={{ 'border': 'none' }} />
                    </span>
                </div>

                <div id="search" className="tabcontent">
                    <form onSubmit={this.handleSubmit}>
                        <input type='text' list="data" placeholder="search movie" onChange={this.handleMovieName} />
                        <datalist id="data">
                            {this.state.movie_dropdown_list.map((item, key) =>
                                <option key={key} value={item.title} />
                            )}
                        </datalist>
                        <button type="submit" >submit</button>
                        <div className="spinner-border" role="status" hidden={this.state.spin}>
                            <span className="sr-only"></span>
                        </div>
                        <div>
                            <span style={{ fontSize: '14px', background: '#dbdbb4' }} >type 3 characters</span>
                        </div>
                    </form>
                    <div className="tabl">
                        <table className="table table-dark table-fixed responsive">
                            <thead>
                                <tr>
                                    <th>movies similarity based on title,cast,director,genres etc</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.data.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="notseen" className="tabcontent">
                    <div className="tab">
                        <h4>Movies You Did Not Watch</h4>
                        {/* <div style={{float:'right'}}>
                <button onClick={this.pageDecrement}> <i className="arrow left"></i> </button>
                 <button>{this.state.PageNo}</button>          
                <button onClick={this.pageIncrement}><i className="arrow right"></i></button>
                </div> */}

                        <table className="table table-dark table-fixed responsive">

                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Movie Name</th>
                                    <th>genres</th>
                                     <th>Rating</th>
                                     <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.not_seen_list.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.movieId}</td>
                                        <td>{item.title}</td>
                                        <td>{item.genres}</td>
                                        <td>
                                            <input type="number"  min={0} max={5} id={item.movieId}/>
                                        </td>
                                        <td>
                                            <button className="btn btn-primary" type="submit" 
                                            onClick={()=>this.SubmitNotSeen(item,document.getElementById(item.movieId).value)}>submit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="list" className="tabcontent">
                    <div className="tab">
                        <h4>Movies You Watched</h4>
                        {/* <div style={{float:'right'}}>
                <button onClick={this.pageDecrement}> <i className="arrow left"></i> </button>
                 <button>{this.state.PageNo}</button>          
                <button onClick={this.pageIncrement}><i className="arrow right"></i></button>
                </div> */}

                        <table className="table table-dark table-fixed responsive">

                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Movie Name</th>
                                    <th>genres</th>
                                    <th>Your Rating</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.movie_list.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.movieId}</td>
                                        <td>{item.title}</td>
                                        <td>{item.genres}</td>
                                        <td>{item.rating}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="recommend" className="tabcontent">
                    {/* <form onSubmit={this.handleUserSubmit}>
            <input type='text' list="user_data" placeholder="search movie" onChange={this.handleUserMovieName}/>
            <datalist id="user_data">
                {this.state.movie_user_dropdown_list.map((item, key) =>
                    <option key={key} value={item.title} />
                )}
                </datalist>
                <button type="submit" >submit</button>
                <div className="spinner-border" role="status" hidden={this.state.spin}>
                <span className="sr-only"></span>
                </div>
                <div>
                <span style={{fontSize:'14px',background:'#dbdbb4'}} >type 3 characters</span>
                </div>
            </form> */}
                    <div className="tab">

                        <h4>Movies You Will Like</h4>
                        <table className="table table-dark table-fixed responsive">

                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Movie Name</th>
                                    <th>Genre</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.user_movie_data.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.movieId}</td>
                                        <td>{item.title}</td>
                                        <td>{item.genres}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="rated" className="tabcontent">
                    <div className="tab">
                        <h4>Your Highest Rated Movies</h4>
                        <table className="table table-dark table-fixed responsive">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Movie Name</th>
                                    <th>Genre</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.rated_movie_data.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.movieId}</td>
                                        <td>{item.title}</td>
                                        <td>{item.genres}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}


export default SecondPage;