#Import Library
from flask import Flask, request, jsonify # , session
import spotipy
from spotipy import util
from spotipy.oauth2 import SpotifyClientCredentials 
#import json
#from env_info import *
import os

app = Flask(__name__, static_folder='./spotify-playlist-frontend/build', static_url_path='/')

@app.route('/', methods=["GET"])
def index():
    print("Hello")
    return app.send_static_file('index.html')

@app.route('/user_playlists/<token>', methods=["GET"])
def get_playlist_ids(token):
    session = spotipy.Spotify(auth=token)
    response = session.current_user_playlists(limit=50, offset=0)
    total = response["total"]
    print("ALL PLAYLISTS:", total)
    results = response["items"]

    while len(results) < total:
        print(len(results))
        response = session.current_user_playlists(limit=50, offset=len(results))
        results.extend(response["items"])
    print(len(results))

    playlists = []
    for r in results:
        cur_obj = {}
        cur_obj["id"] = r["id"]
        cur_obj["name"] = r["name"]
        playlists.append(cur_obj)
    return jsonify(playlists)


# playlist_tracks(playlist_id, fields=None, limit=100, offset=0, market=None, additional_types=('track', ))

def playlist_track_info_no_features(playlistid, fields, limit, session):
    response = session.playlist_tracks(playlistid, fields=fields, limit=limit)
    total_songs = session.playlist_tracks(playlistid, fields="total", limit=limit)
    total = total_songs['total']
    results = response['items']

    # subsequently runs until it hits the user-defined limit or has read all songs in the library
    while len(results) < total:
        print(len(results))
        response = session.playlist_tracks(playlistid, fields="items.track(name,id,artists(name))", limit=100, offset=len(results))
        results.extend(response["items"])
    print(len(results))
    return results

def tracklist_audio_features(track_list, session):
    res = []
    while len(res) < len(track_list):
        print(len(res))
        id_str = ""
        for i in range(len(res), len(res)+100):
            if i > len(track_list)-1:
                break
            id_str += track_list[i]["track"]["id"] + ','
        id_str = id_str[:-1]
        response = session.audio_features(id_str)
        res.extend(response)

    print("RESULT LENGTH", len(res))
    full_res = []
    for (s, r) in zip(track_list, res):
        print("Looping")
        r["artist"] =  s["track"]["artists"][0]["name"]
        r["name"] =  s["track"]["name"]
        full_res.append(r)
    print(len(full_res))
    return full_res

# get list of tracks for a playlist
@app.route('/playlist_tracks/<playlistid>/<token>', methods=["GET"])
def user_playlist_tracks_full(playlistid, token):
    session = spotipy.Spotify(auth=token)
    results = playlist_track_info_no_features(playlistid, "items.track(name,id,artists(name))", 100, session)
    return jsonify(results)

# get audio features for a list of tracks
@app.route('/audio_features/<token>', methods=["GET", "POST"])
def get_audio_features_full(token):
    session = spotipy.Spotify(auth=token)
    if request.is_json: # check data is in correct format
        print("JSON REQUEST")
        track_list = request.get_json() 
        print(track_list)
        full_res = tracklist_audio_features(track_list, session)
        return jsonify(full_res)
    else: 
        print("NO JSON DATA PASSED")
        return 500

# get list of tracks WITH audio features for a playlist
@app.route('/playlist_tracks_features/<playlistid>/<token>', methods=["GET", "POST"])
def user_playlist_tracks_with_features(playlistid,token):
    session = spotipy.Spotify(auth=token)
    print("Getting tracklist")
    track_list = playlist_track_info_no_features(playlistid, "items.track(name,id,artists(name))", 100, session)
    print("GETTING FEATURES")
    full_res = tracklist_audio_features(track_list, session)
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

@app.route('/create_playlist/<user>/<token>', methods=["POST", "PUT", "GET"])
def create_playlist(user, token):
    session = spotipy.Spotify(auth=token)
    print("CREATING PLAYLIST")
    if request.is_json: # check data is in correct format
        data = request.get_json() 
    print("Filtering track list")
    playlist_name = data["playlist_name"]
    track_ids = data["track_ids"]

    playlist_create = session.user_playlist_create(user, playlist_name, public=True, collaborative=False, description='')
    print(playlist_create)

    playlist_info = session.playlist(playlist_create['id'])
    playlist_link = playlist_info["external_urls"]["spotify"]
    print("PLAYLIST INFO!!!", playlist_info)
    print(track_ids[0])
    if(len(track_ids) <= 100):
        session.user_playlist_add_tracks(user, playlist_create['id'],track_ids)
    else: 
        offset=0
        while offset+100 < len(track_ids):
            session.user_playlist_add_tracks(user, playlist_create['id'],track_ids[offset:offset+100])
            offset = offset+100
        session.user_playlist_add_tracks(user, playlist_create['id'],track_ids[offset:])

    playlist_return = {
        'id': playlist_create['id'],
        'link': playlist_link
    }
    
    return playlist_return

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 33507))     
    app.run(host='0.0.0.0', port=port, debug=True)
    #app.run(debug=True)