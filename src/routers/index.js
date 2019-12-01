import express from "express";
import * as indexController from '../controllers/index.js';

const router = express.Router();

// 渲染首页
router
	.get('/',indexController.showIndex)


export default router;