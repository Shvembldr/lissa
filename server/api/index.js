import express from 'express';
import logger from '../utils/logger';
import models from '../models';

const router = express.Router();

router.post('/report', async (req, res) => {
  const { dateRange, report } = req.body;

  if (report === 'workers') {
    try {
      const workers = await models.Worker.findAll({
        include: {
          model: models.Operation,
          required: true,
          include: {
            model: models.Product,
            where: {
              date: {
                $between: dateRange,
              },
            },
          },
        },
        order: [['code', 'ASC'], [{ model: models.Operation }, 'id', 'ASC']],
      });

      const report = workers.map(worker => ({
        Код: worker.dataValues.code,
        Имя: worker.dataValues.name,
        Фамилия: worker.dataValues.surname,
        'Количество минут': worker.dataValues.Operations.reduce(
          (acc, operation) => acc + operation.price * operation.dataValues.Product.count,
          0,
        ),
      }));

      res.send(report);
    } catch (e) {
      logger.error(e);
      res.sendStatus(500);
    }
  } else {
    try {
      const products = await models.Product.findAll({
        order: [['id', 'DESC']],
        where: {
          date: {
            $between: dateRange,
          },
        },
        include: {
          model: models.Operation,
        },
      });

      const productsHash = products.reduce((acc, product) => {
        const { vendorCode, count, Operations } = product.dataValues;

        if (!acc[vendorCode]) {
          acc[vendorCode] = {
            count: 0,
            price: Operations.reduce((sum, op) => sum + op.dataValues.price, 0),
          };
        }
        acc[vendorCode].count += count;
        acc[vendorCode].sum = acc[vendorCode].count * acc[vendorCode].price;

        return acc;
      }, {});

      const result = {
        report: Object.keys(productsHash).map(key => ({
          Код: key,
          Количество: productsHash[key].count,
          Цена: productsHash[key].price,
          Сумма: productsHash[key].sum,
        })),
      };

      res.send(result.report);
    } catch (e) {
      logger.error(e);
      res.sendStatus(500);
    }
  }
});

router.get('/report', (req, res) => {
  res.csv([{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }], true);
});

export default router;
