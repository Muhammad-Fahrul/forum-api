const GetReply = require('../GetReply');

describe('GetReply entities', () => {
  it('should throw error whent the payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      content: 'this is reply',
      date: '2021-08-08T07:59:48.766Z',
    };

    expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error whent the payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      content: 'this is reply',
      date: '2021-08-08T07:59:48.766Z',
      username: 123,
      replayed_id: '123',
      isDelete: true,
    };

    expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create get reply correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'this is reply',
      date: '2021-08-08T07:59:48.766Z',
      username: 'dicoding',
      replayed_id: 'comment-123',
      isDelete: false,
    };

    const getReply = new GetReply(payload);

    expect(getReply.id).toEqual(payload.id);
    expect(getReply.content).toEqual(payload.content);
    expect(getReply.date).toEqual(payload.date);
    expect(getReply.replayed_id).toEqual(payload.replayed_id);
    expect(getReply.username).toEqual(payload.username);
  });

  it('should create GetReply object correctly when value isDelete is true', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'fahrul',
      date: '2022-01-13T10:49:06.563Z',
      content: 'test content',
      replayed_id: 'comment-123',
      isDelete: true,
    };

    // Action
    const getReply = new GetReply(payload);

    // Assert
    expect(getReply.id).toEqual(payload.id);
    expect(getReply.username).toEqual(payload.username);
    expect(getReply.date).toEqual(payload.date);
    expect(getReply.replayed_id).toEqual(payload.replayed_id);
    expect(getReply.content).toEqual('**balasan telah dihapus**');
  });
});
