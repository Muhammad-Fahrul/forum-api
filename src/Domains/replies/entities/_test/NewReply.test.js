const NewReply = require('../NewReply');

describe('a NewReply entities', () => {
  it('should throw error when the payload did not contain needed property', () => {
    const payload = {
      content: '',
      owner: 'user-123',
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when the payload did not meet data type sepcification', () => {
    const payload = {
      content: 'this is reply',
      replayed_id: 'comment-123',
      owner: 123,
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new comment correctly', () => {
    const payload = {
      content: 'this is reply',
      replayed_id: 'comment-123',
      owner: 'user-123',
    };

    const newReply = new NewReply(payload);

    expect(newReply.content).toEqual(payload.content);
  });
});
