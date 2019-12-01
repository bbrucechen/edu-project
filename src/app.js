import express from 'express';
import config from './config.js';
import nunjucks from 'nunjucks';
import bodyParser from './middleware/body-parser.js';
import indexRouter from './routers/index.js';
import advertRouter from './routers/advert.js';
import errlog from './middleware/err_log.js';
const app = express();

// nunjucks没有对文件名后缀名做限制
// nunjucks模板引擎的配置	
nunjucks.configure(config.viewPath,{
	autoescape: true,
	express: app,
	// nunjucks 默认会缓存输出过文件
	// 不缓存方便调试页面，否则刷新时不会响应html文件的修改
	noCache:true
})
app.use('/node_modules',express.static(config.nodePath));
app.use('/public',express.static(config.publicPath));
// post请求主题解析中间件
app.use(bodyParser);
// 路由中间件
app.use(indexRouter);
app.use(advertRouter);
// 错误处理中间件
app.use(errlog);

app.listen(3000,() => {
	console.log('running...');
})