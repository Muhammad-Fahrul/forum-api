const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const GetReply = require('../../Domains/replies/entities/GetReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async isComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async addReply({
    content, owner, replayed_id,
  }) {
    const id = `reply-${this._idGenerator()}`;
    const date = `${new Date().toISOString()}`;
    const query = {
      text: 'INSERT INTO replies VALUES($1,$2,$3,$4,$5) RETURNING id, content, owner',
      values: [id, content, owner, replayed_id, date],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async verifyReplyOwner({ reply_id, owner }) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [reply_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    const reply = result.rows[0];

    if (reply.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses');
    }
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id = $2',
      values: [true, id],
    };

    await this._pool.query(query);
  }

  async getReplyByComment(id) {
    const query = {
      text: `SELECT replies.id, comments.id AS comment_id, 
            replies.is_delete, replies.content, 
            replies.date, replies.replayed_id, users.username 
            FROM replies 
            INNER JOIN comments ON replies.replayed_id = comments.id
            INNER JOIN users ON replies.owner = users.id
            WHERE comments.commented_id = $1
            ORDER BY date ASC`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows.map((payload) => (
      new GetReply({
        id: payload.id,
        username: payload.username,
        date: payload.date,
        content: payload.content,
        replayed_id: payload.replayed_id,
        isDelete: payload.is_delete,
      })
    ));
  }
}

module.exports = ReplyRepositoryPostgres;
