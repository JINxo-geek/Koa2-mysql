const http = require('http');
const koa = require('koa');
const etag = require('koa-etag');
const bodyParser = require('koa-bodyparser');
const errorHandler = require('koa-error');
const compress = require('koa-compress');
const log = global.console.log.bind(console);
const PORT = process.env.PORT || 8080;
const koaBody = require('koa-body');
const app = new koa();
const Utils = require('./utils');
const Tips = require('./utils/tip');
var mysql = require('mysql');
const router = require('koa-router')();
app.use(koaBody());
app.use(bodyParser());
/* var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    port: '3306',
    database: 'world',
}); */

const pool = mysql.createPool({
  host     :  '127.0.0.1',
  user     :  'root',
  password :  'admin',
    port: '3306',
  database :  'world'
});
let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}
let tmp;
async function selectAllData( ) {
  let sql = 'SELECT * FROM websites';
  let dataList = await query( sql )
  return dataList
}

async function getData() {
  let dataList = await selectAllData();
  console.log( dataList );
  tmp = dataList[0]['id'];
}

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await getData();
ctx.response.body = tmp;


    await next();
});

// add url-route:
router.get('/hello/:name', async (ctx, next) => {
    var name = ctx.params.name;
    
});

router.get('/', async (ctx, next) => {
/*    ctx.response.body = '<h1>Index</h1>';  */

});

/* router.get('/search',async(ctx,next)=>{


var sql = 'SELECT * FROM websites';
//查

var tmp;
await connection.query(sql, function (err, result) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
    }

    console.log('--------------------------SELECT----------------------------');
    console.log(result);

console.log(JSON.stringify(result));
tmp = JSON.stringify(result);
    console.log('------------------------------------------------------------\n\n');
  
console.log('tmp:'+tmp);

});
   ctx.body = tmp; 


    log('访问'); 


 

}); */
  
// add router middleware:
app.use(router.routes());

app.listen(PORT);
console.log('app started at port 8080...');

log('server is running on port: %s', PORT);