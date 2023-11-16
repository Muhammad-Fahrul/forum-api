const DetailsThread = require('../DetailsThread');
const GetComment = require('../../../comments/entities/GetComment');
const GetReply = require('../../../replies/entities/GetReply');

describe('DetailsThread entities', () => {
  it('should Throw error when the payload not contain needed property', () => {
    const payload = {
      id: 'thread-123',
    };

    expect(() => new DetailsThread(payload)).toThrowError('DETAILS_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should Throw error when the payload not meet data type property', () => {
    const payload = {
      id: 123,
      title: 'test title',
      body: {},
      date: '2022-01-12T02:04:43.260Z',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new DetailsThread(payload)).toThrowError('DETAILS_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailsThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'test title',
      body: 'test body',
      date: '2022-01-12T02:04:43.260Z',
      username: 'dicoding',
      comments: [
        {
          ...new GetComment({
            id: 'comment-123',
            username: 'dicoding',
            date: '2022-01-12T03:48:30.111Z',
            replies: [],
            content: 'comment 1',
            isDelete: false,
          }),
          replies: [
            new GetReply({
              id: 'reply-123',
              username: 'fahrul',
              date: '2022-01-12T10:49:06.563Z',
              content: 'reply 1',
              replayed_id: 'comment-123',
              isDelete: true,
            }),
          ],
        },
        {
          ...new GetComment({
            id: 'comment-456',
            username: 'fahrul',
            date: '2022-01-13T10:49:06.563Z',
            replies: [],
            content: 'comment 2',
            isDelete: true,
          }),
          replies: [
            new GetReply({
              id: 'reply-123',
              username: 'fahrul',
              date: '2022-01-13T10:49:06.563Z',
              content: 'reply 2',
              replayed_id: 'comment-456',
              isDelete: false,
            }),
          ],
        },
      ],
    };

    const expectedComments = [
      {
        ...new GetComment({
          id: 'comment-123',
          username: 'dicoding',
          date: '2022-01-12T03:48:30.111Z',
          replies: [],
          content: 'comment 1',
          isDelete: false,
        }),
        replies: [
          new GetReply({
            id: 'reply-123',
            username: 'fahrul',
            date: '2022-01-12T10:49:06.563Z',
            content: 'reply 1',
            replayed_id: 'comment-123',
            isDelete: true,
          }),
        ],
      },
      {
        ...new GetComment({
          id: 'comment-456',
          username: 'fahrul',
          date: '2022-01-13T10:49:06.563Z',
          replies: [],
          content: 'comment 2',
          isDelete: true,
        }),
        replies: [
          new GetReply({
            id: 'reply-123',
            username: 'fahrul',
            date: '2022-01-13T10:49:06.563Z',
            content: 'reply 2',
            replayed_id: 'comment-456',
            isDelete: false,
          }),
        ],
      },
    ];

    // Action
    const detailsThread = new DetailsThread(payload);

    // Assert
    expect(detailsThread.id).toEqual(payload.id);
    expect(detailsThread.title).toEqual(payload.title);
    expect(detailsThread.body).toEqual(payload.body);
    expect(detailsThread.date).toEqual(payload.date);
    expect(detailsThread.username).toEqual(payload.username);
    expect(detailsThread.comments).toEqual(expectedComments);
    expect(detailsThread.comments[0].replies[0]).toEqual(expectedComments[0].replies[0]);
  });

  it('should create DetailsThread object correctly with empyt comment', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'test title',
      body: 'test body',
      date: '2022-01-12T02:04:43.260Z',
      username: 'dicoding',
      comments: [],
    };

    // Action
    const detailsThread = new DetailsThread(payload);

    // Assert
    expect(detailsThread.id).toEqual(payload.id);
    expect(detailsThread.title).toEqual(payload.title);
    expect(detailsThread.body).toEqual(payload.body);
    expect(detailsThread.date).toEqual(payload.date);
    expect(detailsThread.username).toEqual(payload.username);
    expect(detailsThread.comments).toEqual(payload.comments);
  });
});
