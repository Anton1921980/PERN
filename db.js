const { Sequelize } = require( 'sequelize' );

// DATABASE_URL = 'postgres://qgilefayctavim:5027d2cb19434db55904e0c1091723fd34c68839ec0957861fec416d3c2ce34f@ec2-3-222-11-129.compute-1.amazonaws.com:5432/d7jnu23kq4nunb'
// DATABASE_URL = 'postgres://lisxsnui:qnUaUZZXwRpaaDADZMOgkTu_dM6eHRKV@abul.db.elephantsql.com/lisxsnui' 
//проблема с heroku была в адресах запросов на localhost5000 их надо поменять на / и записать в  proxy в client/package.json 
//  перенос таблицы в heroku : 
// подключить сервер heroku в pgadmin там найти базу и сделать backup таблиц с локального сервера и restore всех таблиц по одной на сервер heroku 
//в хероку версия 13.4 попробовать сделать дамп открыть в этой версии и оттуда загрузить
//порт 5432 поменять и перезапустить сервис
// pg_ctl -D "C:/Program Files/PostgreSQL/14/data" status
// $  pg_ctl -D "C:/Program Files/PostgreSQL/14/data"  stop
// $  pg_ctl -D "C:/Program Files/PostgreSQL/14/data"  start

//heroku pg:reset postgresql-spherical-02694
//PGUSER=postgres PGPASSWORD=anton192 heroku pg:push online_store2 postgresql-spherical-02694 --app idevice-pern
// console.log("DATABASE_URL: ",process.env.DATABASE_URL);
// const sequelize = new Sequelize('postgres://admin:admin@localhost:5432/mydb', {
//   dialectModule: require('pg')
// });
const sequelize = new Sequelize(process.env.DATABASE_URL,
    {
  dialectModule: require('pg')
});
module.exports = new Sequelize(
    process.env.DATABASE_URL,
    
    {
        dialect: "postgres",        
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // <<<<<<< YOU NEED THIS
            }
        },
        // dialectModule: require('pg')
    } )
  