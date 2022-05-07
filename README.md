# Spotimy Custom Playlist Maker

This application allows Spotify users to create filtered playlists based on their previous saved/followed playlists. It is hosted at [spotimy.net](http://spotimy.net/).

## Requirements
* Python 3.9
* Node v17.7.2
* React

## Motivation

This app is intended for users who keep a large playlist of their entire music library. It allows you to filter your large playlist according to the [audio features](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-audio-features) reported by Spotify's API. This can help users create mood or activity specific playlists. For example, you could filter your playlist by BPM to create a running playlist.

![app_ui](https://user-images.githubusercontent.com/18174572/167036575-9e142918-14dc-4e5c-b800-8db9bafe04a4.PNG)

## Usage

Currently this application is in development mode so it can only be used by people whose emails are on the access list. If you would like to be added to the development access list, please email me at sadiela@bu.edu. If you are not on the access list, you will not be able to login with your Spotify account.

To use:
1. Login with your Spotify account on the login page
2. Choose a base playlist from the dropdown menu and click "confirm playlist". This will load the audio feature information for all tracks in the playlist. When the tracks are done loaded, you will see a message on the page. 
3. Select your desired audio feature ranges with the sliders and check boxes. Click "Filter Playlist Tracks" to see a list of filtered tracks. You can continue changing the filters and updating the filtered list until you are satisfied. 
4. When you are happy with your new playlist, you can automatically create it and add it to Spotify by entering your spotify username and desired playlist name and clicking "Create your playlist!". When the playlist has been successfully created, a link to it will appear.

## Audio Feature Information

Spotimy lets you filter your tracks according to 9 audio features reported by Spotify's API:

* **Acousticness**: A confidence measure from 0 to 100 of whether the track is acoustic.
* **Danceability**: How suitable a track is for dancing based on several musical elements including tempo, rhythm stability, beat strength, and overall regularity. 
* **Energy**: Perceptual measure of intensity and activity.
* **Instrumentalness**: Prediction about whether a track contains vocals. The closer the instrumentalness value is to 100, the greater likelihood the track contains no vocal content.
* **Liveness**: Confidence measure of whether a track was performed live.
* **Mode**: Whether the track is in a major or minor key. 
* **Speechiness**: Detects the presence of spoken words in a track.
* **Tempo**: Estimated tempo of the track in beats per minute. 
* **Valence**: A measure of the musical positiveness conveyed by a track.

## Architecture
This application has a [Flask backend](https://flask.palletsprojects.com/en/2.1.x/) and a [React](https://reactjs.org/) frontend. It is hosted on [Heroku](https://www.heroku.com/). Documentation for the backend API can be found in this repository's [wiki](https://github.com/sadiela/spotimy/wiki). 

## Future Features

### More Filtering Options
In the future, the following filtering options will be added to the application:
* **Time Signature**: Estimated time signature of the track.
* **Loudness**: Overall loudness of a track in decibels (values typically range between -60db and 0db). 
* **Key**: The key that the track is in.
* **Duration**: Duration of track.
* **Genre**: The genre associated with the track's artist. 

#### Audio features data analysis display
Eventually I would like to display histograms showing the distributions of the different audio features. This data is potentially interesting to users in its own right, but it will also give users a better idea of how many of their songs they will be filtering out for different audio feature ranges. See the [wiki](https://github.com/sadiela/spotimy/wiki) for examples of the distribution graphs for one of my [personal playlists](https://open.spotify.com/playlist/2I0tFWHjXJg81fLYTg3KWX?si=4cabc61dbb2c48e2).

### Information page
"Info" page on web app so users can better understand the audio features that they can use for filtering. 
