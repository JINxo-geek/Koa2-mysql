koa2和mysql形成的一个Demo.

这段代码内容虽然少，但是刚好能够让网页访问URL的时候，获取的sql数据库的内容了，刚开始的时候按照网上的一些教程把sql查询到的结果发送到浏览器一直失败，但是sql查询是成功的，后来知道参考了：https://chenshenhai.github.io/koa2-note/note/mysql/async.html
用async/await封装使用mysql后才成功让浏览器获取到了sql查询的结果，这里面应该和异步有关于。

以后再回来填坑。。。

---

# 新增跨域访问支持

```js
var cors = require('koa-cors');
app.use(cors());
```
---

前端用axios传递表单

```js
    <el-dialog title="添加供货商" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="供货商编号" :label-width="formLabelWidth">
      <el-input v-model="form.supcode" auto-complete="off"></el-input>
    </el-form-item>
        <el-form-item label="供货商名称" :label-width="formLabelWidth">
      <el-input v-model="form.supname" auto-complete="off"></el-input>
    </el-form-item>
        <el-form-item label="供货商地址" :label-width="formLabelWidth">
      <el-input v-model="form.supadress" auto-complete="off"></el-input>
    </el-form-item>
            <el-form-item label="供货商电话" :label-width="formLabelWidth">
      <el-input v-model="form.supphone" auto-complete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="button" @click="fun3()">添加</el-button>
  </div>
</el-dialog>

```

methods

```js
fun3:function(){
this.dialogFormVisible = false;
this.axios.post('http://127.0.0.1:8080/insert',this.form)
.then(function() {
console.log("接受成功");
})
.catch(function(error) {
console.log(error);
});
}
```

后台代码

后台接受的

```js
router.post('/insert', async (ctx, next) => {
  console.log('接受数据');
  console.log(ctx.request.body);
  console.log(typeof ctx.request.body);
    console.log(ctx.request.body['supname']);
  var test2 = JSON.stringify(ctx.request.body)//将JS对象转成JSON 字符串
  console.log(typeof test2);
  var obj = JSON.parse(test2);//json转js对象
  console.log(typeof obj);
  console.log(test2);
  console.log(obj['supname']);
  ctx.body = ctx.request.body; 
});
```

![265](http://oocfz31zv.bkt.clouddn.com/265.jpg)

![266](http://oocfz31zv.bkt.clouddn.com/266.jpg)

![268](http://oocfz31zv.bkt.clouddn.com/268.jpg)

json和js对象的区别

https://blog.csdn.net/yeoman92/article/details/54924930
![269](http://oocfz31zv.bkt.clouddn.com/269.jpg)

```js
var obj2={};//这只是JS对象
var obj3={width:100,height:200};/*这跟JSON就更不沾边了,只是JS的对象 */
var obj4={'width':100,'height':200};/*这跟JSON就更不沾边了,只是JS的对象 */
var obj5={"width":100,"height":200,"name":"rose"}; /*我们可以把这个称做：JSON格式的JavaScript对象 */
var str1='{"width":100,"height":200,"name":"rose"}';/*我们可以把这个称做：JSON格式的字符串 */

var a=[
                {"width":100,"height":200,"name":"rose"},
                {"width":100,"height":200,"name":"rose"},
                {"width":100,"height":200,"name":"rose"},
        ];
        /*这个叫JSON格式的数组，是JSON的稍复杂一点的形式 */
var str2='['+
                '{"width":100,"height":200,"name":"rose"},'+
                '{"width":100,"height":200,"name":"rose"},'+
                '{"width":100,"height":200,"name":"rose"},'+
        ']' ;
        /*  这个叫稍复杂一点的JSON格式的字符串  */ 
```



用axios居然可以发送js对象???然后在后台`  ctx.body = ctx.request.body; `返回的是JSON？？？？

我发现应该是和下面这两个用来解析http请求体的有关

```js
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
app.use(koaBody());
app.use(bodyParser());
```

我尝试把它们注释掉看看结果。

```js
  console.log('接受数据');
  console.log(ctx.request.body);
  console.log(typeof ctx.request.body);
  supcode = ctx.request.body['supcode'];
  supname = ctx.request.body['supname'];
  supadress = ctx.request.body['supadress'];
  supphone = ctx.request.body['supphone'];
  
```



![270](http://oocfz31zv.bkt.clouddn.com/270.jpg)

果然不能读取到ctx.request中的内容了。

---

