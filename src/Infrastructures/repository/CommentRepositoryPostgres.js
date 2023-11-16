const AddedComment = require('../../Domains/comments/entities/AddedComment');
const GetComment = require('../../Domains/comments/entities/GetComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async isThread(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async addComment({ content, owner, commented_id }) {
    const id = `comment-${this._idGenerator()}`;
    const date = `${new Date().toISOString()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1,$2,$3,$4,$5) RETURNING id, content, owner',
      values: [id, content, owner, commented_id, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentOwner({ id, owner }) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: [true, id],
    };

    await this._pool.query(query);
  }

  async getComments(threadId) {
    const query = {
      text: 'SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete FROM comments LEFT JOIN users ON comments.owner = users.id WHERE comments.commented_id = $1 ORDER BY comments.date ASC',
      values: [threadId],
    };

    const comments = await this._pool.query(query);

    return comments.rows.map((payload) => (
      new GetComment({
        id: payload.id,
        username: payload.username,
        date: payload.date,
        replies: [],
        content: payload.content,
        isDelete: payload.is_delete,
      })
    ));
  }
}

module.exports = CommentRepositoryPostgres;
