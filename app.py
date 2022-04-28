#Import Library
from flask import Flask, request, jsonify
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import spotipy
from matplotlib import style
from spotipy import util
from spotipy.oauth2 import SpotifyClientCredentials 
import json

#Set up Connection 
client_id = '720ccd49410842c7bddb89cbfc7686a4'
client_secret = '35f10e9a0b204412843f84bb84b3a959'
redirect_uri= 'http://localhost:8888/callback' # front end

username = 'sadieiq694' #Store username
scope = 'user-library-read playlist-modify-public playlist-read-private'
#redirect_uri='uri'
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, 
client_secret=client_secret)#Create manager for ease
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
token = util.prompt_for_user_token(username, scope, client_id, 
client_secret, redirect_uri)
session = {}

if token:
 sp = spotipy.Spotify(auth=token)
 print("GOT TOKEN!")
else:
 print("Can't get token for", username)

app = Flask(__name__)
app.secret_key = 'SECRET'

@app.route('/authenticate/<username>', methods=["GET", "POST"])
def authenticate_app(username):
    scope = 'user-library-read playlist-modify-public playlist-read-private'
    #redirect_uri='uri'
    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, 
    client_secret=client_secret)#Create manager for ease
    session['sp'] = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    session['token'] = util.prompt_for_user_token(username, scope, client_id, client_secret, redirect_uri)
    if token:
        session['sp'] = spotipy.Spotify(auth=session['token'])
        print("GOT TOKEN!")
        return "DONE"
    else:
        print("Can't get token for", username)
        return 400

@app.route('/user_playlists', methods=["GET"])
def get_playlist_ids():
    response = session['sp'].current_user_playlists(limit=50, offset=0)
    total = response["total"]
    print("ALL PLAYLISTS:", total)
    results = response["items"]

    while len(results) < total:
        print(len(results))
        response = session['sp'].current_user_playlists(limit=50, offset=len(results))
        results.extend(response["items"])
    print(len(results))

    playlists = []
    for r in results:
        cur_obj = {}
        cur_obj["id"] = r["id"]
        cur_obj["name"] = r["name"]
        playlists.append(cur_obj)
    return jsonify(playlists)

@app.route('/playlist_tracks/<user>/<playlistid>', methods=["GET"])
def user_playlist_tracks_full(user, playlistid):
    #fields="items(track(name,id))"
    # first run through also retrieves total no of songs in library
    response = session['sp'].user_playlist_tracks(user, playlistid, fields="items.track(name,id)", limit=100)
    total_songs = session['sp'].user_playlist_tracks(user, playlistid, fields="total", limit=100)
    print("TOTAL SONGS:", total_songs)
    total = total_songs['total']
    results = response['items']
    print(results)

    # subsequently runs until it hits the user-defined limit or has read all songs in the library
    while len(results) < total:
        print(len(results))
        response = session['sp'].user_playlist_tracks(
            user, playlistid, fields="items.track(name,id)", limit=100, offset=len(results))
        results.extend(response["items"])
    print(len(results))
    print(results[0])
    return jsonify(results)

@app.route('/audio_features', methods=["GET"])
def get_audio_features_full():
    if request.is_json: # check data is in correct format
        track_list = request.get_json() 
    print(track_list)
    res = []
    while len(res) < len(track_list):
        print(len(res))
        id_str = ""
        for i in range(len(res), len(res)+100):
            if i > len(track_list)-1:
                break
            id_str += track_list[i]["track"]["id"] + ','
        id_str = id_str[:-1]
        response = session['sp'].audio_features(id_str)
        res.extend(response)
    print(len(res))
    return jsonify(res)

    
@app.route('/filter_tracks', methods=["GET"])
def filter_tracks():
    if request.is_json: # check data is in correct format
        data = request.get_json() 
    print("Filtering track list")
    tracklist = data["tracklist"]
    track_filters = data["filters"]
    print("TRACKLIST1", tracklist)
    print(track_filters)

    filtered_tracks = [t['id'] for t in tracklist 
                                if t['danceability']>= track_filters["dancemin"] and t['danceability'] <=track_filters["dancemax"] \
                                and  t['energy']>= track_filters["energymin"] and t['energy'] <=track_filters["energymax"]  \
                                and  t['mode']>= track_filters["modemin"] and t['mode'] <= track_filters["modemax"] \
                                and  t['speechiness']>= track_filters["speechmin"] and t['speechiness'] <= track_filters["speechmax"] \
                                and  t['acousticness']>= track_filters["acoustmin"] and t['acousticness'] <=track_filters["acoustmax"] \
                                and  t['instrumentalness']>= track_filters["instmin"] and t['instrumentalness'] <= track_filters["instmax"] \
                                and  t['liveness']>= track_filters["livemin"] and t['liveness'] <= track_filters["livemax"] \
                                and  t['valence']>= track_filters["valmin"] and t['valence'] <= track_filters["valmax"] \
                                and  t['tempo']>= track_filters["tempmin"] and t['tempo'] <= track_filters["tempmax"] ]
    
    return jsonify(filtered_tracks)

@app.route('/create_playlist/<user>', methods=["POST", "PUT", "GET"])
def create_playlist(user):
    print("CREATING PLAYLIST")
    if request.is_json: # check data is in correct format
        data = request.get_json() 
    print("Filtering track list")
    playlist_name = data["playlist_name"]
    track_ids = data["track_ids"]

    playlist_create = session['sp'].user_playlist_create(user, playlist_name, public=True, collaborative=False, description='')
    print(playlist_create)
    print(track_ids[0])
    if(len(track_ids) <= 100):
        session['sp'].user_playlist_add_tracks(user, playlist_create['id'],track_ids)
    else: 
        offset=0
        while offset+100 < len(track_ids):
            session['sp'].user_playlist_add_tracks(user, playlist_create['id'],track_ids[offset:offset+100])
            offset = offset+100
        session['sp'].user_playlist_add_tracks(user, playlist_create['id'],track_ids[offset:])
    
    return playlist_create['id']

if __name__ == '__main__':
    app.run(debug = True)