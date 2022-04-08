const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ActivitiesService {
  constructor() {
    this.pool = new Pool();
  }

  async addActivity({
    playlistId,
    songId,
    userId,
    action,
  }) {
    const id = `ps_activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Aktivitas gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getActivitiesByPlaylistId(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time FROM playlist_song_activities AS psa 
      LEFT JOIN songs AS s ON psa.song_id = s.id 
      LEFT JOIN users AS u ON psa.user_id = u.id 
      WHERE psa.playlist_id = $1 
      ORDER BY psa.time`,
      values: [playlistId],
    };
    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Aktivitas tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = ActivitiesService;
