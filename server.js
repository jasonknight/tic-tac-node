const http = require('http')
const port = 8080

const router = function (req,resp) {
	console.log(req.url)
	resp.end('Hello world');
}

const server = http.createServer(router);

server.listen(port,function (err) {
	if ( err ) {
		console.log(err);
	} else {
		console.log('server listening on http://localhost:' + port);
	}
});
