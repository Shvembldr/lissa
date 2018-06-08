import 'babel-polyfill';
import { encrypt } from '../../server/utils/encrypt';

module.exports = {
  async up(queryInterface) {
    let hashPasswords;
    const paswords = await new Array(1).fill(null).map(async () =>
      encrypt.hash('user}'));
    const adminPass = await encrypt.hash('admin');
    await Promise.all(paswords).then(passes => (hashPasswords = passes));
    return queryInterface.bulkInsert(
      'Users',
      new Array(1)
        .fill(null)
        .map((val, index) => ({
          name: 'user',
          email: 'user@user.com',
          password: hashPasswords[index],
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
        .concat({
          name: 'admin',
          email: 'admin@admin.com',
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

