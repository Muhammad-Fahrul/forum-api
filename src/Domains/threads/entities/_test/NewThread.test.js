const NewTread = require('../NewThread');

describe('a NewTread entities', () => {
  it('should throw error when the payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'thread',
      body: 'thread',
    };

    // Actions and Assert
    expect(() => new NewTread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when the payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: true,
      body: 'thread',
      owner: 'user-123',
    };

    // Actions and Assert
    expect(() => new NewTread(payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'thread',
      body: 'thread',
      owner: 'user-123',
    };

    // Action
    const newThread = new NewTread(payload);

    // Assert
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
