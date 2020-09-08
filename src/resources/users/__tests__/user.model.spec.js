import User from '../user.model';

describe('User model', () => {
  it('creates a password hash', async () => {
    const request = {
      email: '123@gmail.com',
      password: 'jan1988',
    };
    const testUser = await User.create(request);
    expect(request.password).toEqual(
      expect.not.stringMatching(testUser.password),
    );
  });
});
