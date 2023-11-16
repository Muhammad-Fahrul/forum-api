const GetComment = require('../../../Domains/comments/entities/GetComment');
const DetailsThread = require('../../../Domains/threads/entities/DetailsThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetDetailsThreadUseCase = require('../GetDetailsThreadUseCase');
const GetReply = require('../../../Domains/replies/entities/GetReply');

describe('GetDetailsUseCase', () => {
  it('should orchestrating get details action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockedDetailThread = new DetailsThread({
      id: 'thread-123',
      title: 'thread',
      body: 'thread',
      date: '2022-01-12T02:04:43.260Z',
      username: 'dicoding',
      comments: [],
    });

    const expectedComments = [
      new GetComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2022-01-12T03:48:30.111Z',
        replies: [],
        content: 'comment 1',
        isDelete: false,
      }),

      new GetComment({
        id: 'comment-456',
        username: 'fahrul',
        date: '2022-01-13T10:49:06.563Z',
        content: 'comment 2',
        replies: [],
        isDelete: true,
      }),
    ];

    const expectedReplies = [
      new GetReply({
        id: 'reply-123',
        username: 'fahrul',
        date: '2022-01-12T10:49:06.563Z',
        content: 'reply 1',
        replayed_id: 'comment-123',
        isDelete: true,
      }),
      new GetReply({
        id: 'reply-123',
        username: 'fahrul',
        date: '2022-01-13T10:49:06.563Z',
        content: 'reply 2',
        replayed_id: 'comment-456',
        isDelete: false,
      }),
    ];

    // filtering expectedRepAndCom

    const { replayed_id: replayedId1, ...filteredReply1 } = expectedReplies[0];
    const { replayed_id: replayedId2, ...filteredReply2 } = expectedReplies[1];

    const expectedRepAndCom = [
      { ...expectedComments[0], replies: filteredReply1[0] },
      { ...expectedComments[1], replies: filteredReply2[1] },
    ];

    /** creating dependency of use case */
    const mockedThreadRepository = new ThreadRepository();
    const mockedCommentRepository = new CommentRepository();
    const mockedReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockedCommentRepository.getComments = jest.fn(() => Promise.resolve(expectedComments));
    mockedReplyRepository.getReplyByComment = jest.fn(() => Promise.resolve(expectedReplies));
    mockedThreadRepository.getDetailsThread = jest.fn(() => Promise.resolve(mockedDetailThread));

    /** creating use case instance */
    const getDetailsThreadUseCase = new GetDetailsThreadUseCase({
      threadRepository: mockedThreadRepository,
      commentRepository: mockedCommentRepository,
      replyRepository: mockedReplyRepository,
    });

    getDetailsThreadUseCase._getRepliesComments = jest.fn(() => expectedRepAndCom);

    // Action
    const thread = await getDetailsThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockedCommentRepository.getComments).toBeCalledWith('thread-123');
    expect(mockedReplyRepository.getReplyByComment).toBeCalledWith('thread-123');
    expect(mockedThreadRepository.getDetailsThread).toBeCalledWith('thread-123');

    expect(getDetailsThreadUseCase._getRepliesComments)
      .toBeCalledWith(expectedComments, expectedReplies);
    expect(thread)
      .toEqual(new DetailsThread({
        ...mockedDetailThread,
        comments: expectedRepAndCom,
      }));
  });

  it('should operate the branching in the _getRepliesComments function properly', () => {
    // arrange
    const getThreadDetailUseCase = new GetDetailsThreadUseCase(
      { threadRepository: {}, commentRepository: {} },
    );
    const filteredComments = [
      {
        id: 'comment-123',
        username: 'user A',
        date: '2021',
        content: '**komentar telah dihapus**',
        replies: [],
      },
      {
        id: 'comment-456',
        username: 'user B',
        date: '2020',
        content: 'comment B',
        replies: [],
      },
    ];

    const retrievedReplies = [
      new GetReply({
        id: 'reply-123',
        replayed_id: 'comment-123',
        content: 'reply A',
        date: '2021',
        username: 'user C',
        isDeleted: true,
      }),
      new GetReply({
        id: 'reply-456',
        replayed_id: 'comment-456',
        content: 'reply B',
        date: '2021',
        username: 'user D',
        isDeleted: false,
      }),
    ];

    const {
      replayed_id: replayedIdReplyA,
      ...filteredReplyDetailsA
    } = retrievedReplies[0];
    const {
      replayed_id: replayedIdReplyB,
      ...filteredReplyDetailsB
    } = retrievedReplies[1];

    const expectedCommentsAndReplies = [
      { ...filteredComments[0], replies: [filteredReplyDetailsA] },
      { ...filteredComments[1], replies: [filteredReplyDetailsB] },
    ];

    const SpyGetRepliesForComments = jest.spyOn(getThreadDetailUseCase, '_getRepliesComments');

    // action
    getThreadDetailUseCase
      ._getRepliesComments(filteredComments, retrievedReplies);

    // assert
    expect(SpyGetRepliesForComments)
      .toReturnWith(expectedCommentsAndReplies);

    SpyGetRepliesForComments.mockClear();
  });
});
