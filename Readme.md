# Lissa Tabs

## Приложение для учета произведенного товара и зарплаты сотрудников

### Запуск сервера (dev)
```
npm run dev
```

### Демо

[Demo-Lissa](https://demo-lissa.herokuapp.com/)


## Сервер

* Node Js
* Express
* Apollo
* Sequelize/PostgreSQL
* JWT Authorization

## Клиент

* React 16.4
* React Apollo
* Recharts
* Ant Design

## Инфраструктура

Сервер и клиент расположены в одном репозитории, при разработке для взаимодействия с сервером
используется proxy в package.json клиента. Клиент и сервер запускаются одновременно при помощи
concurrently. Проект залит на heroku, при деплое запускается сборка клиента в папку build
и сервер раздает из нее статику.

Использован babel-node(babel-cli (env, stage-2) для сервера, чтобы иметь возможность пользоваться  ES6.
Для линтинга и код-стайла подключен lint-staged/husky с prettier и eslint c правилами ['react-app', 'airbnb-base']

Для рандомных данных на сервере сделаны миграции с помощью sequlize-cli

## Описание

Приложение сделано под заказ для небольшого предприятия, занимающегося пошивом одежды.
Предназначение: удобство при вводе данных о пошиве изделия, расчет зарплаты сотрудников и статистика.

### [Логин](https://demo-lissa.herokuapp.com/login)
```
email: admin@admin.com
```
```
pass: admin
```

Админ с полным доступом ко всем функциям

```
email: user@user.com
```
```
pass: user
```

Юзер с ограниченным функционалом.  Функционал ограничен как на сервере, так и на клиенте. Возможна
гибкая настройка любого количества пользователей с любыми правами.

### [Изделия](https://demo-lissa.herokuapp.com/cards)

Страница с таблицей изделий и возможностью добавлять новые. Необходимо ввести артикул изделия, затем
выбрать группу из выпадающего списка (группы добавляются на соответствующей странице) и количество
операций. После добавления, новое изделие будет первым в списке, необходимо нажать на "+" и внести
количество минут затрачиваемых на каждую операцию. В случае ввода неверных данных любую строку таблицы
можно изменить и сохранить. Каждая страница таблицы подгружается с сервера, чтобы не грузить большое
количество данных при инициализации и использовании фильтров.
Реализован гибкий фильтр: поиск по артикулу (по первым символам) и фильтрация по группам
Существующие строки таблицы можно удобно удалять, выделяя по несколько штук

### [Группы](https://demo-lissa.herokuapp.com/groups)

Страница с таблицей групп изделий и возможностью их добавления, а так же редактирования и удаления
существующих

### [Сотрудники](https://demo-lissa.herokuapp.com/workers)

Страница с таблицей сотрудников и возможностью их добавления, а так же редактирования и удаления
существующих

### [Заказчики](https://demo-lissa.herokuapp.com/customers)

Страница с таблицей заказчиков продукции и возможностью их добавления, а так же редактирования и удаления
существующих

### [Продукция](https://demo-lissa.herokuapp.com/production)

Наиболее часто используемая таблица с выпускаемой продукцией. При добавлении выбирается артикул изделия
(реализован выпадающий список с живым поиском по последним цифрам артикула (просьба заказчика)),
выбирается заказчик из выпадающего списка (из соответствующей таблицы), размер изделия, количество
произведенных единиц товара и дата. Добавленная продукция появляется первой в списке, при нажатии на
 "+", раскрывается список операций (из таблицы изделий), в который нужно внести код сотрудника (из
 таблицы сотрудников).
Все строки таблицы редактируются и удаляются. Реализована фильтрация аналогичная таблице изделий, а
также дополнительная фильтрация по периоду времени.

### [Отчет](https://demo-lissa.herokuapp.com/reports)

Страница отчетов. Справа - возможность выбрать общий для всех отчетов период времени.

* Отчет по сотрудникам
Количество выработанных минут на данный период времени. В раскрывающемся списке подробный отчет по
каждому изделию.

* Отчет по изделиям
Количество произведенных изделий по артикулам и количество затраченных на них минут

* Графики
Визуальный отчет по количеству произведенных изделий и усердия сотрудников


