import React, { Component } from 'react';
import MultiRangeSlider from "./multiRangeSlider";
import axios from 'axios'
import styled from "styled-components";
import "./main.component.css";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
//import ListSubheader from '@mui/material/ListSubheader';

//import { useNavigate } from "react-router-dom";

const Button = styled.button`
    background-color: #4196F7;
    color: white;
    font-size: 15px;
    padding: 5px 20px;
    border-radius: 20px;
    margin: 10px 10px;
    cursor: pointer;
`;

const Title = styled.h1`
    font-weight: bold; 
    font-family: Tahoma;
    text-align: center;
    font-size: 30px;
    background-color: e7e6e7`;

const ParBold = styled.p`
    font-weight: bold; 
    font-family: Tahoma;
    text-align: center;
    font-size: 20px;
    background-color: e7e6e7`;

const Par = styled.p`
    font-family: Tahoma;
    text-align: center;
    font-size: 15px;
    background-color: e7e6e7`;

const Input = styled.input`
    background-color: e7e6e7;
    color: black;
    font-size: 15px;
    padding: 5px 10px;
    border-radius: 0px;
    margin: 10px 10px;
    cursor: pointer;`
    ;
  
export default class Main extends Component {
    constructor(props) {
        super(props)
        this.onSelect = this.onSelect.bind(this);
        this.loadSongs = this.loadSongs.bind(this);
        //this.getAudioFeatures = this.getAudioFeatures.bind(this)
        this.onDanceMinMaxChange = this.onDanceMinMaxChange.bind(this)
        this.onEnergyMinMaxChange = this.onEnergyMinMaxChange.bind(this)
        this.onModeMinMaxChange = this.onModeMinMaxChange.bind(this)
        this.onMajChange = this.onMajChange.bind(this)
        this.onMinChange = this.onMinChange.bind(this)
        this.onSpeechMinMaxChange = this.onSpeechMinMaxChange.bind(this)
        this.onAcoustMinMaxChange = this.onAcoustMinMaxChange.bind(this)
        this.onInstMinMaxChange = this.onInstMinMaxChange.bind(this)
        this.onLiveMinMaxChange = this.onLiveMinMaxChange.bind(this)
        this.onValMinMaxChange = this.onValMinMaxChange.bind(this)
        this.onTempMinMaxChange = this.onTempMinMaxChange.bind(this)
        this.filterTracks = this.filterTracks.bind(this)
        this.onUsernameChange = this.onUsernameChange.bind(this)
        this.createPlaylist = this.createPlaylist.bind(this)
        this.onChangePlaylistName = this.onChangePlaylistName.bind(this)
        this.state = {
            username: '',
            token:this.props.token,
            playlist_name:'',
            playlists: [],
            selected_playlist:{},
            loaded:'',
            playlistCreated: '',
            playlistLink:'',
            //tracks: [],
            tracksWithFeatures:[],
            filtered_tracks:[],
            minValue: 0,
            maxValue:100,
            dancemin: 0.8,
            dancemax: 1,
            energymin: 0,
            energymax: 1,
            majorchecked: true,
            minorchecked: true, // default both major and minor keys allowed
            speechmin: 0,
            speechmax: 1,
            acoustmin: 0,
            acoustmax: 1,
            instmin: 0,
            instmax: 1,
            livemin: 0,
            livemax: 1,
            valmin: 0,
            valmax: 1,
            tempmin: 0,
            tempmax: 500,
            }
    }

