class GetReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, content, date, username, isDelete, replayed_id,
    } = payload;
    this.id = id;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.username = username;
    this.replayed_id = replayed_id;
  }

  _verifyPayload({
    id, content, date, username, replayed_id,
  }) {
    if (!id || !content || !date || !username || !replayed_id) {
      throw new Error('GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof replayed_id !== 'string') {
      throw new Error('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetReply;
