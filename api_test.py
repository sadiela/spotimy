from requests import put, get
import json

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}


### LIST DEVICES TEST ###
res1 = get('http://127.0.0.1:5000/authenticate/sadieiq694')
print(res1, res1.content.decode())

res2 = get('http://127.0.0.1:5000/user_playlists')
print(res2, res2.content.decode())

res3 = get('http://127.0.0.1:5000/playlist_tracks/sadieiq694/2I0tFWHjXJg81fLYTg3KWX')
#print(res3, res3.content.decode())

#print(res3.content.decode())
tracklist = res3.content.decode()
tracklist = json.loads(tracklist)

print(tracklist, type(tracklist))


res4 = get('http://127.0.0.1:5000/audio_features', data=json.dumps(tracklist), headers=headers)
print(res4, res4.content.decode())

tracklistfeat = res4.content.decode()
tracklistfeat = json.loads(tracklistfeat)
print("FIRST TRACK", tracklistfeat[0])

trackfilters = {
    "dancemin": 0,
    "dancemax": 0.5,
    "energymin": 0,
    "energymax": 0.5,
    "modemin": 0,
    "modemax": 1,
    "speechmin": 0,
    "speechmax": 1,
    "acoustmin": 0,
    "acoustmax": 1,
    "instmin": 0,
    "instmax": 1,
    "livemin": 0,
    "livemax": 1,
    "valmin": 0,
    "valmax": 1,
    "tempmin": 0,
    "tempmax": 500,
}

filtering_args = {
    "tracklist":tracklistfeat,
    "filters":trackfilters
}

res4 = get('http://127.0.0.1:5000/filter_tracks', data=json.dumps(filtering_args), headers=headers)
print(res4, res4.content.decode())

filtered_tracks = res4.content.decode()
filtered_tracks = json.loads(filtered_tracks)

create_data = {
    "track_ids": filtered_tracks,
    "playlist_name": "My new playlist!"
}

res4 = put('http://127.0.0.1:5000/create_playlist/sadieiq694', data=json.dumps(create_data), headers=headers)
print(res4, res4.content.decode())


'''
# login
# get playlist list
## PERFORM ADD TESTS (THREE VALID, TWO INVALID)
res1 = put('http://127.0.0.1:5000/admin/add_user', data=json.dumps(patient1), headers=headers)#.json()
print(res1,res1.content.decode())
res2 = put('http://127.0.0.1:5000/admin/add_user', data=json.dumps(patient2), headers=headers)#.json()
print(res1,res1.content.decode())
res3 = put('http://127.0.0.1:5000/admin/add_user', data=json.dumps(doctor1), headers=headers)#.json()
print(res1,res1.content.decode())
res4 = put('http://127.0.0.1:5000/admin/add_user', data=json.dumps(admin1), headers=headers)#.json()
print(res1,res1.content.decode())
res5 = put('http://127.0.0.1:5000/admin/add_user', data=json.dumps(invalid_user), headers=headers)#.json()
print(res1,res1.content.decode())


### ASSIGN DEVICES TEST ###
res06 = put('http://127.0.0.1:5000/admin/assign_device/def/0')
print(res06, res06.content.decode())
res006 = put('http://127.0.0.1:5000/admin/assign_device/jkl/0')
print(res006, res006.content.decode())

### LIST PATIENTS TEST ###
res7 = get('http://127.0.0.1:5000/admin/people/0')
print(res7, res7.content.decode())
res8 = get('http://127.0.0.1:5000/admin/patients/2')
print(res8, res8.content.decode())

### LIST DOCTORS TEST ###
res9 = get('http://127.0.0.1:5000/admin/people/1')
print(res9, res9.content.decode())
'''