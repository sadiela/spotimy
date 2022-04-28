import React, { Component } from 'react';
import MultiRangeSlider from "./multiRangeSlider";
import axios from 'axios'
//import { useNavigate } from "react-router-dom";


/*const cookies = new Cookies();

var scope = 'user-read-private user-read-email';

const authinfo = {
    client_id : '720ccd49410842c7bddb89cbfc7686a4', // Your client id
    client_secret : '35f10e9a0b204412843f84bb84b3a959', // Your secret
    redirect_uri :'http://localhost:3000/' // Your redirect uri
}

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};*/

  
export default class Main extends Component {
    constructor(props) {
        super(props)
        this.onSelect = this.onSelect.bind(this);
        this.loadSongs = this.loadSongs.bind(this);
        this.getAudioFeatures = this.getAudioFeatures.bind(this)
        this.onDanceMinMaxChange = this.onDanceMinMaxChange.bind(this)
        this.onEnergyMinMaxChange = this.onEnergyMinMaxChange.bind(this)
        this.onModeMinMaxChange = this.onModeMinMaxChange.bind(this)
        this.onSpeechMinMaxChange = this.onSpeechMinMaxChange.bind(this)
        this.onAcoustMinMaxChange = this.onAcoustMinMaxChange.bind(this)
        this.onInstMinMaxChange = this.onInstMinMaxChange.bind(this)
        this.onLiveMinMaxChange = this.onLiveMinMaxChange.bind(this)
        this.onValMinMaxChange = this.onValMinMaxChange.bind(this)
        this.onTempMinMaxChange = this.onTempMinMaxChange.bind(this)
        this.filterTracks = this.filterTracks.bind(this)
        this.createPlaylist = this.createPlaylist.bind(this)
        this.onChangePlaylistName = this.onChangePlaylistName.bind(this)
        this.state = {
            username: this.props.username,
            token:'',
            playlist_name:'',
            playlists: [],
            selected_playlist:{},
            tracks: [],
            tracksWithFeatures:[],
            filtered_tracks:[],
            minValue: 0,
            maxValue:100,
            dancemin: 0.8,
            dancemax: 1,
            energymin: 0,
            energymax: 1,
            modemin: 0,
            modemax: 1,
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
        console.log(this.state.username)
        axios.get('/get_token')
        .then((res) => {
            console.log(res.data)
            this.setState({token: res.data})
        }).catch((error) => {
            console.log(error)
        });
        //cookies.set(stateKey, state, { path: '/' });
        //console.log(cookies.get(stateKey)); 

        axios.get('/user_playlists')
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
        axios.get('/playlist_tracks/' + this.state.username + '/' + this.state.selected_playlist)
            .then(res => {
                this.setState({tracks: res.data });
                console.log(res.data)
                console.log("TOTAL TRACKS:" + res.data.length)
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    getAudioFeatures(e) {
        console.log(this.state.tracks)
        axios.post('/audio_features', this.state.tracks)
            .then(res => {
                console.log(res.data[0])
                this.setState({tracksWithFeatures: res.data})
                console.log("GOT FEATURE DATA")
        })
    }

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
        this.setState({modemin: e.min})
        this.setState({modemax: e.max})
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
        console.log("FILTERING TRACKS!")
        var filtering_args = {
                "tracklist":this.state.tracksWithFeatures,
                "filters": {
                    "dancemin": this.state.dancemin,
                    "dancemax": this.state.dancemax,
                    "energymin": this.state.energymin,
                    "energymax": this.state.energymax,
                    "modemin": this.state.modemin,
                    "modemax": this.state.modemax,
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
        axios.post('/create_playlist/' + this.state.username, creation_obj)
        .then((res) => {
            console.log(res.data)
            //this.setState({ filtered_tracks: res.data})
        }).catch((error) => {
            console.log(error)
        });   
    }

    render() {
        return (
            <div className="wrapper">
                <h1>Welcome to the Spotify Playlist Maker!</h1>
                <p>Choose your base playlist: </p>
                <div>
                    <select
                        value={this.state.selected_playlist}
                        onChange={this.onSelect}>
                        {this.state.playlists.map((data,i)  => {
                            return (
                                <option key={i} value={data.id}> {data.name} </option>
                            )
                            })}
                    </select>
                    <button onClick={this.loadSongs}>Confirm Playlist</button>
                    <button onClick={this.getAudioFeatures}>Get Features</button>
                    <p>Danceability Range</p>
                    <MultiRangeSlider
                        id="slider1"
                        min={0}
                        max={100}
                        onChange={this.onDanceMinMaxChange}
                    />
                    <p>Energy Range</p>
                    <MultiRangeSlider
                        id="slider2"
                        min={0}
                        max={100}
                        onChange={this.onEnergyMinMaxChange}
                    />
                    <p>Mode Selection</p>
                    <MultiRangeSlider
                        id="slider3"
                        min={0}
                        max={1}
                        onChange={this.onModeMinMaxChange}
                    />
                    <p>Speechiness Range</p>
                    <MultiRangeSlider
                        id="slider4"
                        min={0}
                        max={100}
                        onChange={this.onSpeechMinMaxChange}
                    />
                    <p>Acoustic Range</p>
                    <MultiRangeSlider
                        id="slider5"
                        min={0}
                        max={100}
                        onChange={this.onAcoustMinMaxChange}
                    />
                    <p>Instrumentalness Range</p>
                    <MultiRangeSlider
                        id="slider6"
                        min={0}
                        max={100}
                        onChange={this.onInstMinMaxChange}
                    />
                    <p>Liveness Range</p>
                    <MultiRangeSlider
                        id="slider7"
                        min={0}
                        max={100}
                        onChange={this.onLiveMinMaxChange}
                    />
                    <p>Valence Range</p>
                    <MultiRangeSlider
                        id="slider8"
                        min={0}
                        max={100}
                        onChange={this.onValMinMaxChange}
                    />
                    <p>Tempo Range</p>
                    <MultiRangeSlider
                        id="slider9"
                        min={0}
                        max={500}
                        onChange={this.onTempMinMaxChange}
                    />
                    <br></br>
                    <button onClick={this.filterTracks}>Filter Playlist Tracks</button>
                    <br></br>
                    <p>Track List:</p>
                    {(this.state.filtered_tracks.length === 0) ? (
                    <p>NO TRACKS</p>
                    ) : (
                    this.state.filtered_tracks.map((data,i) => (
                        <p key={i}>{data.name} {data.artist}</p>
                    ))
                    )}
                </div>
                    <div>
                        <input type="text" value={this.state.playlist_name} onChange={this.onChangePlaylistName}  />
                        <br></br>
                        <button onClick={this.createPlaylist}>Create your playlist!</button>
                    </div>
            </div>
        )
    }
}

//({ min, max }) => console.log(`min = ${min}, max = ${max}`)