Meteor.methods({
    getPlaylists:  function () {
        var spotifyApi = new SpotifyWebApi();

        var response =  spotifyApi.getUserPlaylists(Meteor.user().services.spotify.id, {limit: 30})
        
        if (checkTokenRefreshed(response, spotifyApi)) {
            var response =  spotifyApi.getUserPlaylists(Meteor.user().services.spotify.id, {})
        }
       
        return response.data.body.items;
    },
    getPlaylist: function (playlistId) {
        var spotifyApi = new SpotifyWebApi()


        var response = spotifyApi.getPlaylist(Meteor.user().services.spotify.id, playlistId, {})

        if (checkTokenRefreshed(response, spotifyApi)) {
            var response = spotifyApi.getPlaylist(Meteor.user().services.spotify.id, playlistId, {})
        }
        return response.data.body;
    },
     getPlaylistTracks: async function (playlistId) {
        var spotifyApi = new SpotifyWebApi()
        var response = await spotifyApi.getPlaylistTracks(Meteor.user().services.spotify.id, playlistId, {})
        if (checkTokenRefreshed(response, spotifyApi)) {
            var response = await spotifyApi.getPlaylistTracks(Meteor.user().services.spotify.id, playlistId, {})
        }
        return response.data;
    },
    getUser: function () {
        var spotifyApi = new SpotifyWebApi()
        var response = spotifyApi.getUser(Meteor.user().services.spotify.id)
        if (checkTokenRefreshed(response, spotifyApi)) {
            var response = spotifyApi.getUser(Meteor.user().services.spotify.id)
        }
        return response.data
    },
    getArtists: function (artistIds) {
        var spotifyApi = new SpotifyWebApi()
        var response = spotifyApi.getArtists(artistIds)
        if (checkTokenRefreshed(response, spotifyApi)) {
            var response = spotifyApi.getArtists(artistIds)
        }
        return response.data
    },
    createPlaylist: function(selectedTracks, playlistName) {
        if (!selectedTracks || !playlistName ) throw new Error("No tracks or playlist name specified");
        // Call
        var spotifyApi = new SpotifyWebApi();
        
        var response = spotifyApi.createPlaylist(Meteor.user().services.spotify.id, playlistName, { public: false });
        // Need to refresh token
        if (checkTokenRefreshed(response, spotifyApi)) {
          response = spotifyApi.createPlaylist(Meteor.user().services.spotify.id, playlistName, { public: false });
        }
    
        // Returns playlistUri
        return response.data.body;
      },
      addTracksToPlaylist: function (selectedTracks, playlistId) {
        if(!playlistId || !selectedTracks) throw new Error("No playlist ID or tracks specified");
        // Put songs into the playlist.
        var spotifyApi = new SpotifyWebApi();
        
        let uris = selectedTracks.map((track) => track.uri );

        var response = spotifyApi.addTracksToPlaylist(Meteor.user().services.spotify.id, playlistId, uris, {});
        if (checkTokenRefreshed(response, spotifyApi)) {
            response = spotifyApi.addTracksToPlaylist(Meteor.user().services.spotify.id, playlistId, uris, {});
        }
        
        return response.data.body;
          
      },
      createPlaylistAndAddTracks: function(selectedTracks, playlistName) {
        if (!selectedTracks || !playlistName) throw new Error("No tracks or playlist name specified");
    
        // Call
        var spotifyApi = new SpotifyWebApi();
        var response = spotifyApi.createPlaylist(Meteor.user().services.spotify.id, playlistName, { public: false });
    
        // Need to refresh token
        if (checkTokenRefreshed(response, spotifyApi)) {
          response = spotifyApi.createPlaylist(Meteor.user().services.spotify.id, playlistName, { public: false });
        }
    
        // Put songs into the playlist.
        var uris = selectedTracks.map(function(track) {
          return track.uri;
        });
        spotifyApi.addTracksToPlaylist(Meteor.user().services.spotify.id, response.data.body.id, uris, {});
    
        return response.data.body;
      },
      getPlaylistTracksAndMix: function(...playlistsIds){
        var spotifyApi = new SpotifyWebApi()
        var response = spotifyApi.getPlaylistTracks(Meteor.user().services.spotify.id, playlistsIds[0], {})
        if (checkTokenRefreshed(response, spotifyApi)) {
            response = spotifyApi.getPlaylistTracks(Meteor.user().services.spotify.id, playlistsIds[0], {})
        }
        
        let mix = [];
        playlistsIds.forEach(id => {
            var res = spotifyApi.getPlaylistTracks(Meteor.user().services.spotify.id, id, {});
            mix.push(...res.data.map(r => r.track));

        });

      
        return createRandom(mix);
    }

})

var checkTokenRefreshed = function (response, api) {
    
    
    if (response.error && response.error.statusCode === 401) {
        console.log("error");
        api.refreshAndUpdateAccessToken();
        return true;
    } else {
        return false;
    }
}

 var createRandom = function(nuevaPlaylist){
    const mixedPlaylist = [];
    let length = Math.floor(nuevaPlaylist.length / 2);
    const seen = new Set();
    while (length) {
      let index = Math.floor(Math.random() * nuevaPlaylist.length);  
      if(seen[nuevaPlaylist[index]]) continue;
      mixedPlaylist.push(nuevaPlaylist[index]);
      seen.add(nuevaPlaylist[index]);
      length--;
    }
    return mixedPlaylist;
  }