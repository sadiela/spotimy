var CLIENT_ID = '720ccd49410842c7bddb89cbfc7686a4'
//var CLIENT_SECRET = '35f10e9a0b204412843f84bb84b3a959'
var REDIRECT_URL = 'https://spotipy-appsadie694.herokuapp.com/' //'http://127.0.0.1:5000/' // //  //'https://spotipy-appsadie694.herokuapp.com/main' //'http://localhost:3000/main' # front end
var SCOPE = 'user-library-read playlist-modify-public playlist-read-private'
var spotifyAuthEndpoint = "https://accounts.spotify.com/authorize?"+"client_id="+CLIENT_ID+"&redirect_uri="+REDIRECT_URL+"&scope="+SCOPE+"&response_type=token&state=123";

export {CLIENT_ID, REDIRECT_URL, SCOPE, spotifyAuthEndpoint}