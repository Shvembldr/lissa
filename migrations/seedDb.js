import { spawn } from 'child_process';
import { sequelize } from '../server/models';

const spawnOptions = { stdio: 'inherit' };

(async () => {
  try {
    await sequelize.sync({ force: true });
  } catch (err) {
    console.log('*************************');
    console.log('Sync failed. Error:', err.message);
    process.exit(1);
  }
  try {
    const seed = await spawn('./node_modules/.bin/sequelize', ['db:seed:all'], spawnOptions);
    console.log('*************************');
    console.log('Seeding successful');
    seed.on('close', () => {
      process.exit(0);
    });
  } catch (err) {
    console.log('*************************');
    console.log('Seeding failed. Error:', err.message);
    process.exit(1);
  }
})();
