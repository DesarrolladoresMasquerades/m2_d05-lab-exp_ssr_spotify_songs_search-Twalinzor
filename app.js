require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  console.log(req.query.searchArtist);
  spotifyApi
    .searchArtists(req.query.searchArtist)
    .then((data) => {
      const results = data.body.artists.items;
      console.log("The received data from the API: ", results);
      // console.log("Images: ", { results.images });
      res.render("artist-search-result", { resultslist: results });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId).then((albumsFromApi) => {
    res.render("albums", { albums: albumsFromApi.body.items });
  });
});

app.get("/tracks/:trackId", (req, res, next) => {
  const trackId = req.params.trackId;
  spotifyApi.getAlbumTracks(trackId).then((tracksFromApi) => {
    res.render("tracks", { tracks: tracksFromApi.body.items });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
