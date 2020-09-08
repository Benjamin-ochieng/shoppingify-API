import { merge } from 'lodash';
import { findAccount } from '../user.controller';
import setupReqRes from '../../../../test-reqRes-setup';
import User from '../user.model';

describe('userControler', () => {
  it('findAccount: return user profile', async () => {
    const user = await User.create({
      email: 'user123@gmail.com',
      password: 'user@one',
    });
    const { req, res, next } = setupReqRes();
    merge({ req, res, next }, { req: { user } });
    await findAccount(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    const [{ email }] = res.json.mock.calls[0];
    expect(email).toEqual(user.email);
  });
});
