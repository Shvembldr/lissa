import { spawn } from 'child_process';
import { sequelize } from '../server/models/index';

const spawnOptions = { stdio: 'inherit' };

(async () => {
  try {
    await sequelize.sync();
    const unSeed = await spawn('./node_modules/.bin/sequelize', ['db:seed:undo:all'], spawnOptions);
    console.log('*************************');
    console.log('UnSeeding successful');
    unSeed.on('close', () => {
      process.exit(0);
    });
  } catch (err) {
    console.log('*************************');
    console.log('UnSeeding failed. Error:', err.message);
    process.exit(1);
  }
})();
