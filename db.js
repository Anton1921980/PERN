const { Sequelize } = require( 'sequelize' );

process.env.NODE_ENV="production";

DATABASE_URL='postgres://qgilefayctavim:5027d2cb19434db55904e0c1091723fd34c68839ec0957861fec416d3c2ce34f@ec2-3-222-11-129.compute-1.amazonaws.com:5432/d7jnu23kq4nunb'

module.exports = new Sequelize(
    DATABASE_URL,
    { 
        dialect: "postgres",
        ssl: true, 
        dialectOptions: {
          ssl: true
        }
      }
)


// module.exports = new Sequelize( process.env.NODE_ENV === "production" ?
    
//        DATABASE_URL
//      :
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         dialect: 'postgres',
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//     }

// )