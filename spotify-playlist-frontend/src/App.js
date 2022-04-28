import React, { Component } from 'react';
//import ReactDOM from 'react-dom/client';
import Main from './components/main.component.js';
//import Cookies from 'universal-cookie';
//import { useNavigate } from "react-router-dom";
import axios from 'axios'


  
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
            <input type="text" value={this.state.username} onChange={this.onChangeUserName}  />
            <br></br>
            <button onClick={this.authorize}>Login to Spotify</button>
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
