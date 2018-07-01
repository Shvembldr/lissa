import app from '../app';
import { cards } from './queries';
import { getTokens, makeGraphQlQuery } from './utils';
import { TABLE_ROW_COUNT } from '../../client/src/constants';

describe('GraphQL Cards', () => {
  let tokens;
  beforeAll(async () => {
    tokens = await getTokens();
  });

  test('Get cards', async () => {
    const variables = {
      limit: TABLE_ROW_COUNT,
      offset: 0,
      match: '',
    };

    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: cards.getCards,
      variables,
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('cards');
    expect(data.cards).toHaveProperty('count');
    expect(data.cards).toHaveProperty('rows');
    expect(data.cards.rows).toHaveLength(TABLE_ROW_COUNT);
    expect(data.cards.rows[0]).toHaveProperty('id');
    expect(data.cards.rows[0]).toHaveProperty('vendorCode');
    expect(data.cards.rows[0]).toHaveProperty('operations');
    expect(data.cards.rows[0]).toHaveProperty('group');
  });
});
