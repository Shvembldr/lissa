import { USER_ROLE } from '../constants';
import { createTokens } from '../auth';

const user = {
  id: 1,
  role: USER_ROLE.USER,
};

const admin = {
  id: 2,
  role: USER_ROLE.ADMIN,
};

const getTokens = async () => {
  const adminTokens = await createTokens(admin);
  const userTokens = await createTokens(user);
  return {
    adminTokens,
    userTokens,
  };
};

export default getTokens;
