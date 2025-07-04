import { User, Session } from '../models';
const crypto = require('crypto');

const getUserSession = async (rawToken: string): Promise<Session | null> => {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  return await Session.findOne({ where: { tokenHash } });
};

const getUser = async (userId: number): Promise<User | null> => {
  return await User.findByPk(userId, {
    attributes: ['user_id', 'email', 'createdAt', 'firstName', 'lastName'],
  });
};

module.exports = {
  getUserSession,
  getUser,
};
