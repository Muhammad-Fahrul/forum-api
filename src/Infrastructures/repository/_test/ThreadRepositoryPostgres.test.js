const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'thread',
        body: 'thread',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'thread',
        body: 'thread',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const threads = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(threads).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'thread',
        owner: 'user-123',
      }));
    });
  });

  describe('getDetailsThread', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect((threadRepositoryPostgres.getDetailsThread('thread-345'))).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread',
        body: 'thread',
        owner: 'user-123',
        date: '2022-01-12T02:04:43.260Z',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getDetailsThread('thread-123');

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'thread',
        body: 'thread',
        date: '2022-01-12T02:04:43.260Z',
        username: 'dicoding',
      });
    });
  });
});
