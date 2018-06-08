import { isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Query: {
    card: isAuthenticatedResolver.createResolver((obj, { id }) =>
      models.Card.findById(id)),
    cards: isAuthenticatedResolver.createResolver(() =>
      models.Card.findAll()),
  },

  Mutation: {
    createCard: isAuthenticatedResolver
      .createResolver(async (obj, { input, operationCount }) => {
        const card = await models.Card.create(input);
        const operationsData = new Array(operationCount).fill(null).map((data, i) => ({
          code: i + 1,
          price: 0,
          cardId: card.dataValues.id,
        }));
        await models.Operation.bulkCreate(operationsData);
        return card;
      }),

    updateCard: isAuthenticatedResolver.createResolver(async (obj, { id, input }) => {
      const card = await models.Card.findById(id);
      return card.update(input);
    }),

    removeCard: isAuthenticatedResolver.createResolver(async (obj, { id }) => {
      const card = await models.Card.findById(id);
      return card.destroy();
    }),
  },

  Card: {
    operations(card) {
      return card.getOperations();
    },

    group(card) {
      return card.getGroup();
    },
  },
});
