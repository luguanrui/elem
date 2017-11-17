const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');// 路由插件
const router = new Router();

const appData = require('./data.json');
const seller = appData.seller;
const goods = appData.goods;
const ratings= appData.ratings;


router.get('/api/seller',function (ctx) {
  ctx.body = seller;
});


router.get('/api/goods',function (ctx) {
  ctx.body = goods
});

router.get('/api/ratings',function (ctx) {
  ctx.body = ratings
});



app.use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