   componentDidMount() {
        console.log("PROPS:", this.props)
        console.log("USERNAME:", this.state.username)
        console.log("TOKEN:", this.state.token)
  
        axios.get('/user_playlists/' + this.state.token)
            .then(res => {
                this.setState({ playlists: res.data });
                console.log("PLAYLISTS")
                console.log(res.data)
                console.log(res.data[0].id)
                this.setState({selected_playlist: res.data[0].id})
                console.log(this.state.selectedid)
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    onSelect(e) {
        console.log(this.state.playlists)
        this.setState({ selected_playlist: e.target.value })
    }

    loadSongs(e) {
        console.log("LOADING SONGS!")
        this.setState({loaded: "Loading tracks, please wait..."})
        axios.get('/playlist_tracks_features/' + this.state.selected_playlist + '/' + this.state.token)
            .then(res => {
                this.setState({tracksWithFeatures: res.data });
                console.log(res.data)
                console.log("TOTAL TRACKS:" + res.data.length)
                console.log(this.state.loadingTracks)
                this.setState({loaded: "Tracks loaded! Please choose filtering options."})
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    /*getAudioFeatures(e) {
        console.log(this.state.tracks)
        axios.post('/audio_features', this.state.tracks)
            .then(res => {
                console.log(res.data[0])
                this.setState({tracksWithFeatures: res.data})
                console.log("GOT FEATURE DATA")
        })
    }*/

    onDanceMinMaxChange(e) {
        var min = e.min/100
        var max = e.max/100
        this.setState({dancemin: min})
        this.setState({dancemax: max})
    }

    onEnergyMinMaxChange(e){
        //console.log(`min = ${min}, max = ${max}`)
        var min = e.min/100
        var max = e.max/100
        this.setState({energymin: min})
        this.setState({energymax: max})
    }


    onModeMinMaxChange(e){
        //console.log(`min = ${min}, max = ${max}`)
        this.setState({maj: e.min})
        this.setState({modemax: e.max})
    }

    onMajChange(e) {
        console.log("Major", this.state.majorchecked, "Minor:", this.state.minorchecked)
        this.setState({majorchecked: e.target.checked})
        console.log("EVENT", e.target.checked)
        console.log("Major", this.state.majorchecked, "Minor:", this.state.minorchecked)
    }

    onMinChange(e) {
        this.setState({minorchecked: e.target.checked})
        console.log(this.state.majorchecked, this.state.minorchecked)
    }


    onSpeechMinMaxChange(e){
        //console.log(`min = ${min}, max = ${max}`)
        var min = e.min/100
        var max = e.max/100
        this.setState({speechmin: min})
        this.setState({speechmax: max})
    }

    onAcoustMinMaxChange(e){
        //console.log(`min = ${min}, max = ${max}`)
        var min = e.min/100
        var max = e.max/100
        this.setState({acoustmin: min})
        this.setState({acoustmax: max})
    }

    onInstMinMaxChange(e){
        //console.log(`min = ${min}, max = ${max}`)
        var min = e.min/100
        var max = e.max/100
        this.setState({instmin: min})
        this.setState({instmax: max})
    }

    onLiveMinMaxChange(e){
        //console.log(`min = ${min}, max = ${max}`)
        var min = e.min/100
        var max = e.max/100
        this.setState({livemin: min})
        this.setState({livemax: max})
    }

    onValMinMaxChange(e){
        //console.log(`min = ${min}, max = ${max}`)
        var min = e.min/100
        var max = e.max/100
        this.setState({valmin: min})
        this.setState({valmax: max})
    }

    onTempMinMaxChange(e){
        //console.log(`min = ${min}, max = ${max}`)
        this.setState({tempmin: e.min})
        this.setState({tempmax: e.max})
    }

    filterTracks(e) {
        console.log("Major", this.state.majorchecked, "Minor:", this.state.minorchecked)
        console.log("FILTERING TRACKS!")
        var modemin, modemax; 
        if (this.state.minorchecked === true) {
            modemin = 0; 
        } else {
            modemin=1;
        }
        if (this.state.majorchecked === true) {
            modemax = 1; 
        } else {
            modemax = 0;
        }

        var filtering_args = {
                "tracklist":this.state.tracksWithFeatures,
                "filters": {
                    "dancemin": this.state.dancemin,
                    "dancemax": this.state.dancemax,
                    "energymin": this.state.energymin,
                    "energymax": this.state.energymax,
                    "modemin": modemin,
                    "modemax": modemax,
                    "speechmin": this.state.speechmin,
                    "speechmax": this.state.speechmax,
                    "acoustmin": this.state.acoustmin,
                    "acoustmax": this.state.acoustmax,
                    "instmin": this.state.instmin,
                    "instmax": this.state.instmax,
                    "livemin": this.state.livemin,
                    "livemax": this.state.livemax,
                    "valmin": this.state.valmin,
                    "valmax": this.state.valmax,
                    "tempmin": this.state.tempmin,
                    "tempmax": this.state.tempmax,
                }
            }
        axios.post('/filter_tracks', filtering_args)
        .then((res) => {
            console.log(res.data)
            this.setState({ filtered_tracks: res.data})
        }).catch((error) => {
            console.log(error)
        });
    }

    onUsernameChange(e) {
        this.setState({ username: e.target.value })
    }

    onChangePlaylistName(e) {
        this.setState({ playlist_name: e.target.value })
    }

    createPlaylist(e) {
        var track_ids = this.state.filtered_tracks.map((data)  => {
            return (data.id)})
        console.log(track_ids)

        var creation_obj = {
            "playlist_name": this.state.playlist_name,
            "track_ids": track_ids
        }

        this.setState({ playlistCreated: "Creating your playlist..."})
        axios.post('/create_playlist/' + this.state.username + '/' + this.state.token, creation_obj)
        .then((res) => {
            console.log(res.data)
            this.setState({ playlistLink: res.data.link})
            this.setState({ playlistCreated: "Playlist created! Check it out on Spotify :)"})
        }).catch((error) => {
            console.log(error)
            this.setState({ playlistCreated: "Playlist creation failed...check that your username is correct!"})
        });   
    }

    render() {
        return (
            <div className="wrapper">
                <Title>Welcome to the Spotify Playlist Maker!</Title>
                <ParBold>Choose your base playlist: </ParBold>
                <div>
                    <div className="custom-select">
                        <select
                            value={this.state.selected_playlist}
                            onChange={this.onSelect}>
                            {this.state.playlists.map((data,i)  => {
                                return (
                                    <option key={i} value={data.id}> {data.name} </option>
                                )
                                })}
                        </select>
                    </div>
                    <Button onClick={this.loadSongs}>Confirm Playlist</Button>
                    <Par>{this.state.loaded}</Par>
                    <Par>Danceability Range</Par>
                    <MultiRangeSlider
                        id="slider1"
                        min={0}
                        max={100}
                        onChange={this.onDanceMinMaxChange}
                    />
                    <Par>Energy Range</Par>
                    <MultiRangeSlider
                        id="slider2"
                        min={0}
                        max={100}
                        onChange={this.onEnergyMinMaxChange}
                    />
                    <Par>Mode Selection</Par>
                    <input type="checkbox" id="majorcheck" name="major" value="maj" checked={this.state.majorchecked} onChange={this.onMajChange} />Major key
                    <input type="checkbox" id="minorcheck" name="minor" value="min" checked={this.state.minorchecked} onChange={this.onMinChange} />Minor key
                    <Par>Speechiness Range</Par>
                    <MultiRangeSlider
                        id="slider4"
                        min={0}
                        max={100}
                        onChange={this.onSpeechMinMaxChange}
                    />
                    <Par>Acoustic Range</Par>
                    <MultiRangeSlider
                        id="slider5"
                        min={0}
                        max={100}
                        onChange={this.onAcoustMinMaxChange}
                    />
                    <Par>Instrumentalness Range</Par>
                    <MultiRangeSlider
                        id="slider6"
                        min={0}
                        max={100}
                        onChange={this.onInstMinMaxChange}
                    />
                    <Par>Liveness Range</Par>
                    <MultiRangeSlider
                        id="slider7"
                        min={0}
                        max={100}
                        onChange={this.onLiveMinMaxChange}
                    />
                    <Par>Valence Range</Par>
                    <MultiRangeSlider
                        id="slider8"
                        min={0}
                        max={100}
                        onChange={this.onValMinMaxChange}
                    />
                    <Par>Tempo Range</Par>
                    <MultiRangeSlider
                        id="slider9"
                        min={0}
                        max={500}
                        onChange={this.onTempMinMaxChange}
                    />
                    <br></br>
                    <Button onClick={this.filterTracks}>Filter Playlist Tracks</Button>
                    <br></br>
                    <ParBold>Track List:</ParBold>
                    {(this.state.filtered_tracks.length === 0) ? (
                    <Par>No tracks fit the filter criteria!</Par>
                    ) : (
                        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                            <List
                                sx={{
                                    width: '100%',
                                    maxWidth: 360,
                                    bgcolor: '#ffffff',
                                    alignItems: "center",
                                    overflow: 'auto',
                                    maxHeight: 300,
                                    '& ul': { padding: 0 },
                                }}
                                >
                                {this.state.filtered_tracks.map((data,i) => (
                                        <ListItem key={`item-${i}`} sx={{alignItems:"center"}}>
                                            <ListItemText primary={`${data.name} - ${data.artist}`}/>
                                        </ListItem>
                                ))}
                            </List>    
                        </div>
                    )}     
                    
                </div>
                    <Par>Happy? Enter your Spotify username and desired playlist name:</Par>
                    <div>
                        <Par>Username:</Par>
                        <Input type="text" value={this.state.username} onChange={this.onUsernameChange}/>
                        <Par>Playlist Name:</Par>
                        <Input type="text" value={this.state.playlist_name} onChange={this.onChangePlaylistName}  />
                        <br></br>
                        <Button onClick={this.createPlaylist}>Create your playlist!</Button>
                        <Par>{this.state.playlistCreated}</Par>
                        {(this.state.playlistLink) ? (
                           <a href={this.state.playlistLink}>Your new playlist</a>
                        ):(
                          <p></p>
                        )}
                    </div>
            </div>
        )
    }
}

//({ min, max }) => console.log(`min = ${min}, max = ${max}`)
// <button onClick={this.getAudioFeatures}>Get Features</button>
