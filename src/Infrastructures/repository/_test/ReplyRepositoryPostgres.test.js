const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadTableTestHelper.addThread({ id: 'thread-123' });
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('isComment', () => {
    it('should throw NotFoundError when comment is not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.isComment('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not to throw NotFoundError when comment is not found', async () => {
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.isComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addReply', () => {
    it('should persist new reply and return added reply correctly', async () => {
      const newReply = new NewReply({
        content: 'reply',
        owner: 'user-123',
        replayed_id: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await CommentTableTestHelper.addComment({ id: 'comment-123', commented_id: 'thread-123' });
      await replyRepositoryPostgres.addReply(newReply);

      const reply = await ReplyTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      const newReply = new NewReply({
        content: 'reply',
        owner: 'user-123',
        replayed_id: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await CommentTableTestHelper.addComment({ id: 'comment-123', commented_id: 'thread-123' });
      const reply = await replyRepositoryPostgres.addReply(newReply);

      expect(reply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'reply',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyReplyOwner', () => {
    it('should throw NotFoundError when the reply is not found', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepository.verifyReplyOwner({ reply_id: 'reply-123', owner: 'user-123' })).rejects.toThrowError(NotFoundError);
    });

    it('should not to throw NotFoundError when the reply is not found', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      await expect(replyRepository.verifyReplyOwner({ reply_id: 'reply-123', owner: 'user-123' })).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteReply', () => {
    it('should update the is_delete property to true (soft delete)', async () => {
      const reply_id = 'reply-123';
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123' });

      await replyRepository.deleteReply(reply_id);

      const reply = await ReplyTableTestHelper.findReplyById('reply-123');
      expect(reply[0].is_delete).toEqual(true);
    });
  });

  describe('getReplyByComment', () => {
    it('should return selected reply correctly', async () => {
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      await ReplyTableTestHelper.addReply({
        id: 'reply-123',
        replayed_id: 'comment-123',
        date: '2022-01-12T03:48:30.111Z',
      });

      await ReplyTableTestHelper.addReply({
        id: 'reply-456',
        replayed_id: 'comment-123',
        date: '2022-01-13T10:49:06.563Z',
        content: '**balasan telah dihapus**',
        isDelete: true,
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepository.getReplyByComment('thread-123');

      expect(replies).toHaveLength(2);
    });
  });
});
