import mongodb from 'mongodb';
export default (errLog,req,res,next) => {
  // 将错误日志记录到数据库并发送响应信息
	// {错误名称，错误信息，错误堆栈，错误发生时间}
	const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017";
	MongoClient.connect(url,(err,client) => {
		if(err) {
			return next(err);
		}
		// 操作数据库
		const db = client.db('edu');
		db.collection('error_logs').insertOne({
			name: errLog.name,
			message:errLog.messgae,
			stack:errLog.stack,
			time:new Date()
		},(err,result) => {
			res.json({
				err_code:500,
				message:errLog.message
			})
		})
		// 关闭连接
		client.close();
	})
}