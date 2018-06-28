import 'babel-polyfill';
import { encrypt } from '../../server/utils/encrypt';
import { USER_ROLE } from '../../server/constants';

module.exports = {
  async up(queryInterface) {
    const userPass = await encrypt.hash('user');
    const adminPass = await encrypt.hash('admin');
    return queryInterface.bulkInsert(
      'Users',
      new Array(1)
        .fill(null)
        .map(() => ({
          name: 'user',
          email: 'user@user.com',
          role: USER_ROLE.USER,
          password: userPass,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
        .concat({
          name: 'admin',
          email: 'admin@admin.com',
          role: USER_ROLE.ADMIN,
          password: adminPass,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      {},
    );
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
