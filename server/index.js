import logger from './utils/logger';
import app from './app';
import models from './models';

models.sequelize.sync({
  // force: true,
}).then(() => {
  app.listen(app.get('port'), () => {
    logger.info(
      '  App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env'),
    );
    logger.info('  Press CTRL-C to stop\n');
  });
});

