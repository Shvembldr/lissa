import { isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Query: {
    card: isAuthenticatedResolver.createResolver((obj, { id }) => models.Card.findById(id)),

    cardsMatch: isAuthenticatedResolver.createResolver((obj, { match }) => models.Card.findAll({
      order: [['id', 'ASC']],
      where: {
        vendorCode: {
          $like: `%${match}`,
        },
      },
    })),

    cards: isAuthenticatedResolver.createResolver(
      async (obj, {
        match, filters, limit, offset,
      }) => {
        const groups = await models.Group.findAll({ raw: true });
        const groupIds = groups.map(group => group.id);
        return models.Card.findAndCountAll({
          order: [['id', 'DESC']],
          where: {
            vendorCode: {
              $like: `${match}%`,
            },
            groupId: {
              $any: filters && filters.length > 0 ? filters.map(id => parseInt(id, 10)) : groupIds,
            },
          },
          limit: limit || 8,
          offset: offset || 0,
        });
      },
    ),
  },

  Mutation: {
    createCard: isAuthenticatedResolver.createResolver(async (obj, { input, operationCount }) => {
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
      await card.setGroup(input.groupId);
      return card.update(input);
    }),

    removeCard: isAuthenticatedResolver.createResolver(async (obj, { id }) => {
      const card = await models.Card.findById(id);
      return card.destroy();
    }),

    removeCards: isAuthenticatedResolver.createResolver(async (obj, { ids }) => {
      const cards = ids.map(id => models.Card.findById(id));
      const resolvedCards = await Promise.all(cards);
      const cardsToDestroy = resolvedCards.map(card => card.destroy());
      await Promise.all(cardsToDestroy);
      return ids;
    }),
  },

  Card: {
    operations(card) {
      return card.getOperations({
        order: [['id', 'ASC']],
      });
    },

    group(card) {
      return card.getGroup();
    },
  },
});
