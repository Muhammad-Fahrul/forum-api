const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when the payload did not contain needed property', () => {
    const payload = {
      content: '',
      owner: 'user-123',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when the payload did not meet data type sepcification', () => {
    const payload = {
      content: 'this is comment',
      commented_id: 'thread-123',
      owner: 123,
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new comment correctly', () => {
    const payload = {
      content: 'this is comment',
      commented_id: 'thread-123',
      owner: 'user-123',
    };

    const newComment = new NewComment(payload);

    expect(newComment.content).toEqual(payload.content);
  });
});
