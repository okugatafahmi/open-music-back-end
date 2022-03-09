const mapSongDBToModel = ({
  // eslint-disable-next-line camelcase
  album_id, ...restOfAttributes
}) => ({
  // eslint-disable-next-line camelcase
  albumId: album_id,
  ...restOfAttributes,
});

module.exports = { mapSongDBToModel };
