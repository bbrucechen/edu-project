import queryString from 'querystring'

export default (req, res, next) => {
  // req.headers 可以拿到当前请求的请求报文头信息
  if (req.method.toLowerCase() === 'get') {
    return next()
  }

  // 带有文件的表单
  if(req.headers['content-type'].startsWith('multipart/form-data')) {
    return next();
  }

  // 普通表单
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', () => {
    req.body = queryString.parse(data)
    next()
  })
}
