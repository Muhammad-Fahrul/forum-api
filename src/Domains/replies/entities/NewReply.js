class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      content, owner, replayed_id,
    } = payload;
    this.content = content;
    this.owner = owner;
    this.replayed_id = replayed_id;
  }

  _verifyPayload({ content, owner, replayed_id }) {
    if (!content || !owner || !replayed_id) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof content !== 'string' || typeof owner !== 'string' || typeof replayed_id !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
