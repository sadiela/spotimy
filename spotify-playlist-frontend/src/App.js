import React, { Component } from 'react';
//import ReactDOM from 'react-dom/client';
import Main from './components/main.component.js';
//import Cookies from 'universal-cookie';
//import { useNavigate } from "react-router-dom";
import axios from 'axios'
import styled from "styled-components";


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


export default class App extends Component  {

  constructor(props) {
      super(props)
      this.authorize = this.authorize.bind(this);
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
  
  render(){
  return (
    <div className="App">
    {this.state.token ? <Main  username={this.state.username}/> : <div>
            <Input type="text" value={this.state.username} onChange={this.onChangeUserName}  />
            <br></br>
            <Button onClick={this.authorize}>Login to Spotify</Button>
          </div>}
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
