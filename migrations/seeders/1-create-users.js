import 'babel-polyfill';
import dotenv from 'dotenv';
import { encrypt } from '../../server/utils/encrypt';
import { USER_ROLE } from '../../server/constants';

dotenv.config();

module.exports = {
  async up(queryInterface) {
    queryInterface.bulkDelete('Users', null, {});
    const userPass = await encrypt.hash(process.env.USER_PASS);
    const adminPass = await encrypt.hash(process.env.ADMIN_PASS);
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
          updatedAt: new Date()
        }))
        .concat({
          name: 'admin',
          email: 'admin@admin.com',
          role: USER_ROLE.ADMIN,
          password: adminPass,
          createdAt: new Date(),
          updatedAt: new Date()
        }),
      {}
    );
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
