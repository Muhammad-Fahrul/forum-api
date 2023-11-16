const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('isThread', () => {
    it('should throw NotFoundError when the thread is not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.isThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not to throw invariantError when the thread is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.isThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addComment', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'this is comment',
        owner: 'user-123',
        commented_id: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'this is comment',
        owner: 'user-123',
        commented_id: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      const comment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(comment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'this is comment',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw NotFoundError when the comment is not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner({ id: 'comment-123', owner: 'user-123' }))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not to throw NotFoundError when the comment is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner({ id: 'comment-123', owner: 'user-123' }))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when the owner is not authorize', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner({ id: 'comment-123', owner: 'user-xxx' }))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not to throw AuthorizationError when the is authorize', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner({ id: 'comment-123', owner: 'user-123' }))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment', () => {
    it('should update the is_delete property to true (soft delete)', async () => {
      const idComment = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await commentRepositoryPostgres.deleteComment(idComment);

      const comment = await CommentTableTestHelper.findCommentById('comment-123');
      expect(comment[0].is_delete).toEqual(true);
    });
  });

  describe('getComment', () => {
    it('should return comments selected correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2022-01-12T03:48:30.111Z',
        content: 'this is comment',
        isDelete: false,
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-456',
        username: 'fahrul',
        date: '2022-01-13T10:49:06.563Z',
        content: '**komentar telah dihapus**',
        isDelete: true,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getComments('thread-123');

      expect(comments).toHaveLength(2);
    });
  });
});
