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

Currently this application is in development mode so it can only be used by people whose emails are on the access list. If you would like to be added to the development access list, please email me at sadiela@bu.edu. 


## Architecture
This application has a Flask backend and a React frontend. It is hosted on Heroku.  


## Future Features

#### Filter by genre
Spotify's API also has data about the genres of artists. It would be interesting to be able to filter by artist genre as well. This will requiring changing a couple of the backend APIs and adding new UI components (e.g., checkboxes) so users can choose their desired genres. 

#### Audio features data analysis display
Eventually I would like to display histograms showing the distributions of the different audio features. This data is potentially interesting to users in its own right, but it will also give users a better idea of how many of their songs they will be filtering out for different audio feature ranges. 
