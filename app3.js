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
var cors = require('koa-cors');
const router = require('koa-router')();
app.use(cors());
app.use(koaBody());
app.use(bodyParser());

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin',
    port: '3306',
    database: 'hospital'
});
//封装mysql
let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}
let tmp;
//获取数据
async function selectAllData() {
    let sql = 'SELECT * FROM supplier';
    let dataList = await query(sql)
    return dataList
}

async function getData() {
    let dataList = await selectAllData();
    console.log(dataList);
    tmp = dataList;
}
//插入数据
async function selectAllData2() {
    let sql = 'INSERT INTO supplier(`Supnumber`, `Supname`, `Supadress`, `Supphone`,`Subnumber_auto`) VALUES (?, ?, ? , ?,0)';
    let values = ['s17', 'test4', 'test4', 'test6'];
    let dataList = await query(sql, values);
    return dataList
}

async function insert() {
    let dataList = await selectAllData2();
    console.log(dataList);
    tmp = dataList;
}
//添加供货商
async function insersper() {
    let sql = 'INSERT INTO supplier(`Supnumber`, `Supname`, `Supadress`, `Supphone`,`Subnumber_auto`) VALUES (?, ?, ? , ?,0)';
    let values = [supcode, supname, supadress, supphone];
    let dataList = await query(sql, values);
    return dataList
}

async function insertsper2() {
    let dataList = await insersper();
    console.log(dataList);
    tmp = dataList;
}
//删除供货商
async function deletesper() {
    let sql = `DELETE FROM supplier WHERE ( Supnumber = '${duspcode}' )`;
    console.log(sql);
    let dataList = await query(sql);
    return dataList
}

async function deletesper2() {
    let dataList = await deletesper();
    console.log(dataList);
    tmp = dataList;
}


//路由
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// add url-route:


router.get('/', async (ctx, next) => {
    /*    ctx.response.body = '<h1>Index</h1>';  */
});

router.get('/search', async (ctx, next) => {
    await getData();
    ctx.response.body = tmp;
});

/* router.get('/insert',async (ctx, next) => {
await insert();
  ctx.response.body = 1;

});
 */
let supcode, supname, supadress, supphone;
router.post('/insert', async (ctx, next) => {
    console.log('接受数据');
    console.log(ctx.request.body);
    console.log(typeof ctx.request.body);
    supcode = ctx.request.body['supcode'];
    supname = ctx.request.body['supname'];
    supadress = ctx.request.body['supadress'];
    supphone = ctx.request.body['supphone'];

    ctx.body = ctx.request.body;
    await insertsper2();

});
//删除供货商路由
let dsupcode;
router.post('/despur', async (ctx, netx) => {
    console.log('删除供货商' + ctx.request.body['Supnumber']);
    duspcode = ctx.request.body['Supnumber'];
    await deletesper2();
    ctx.response.body = '删除成功';
})


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