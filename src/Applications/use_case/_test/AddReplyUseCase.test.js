const AddReplyUseCase = require('../AddReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');

describe('AddReplyUseCase', () => {
  it('should orchestracting the add reply function correctly', async () => {
    const useCasePayload = {
      content: 'reply',
      replayed_id: 'comment-123',
      owner: 'user-123',
    };

    const mockedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'reply',
      owner: 'user-123',
    });

    const mockedReplyRepisitory = new ReplyRepository();
    const mockedCommentRepisitory = new CommentRepository();

    mockedCommentRepisitory.isThread = jest.fn(() => Promise.resolve());
    mockedReplyRepisitory.isComment = jest.fn(() => Promise.resolve());
    mockedReplyRepisitory.addReply = jest.fn(() => Promise.resolve(mockedAddedReply));

    const getReplyUseCase = new AddReplyUseCase({
      replyRepository: mockedReplyRepisitory,
      commentRepository: mockedCommentRepisitory,
    });

    const addedReply = await getReplyUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: 'reply',
      owner: 'user-123',
    }));

    expect(mockedReplyRepisitory.isComment).toBeCalledWith(useCasePayload.replayed_id);
    expect(mockedReplyRepisitory.addReply).toBeCalledWith(new NewReply({
      content: useCasePayload.content,
      replayed_id: useCasePayload.replayed_id,
      owner: useCasePayload.owner,
    }));
  });
});
