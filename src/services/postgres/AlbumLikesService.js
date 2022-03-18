const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikessService {
  constructor(cacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
  }

  async addAlbumLike({ userId, albumId }) {
    const id = `ua_like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Kesukaan album gagal ditambahkan');
    }

    await this.cacheService.delete(`album_likes:${albumId}`);
    return result.rows[0].id;
  }

  async getAlbumLikeCountByAlbumId(albumId) {
    try {
      return {
        likes: parseInt(await this.cacheService.get(`album_likes:${albumId}`), 10),
        isCache: true,
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*)::int AS likes FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this.pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Album tidak ditemukan');
      }

      const { likes } = result.rows[0];
      await this.cacheService.set(`album_likes:${albumId}`, likes);
      return {
        likes,
        isCache: false,
      };
    }
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kesukaan album gagal dihapus. Item tidak ditemukan');
    }

    await this.cacheService.delete(`album_likes:${albumId}`);
  }
}

module.exports = AlbumLikessService;
