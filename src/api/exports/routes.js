const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: handler.postExportPlaylistSongsHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
];

module.exports = routes;
