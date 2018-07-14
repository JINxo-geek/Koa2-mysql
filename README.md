koa2和mysql形成的一个Demo.

这段代码内容虽然少，但是刚好能够让网页访问URL的时候，获取的sql数据库的内容了，刚开始的时候按照网上的一些教程把sql查询到的结果发送到浏览器一直失败，但是sql查询是成功的，后来知道参考了：https://chenshenhai.github.io/koa2-note/note/mysql/async.html
用async/await封装使用mysql后才成功让浏览器获取到了sql查询的结果，这里面应该和异步有关于。

以后再回来填坑。。。

--- 

新增跨域访问支持
```js
var cors = require('koa-cors');
app.use(cors());
```