import React, { Component } from 'react';
//import ReactDOM from 'react-dom/client';
import Main from './components/main.component.js';
//import Cookies from 'universal-cookie';
//import { useNavigate } from "react-router-dom";
//import axios from 'axios'
import styled from "styled-components";
//import { render } from 'react-dom';
//import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {useEffect, useState} from 'react';
import {spotifyAuthEndpoint} from './Secrets'

const Button = styled.button`
  background-color: #4196F7;
  color: white;
  font-size: 15px;
  padding: 10px 30px;
  border-radius: 20px;
  margin: 10px 10px;
  cursor: pointer;
`;

const Input = styled.input`
  background-color: white;
  color: black;
  font-size: 15px;
  padding: 5px 10px;
  border-radius: 0px;
  margin: 10px 10px;
  cursor: pointer;`
  ;

  function App() {
    const [token, setToken] = useState("")

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    return (
        <div className="App">
            <header className="App-header">
                {!token ?
                  <div>
                    <a href={`${spotifyAuthEndpoint}`}>Login to Spotify</a>
                  </div>  
                    : <div> 
                        <Main token={token}/>
                        <Button onClick={logout}>Logout</Button>
                      </div>
                }
            </header>
        </div>
    );
}

export default App;


/*export default class App extends Component  {

  constructor(props) {
      super(props)
      this.authorize = this.authorize.bind(this);
      this.loginSpotify = this.loginSpotify.bind(this);
      this.onChangeUserName = this.onChangeUserName.bind(this);
      this.state = {
          username:'',
          token:'',
          cookieval:'',
          redir_link:''
      }
  }

  onChangeUserName(e) {
    this.setState({ username: e.target.value })
  } 

  authorize(e) {
    console.log("LOGIN BUTTON CLICKED")
    // MAKE API CALL!
    axios.get('/authenticate/'+this.state.username)
        .then((res) => {
            console.log(res.data)
            this.setState({token: res.data})
        }).catch((error) => {
            console.log(error)
        });
  }

  loginSpotify (e){
    window.open(spotifyAuthEndpoint,'callBackWindow','height=500,width=400');
    //This event listener will trigger once your callback page adds the token to localStorage
    window.addEventListener("storage",function(event){
        if (event.key === "accessToken"){
            console.log("ACCESS TOKEN:", event.newValue)
            this.setState({ token: event.newValue })
            //do things with spotify API using your access token here!!
        }
    });
}
  
  render(){
  return (
    <div className="App">
            <a href={`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPE}&response_type=token&state=123`}>Login to Spotify</a>
            <Input type="text" value={this.state.username} onChange={this.onChangeUserName}  />
            <br></br>
            <Button onClick={this.loginSpotify}>Login to Spotify</Button>
            <Link to="/login">Login</Link>
            <Routes>
            <Route path="/" element={<div>Default Page Content</div>} />
            <Route path="/main" element={<Main username={this.state.username}/>} />  
      </Routes>
    </div>
  );
  }
}

/*<form onSubmit={this.authorize}>
                <div className="form-group">
                    <label>Add User Name</label>
                </div>
                <div className="form-group">
                    <input type="submit" value="Log In" className="btn btn-success btn-block" />
                </div>
            </form> */