const mapSongDBToModel = ({
  // eslint-disable-next-line camelcase
  album_id, ...restOfAttributes
}) => ({
  // eslint-disable-next-line camelcase
  albumId: album_id,
  ...restOfAttributes,
});

const mapAlbumDBToModel = ({
  // eslint-disable-next-line camelcase
  cover_url, ...restOfAttributes
}) => ({
  // eslint-disable-next-line camelcase
  coverUrl: cover_url,
  ...restOfAttributes,
});

module.exports = { mapSongDBToModel, mapAlbumDBToModel };
