const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();


const pool = new Pool({
    user: process.env.dbuser,
    host: process.env.dbhostname,
    database: process.env.db,
    password: process.env.dbpassword,
    port: process.env.dbport,
    search_path: 'users'
  });




  const query = async(query,values)=>{


    return new Promise((resolve,reject)=>{
        pool.query({text:query,values}, (error, results) => {
            if (error) {
              console.error(error,'<--');
             reject(error)
            }
             resolve(results);
             //pool.end();
          });
    })
  

  }





  module.exports = query;