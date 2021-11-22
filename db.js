const { Sequelize } = require( 'sequelize' );

// process.env.NODE_ENV = "production";

DATABASE_URL = 'postgres://qgilefayctavim:5027d2cb19434db55904e0c1091723fd34c68839ec0957861fec416d3c2ce34f@ec2-3-222-11-129.compute-1.amazonaws.com:5432/d7jnu23kq4nunb'
// DATABASE_URL = 'postgres://lisxsnui:qnUaUZZXwRpaaDADZMOgkTu_dM6eHRKV@abul.db.elephantsql.com/lisxsnui' 
//проблема с heroku была в адресах запросов на localhost5000 их надо поменять на / и записать в  proxy в client/package.json 
//  перенос таблицы в heroku : 
// подключить сервер heroku в pgadmin там найти базу и сделать backup таблиц с локального сервера и restore всех таблиц по одной на сервер heroku 25 листопада 15.15 солом зал 09.08  суддя писана тамила
//в хероку версия 13.4 попробовать сделать дамп открыть в этой версии и оттуда загрузить
//порт 5432 поменять и перезапустить сервис
// pg_ctl -D "C:/Program Files/PostgreSQL/14/data" status
// $  pg_ctl -D "C:/Program Files/PostgreSQL/14/data"  stop
// $  pg_ctl -D "C:/Program Files/PostgreSQL/14/data"  start

//heroku pg:reset postgresql-spherical-02694
//PGUSER=postgres PGPASSWORD=anton192 heroku pg:push online_store2 postgresql-spherical-02694 --app idevice-pern

process.env.NODE_ENV === "production" ?
module.exports = new Sequelize(
     DATABASE_URL,
    {
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // <<<<<<< YOU NEED THIS
            }
        },
    } )
    :
    module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }

)

// module.exports = new Sequelize(
//     DATABASE_URL,
//     {
//         dialect: "postgres",
//         dialectOptions: {
//             ssl: {
//                 require: true,
//                 rejectUnauthorized: false // <<<<<<< YOU NEED THIS
//             }
//         },
//     }
// )
