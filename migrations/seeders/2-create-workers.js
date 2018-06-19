import 'babel-polyfill';

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'Workers',
      [
        {
          code: 1,
          name: 'Елена',
          surname: 'Васильева',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: 2,
          name: 'Анна',
          surname: 'Селезнева',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: 3,
          name: 'Ольга',
          surname: 'Терентьева',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: 4,
          name: 'Анастасия',
          surname: 'Мышелов',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: 5,
          name: 'Ульяна',
          surname: 'Ленина',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: 6,
          name: 'Василиса',
          surname: 'Демченко',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: 7,
          name: 'Катерина',
          surname: 'Стоянова',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: 8,
          name: 'Ефросинья',
          surname: 'Жмых',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: 9,
          name: 'Ирина',
          surname: 'Каверина',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: 10,
          name: 'Беата',
          surname: 'Смирнова',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: 11,
          name: 'Фекла',
          surname: 'Литвинова',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: 12,
          name: 'Рената',
          surname: 'Щукина',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Workers', null, {});
  },
};
