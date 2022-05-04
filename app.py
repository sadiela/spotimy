#Import Library
from flask import Flask, request, jsonify # , session
import spotipy
from spotipy import util
from spotipy.oauth2 import SpotifyClientCredentials 
import json
from env_info import *
import os

#Set up Connection 
client_id = CLIENT_ID
client_secret = CLIENT_SECRET
redirect_uri= REDIRECT_URL # front end
scope = SCOPE


session = {}

app = Flask(__name__, static_folder='./spotify-playlist-frontend/build', static_url_path='/')
app.secret_key = SECRET_KEY

@app.route('/', methods=["GET"])
def index():
    print("Hello")
    return "HELLO WORLD!" #app.send_static_file('index.html')

@app.route('/authenticate/<username>', methods=["GET", "POST"])
def authenticate_app(username):
    #redirect_uri='uri'
    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)#Create manager for ease
    session['sp'] = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    session['token'] = util.prompt_for_user_token(username, scope, client_id, client_secret, redirect_uri)
    if session['token']:
        session['sp'] = spotipy.Spotify(auth=session['token'])
        print("GOT TOKEN!")
        print(session['token'])
        return session['token']
    else:
        print("Can't get token for", username)
        return 400

@app.route('/get_token', methods=["GET"])
def get_token():
    if "token" in session.keys():
        return session["token"]
    else:
        return ""

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


def playlist_track_info_no_features(user, playlistid, fields, limit):
    response = session['sp'].user_playlist_tracks(user, playlistid, fields=fields, limit=limit)
    total_songs = session['sp'].user_playlist_tracks(user, playlistid, fields="total", limit=limit)
    total = total_songs['total']
    results = response['items']

    # subsequently runs until it hits the user-defined limit or has read all songs in the library
    while len(results) < total:
        print(len(results))
        response = session['sp'].user_playlist_tracks(
            user, playlistid, fields="items.track(name,id,artists(name))", limit=100, offset=len(results))
        results.extend(response["items"])
    print(len(results))
    return results

def tracklist_audio_features(track_list):
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

    full_res = []
    for (s, r) in zip(track_list, res):
        r["artist"] =  s["track"]["artists"][0]["name"]
        r["name"] =  s["track"]["name"]
        full_res.append(r)
    print(len(full_res))
    return full_res

# get list of tracks for a playlist
@app.route('/playlist_tracks/<user>/<playlistid>', methods=["GET"])
def user_playlist_tracks_full(user, playlistid):
    results = playlist_track_info_no_features(user, playlistid, "items.track(name,id,artists(name))", 100)
    return jsonify(results)

# get audio features for a list of tracks
@app.route('/audio_features', methods=["GET", "POST"])
def get_audio_features_full():
    if request.is_json: # check data is in correct format
        print("JSON REQUEST")
        track_list = request.get_json() 
        print(track_list)
        full_res = tracklist_audio_features(track_list)
        return jsonify(full_res)
    else: 
        print("NO JSON DATA PASSED")
        return 500

# get list of tracks WITH audio features for a playlist
@app.route('/playlist_tracks_features/<user>/<playlistid>', methods=["GET", "POST"])
def user_playlist_tracks_with_features(user, playlistid):
    track_list = playlist_track_info_no_features(user, playlistid, "items.track(name,id,artists(name))", 100)
    full_res = tracklist_audio_features(track_list)
    return jsonify(full_res)

    
@app.route('/filter_tracks', methods=["GET", "POST"])
def filter_tracks():
    if request.is_json: # check data is in correct format
        data = request.get_json() 
    print("Filtering track list")
    tracklist = data["tracklist"]
    track_filters = data["filters"]
    print("TRACKLIST1", tracklist)
    print(track_filters)

    filtered_tracks = [{"id":t['id'], "name":t['name'], "artist":t['artist']} for t in tracklist 
                                if t['danceability']>= track_filters["dancemin"] and t['danceability'] <=track_filters["dancemax"] \
                                and  t['energy']>= track_filters["energymin"] and t['energy'] <=track_filters["energymax"]  \
                                and  t['mode']>= track_filters["modemin"] and t['mode'] <= track_filters["modemax"] \
                                and  t['speechiness']>= track_filters["speechmin"] and t['speechiness'] <= track_filters["speechmax"] \
                                and  t['acousticness']>= track_filters["acoustmin"] and t['acousticness'] <=track_filters["acoustmax"] \
                                and  t['instrumentalness']>= track_filters["instmin"] and t['instrumentalness'] <= track_filters["instmax"] \
                                and  t['liveness']>= track_filters["livemin"] and t['liveness'] <= track_filters["livemax"] \
                                and  t['valence']>= track_filters["valmin"] and t['valence'] <= track_filters["valmax"] \
                                and  t['tempo']>= track_filters["tempmin"] and t['tempo'] <= track_filters["tempmax"] ]
    if len(filtered_tracks) !=0:
        print(filtered_tracks[0])
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
    port = int(os.environ.get("PORT", 33507))     
    app.run(host='0.0.0.0', port=port, debug=True)
    #app.run()