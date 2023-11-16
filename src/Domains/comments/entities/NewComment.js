class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      content, owner, commented_id,
    } = payload;
    this.content = content;
    this.owner = owner;
    this.commented_id = commented_id;
  }

  _verifyPayload({ content, owner, commented_id }) {
    if (!content || !owner || !commented_id) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof content !== 'string' || typeof owner !== 'string' || typeof commented_id !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
