class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, content, date, isDelete, replies,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({
    id, username, content, date, replies,
  }) {
    if (!id || !username || !content || !date || !replies) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || typeof date !== 'string' || !(Array.isArray(replies))) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = GetComment;
