import express from "express";
import Advert from "../models/advert.js";
import formidable from "formidable";
import path from "path";
import config from "../config.js";
// import mongodb from "mongodb";

// 创建路由容器
const router = express.Router();

/*// 配置数据库
const MongoClient = mongodb.MongoClient;
// 连接数据库
const url = "mongodb://localhost:27017";*/


/*router.post('/advert/add',(req,res) => {
	console.log(req.body);
	// 连接到url指定的数据库
	MongoClient.connect(url,(err,client) => {
		if(err) {
			return next(err);
		}
		// 操作数据库
		const db = client.db('edu');
		db.collection('adverts').insertOne(req.body,(err,result) => {
			if(err) {
				throw err;
			}
			res.json({
				err_code:0
			})
		})
		// 关闭连接
		client.close();
	})
})*/

router.get('/advert',(req,res,next) => {
	// Advert.find((err,data) => {
	// 	if(err) {
	// 		return next(err);
	// 	}
	// 	res.render("advert_list.html",{data});
	// })
	const page = Number.parseInt(req.query.page,10);
		Advert
		.find()
		.skip((page - 1) * 5)
		.limit(5)
		.exec((err,data) => {
		if(err) {
			return next(err);
		}
		console.log(data);
		Advert.count((err,count) => {
			if(err) {
				return next(err);
			}
			// 求出总页码
			const totalPage = Math.ceil(count / 5);
			res.render("advert_list.html",{data,totalPage,page});
		})
	})
})

router.get('/advert/add',(req,res,next) => {
	res.render('advert_add.html');
})

router.post('/advert/add',(req,res,next) => {
	// const body = req.body;
	const form = new formidable.IncomingForm();
	form.uploadDir = config.uploadDir;
	form.keepExtensions = true;
	form.parse(req,(err,fields,files) => {
			if(err) {
				return next(err);
			}
			const body = fields;
			body.image = path.basename(files.image.path);
			// body中将存储的图片信息传给image属性
			// files里的存储路径信息传给image
			const advert = new Advert({
				title:body.title,
				image:body.image,
				link:body.link,
				start_time:body.start_time,
				end_time:body.end_time
			});
			advert.save((err,data) => {
				if(err) {
					return next(err);
				}
				res.json({
					err_code:0
				})
			});
	})
	
})

router.get('/advert/list',(req,res,next) => {
	Advert.find((err,data) => {
		if(err) {
			return next(err);
		}
		res.json({
			err_code:0,
			result:data
		})
	})
})

// 获取某条广告数据
// /xxx/:yyy 是一个模糊匹配路径
// 能匹配任何/xxx/*形式的请求url
// 可以通过req.params获取匹配冒号的数据
router.get('/advert/one/:advertId',(req,res,next) => {
		Advert.findById(req.params.advertId,(err,data) => {
			if(err) {
				return next(err);
			}
			res.json(data);
		})
})

// 提交广告数据修改
router.post('/advert/edit',(req,res,next) => {
		const body = req.body;
		Advert.findById(req.body._id,(err,data) => {
			if(err) {
				return next(err);
			}
			data.title = body.title;
			data.image = body.image;
			data.link = body.link;
			data.start_time = body.start_time;
			data.end_time = body.end_time;
			data.last_modified = Date.now();
			// 这里的save不会新增数据，而是覆盖更新同个_id属性值的数据
			data.save((err,data) => {
				if(err) {
					return next(err);
				}
				res.json({
					err_code:0,
				})
			})
		})
})

// 删除广告数据
router.get('/advert/remove/:advertId',(req,res,next) => {
	console.log(req.params.advertId);
	Advert.remove({_id:req.params.advertId},err => {
		if(err) {
			return next(err);
		}
		res.json({
			err_code:0
		})
	})
})


export default router;

