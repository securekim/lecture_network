
var express     = require('express'),
    http        = require('http');
    app         = express();
    bodyParser  = require ("body-parser")

var server = http.createServer(app);
server.listen(80); //1024 이하의 포트는 특정 cap 권한이 필요합니다.

//web 폴더 밑에 있는 파일들을 요청이 있을때 접근 가능하도록 합니다.
app.use(express.static(__dirname + '/web')); 
app.use(bodyParser.json());
 
// 유저가 root 를 요청 했을 때, index.html 파일을 전송합니다.
app.get('/', function(req, res) {
    console.log("[Server] GET : /")
    res.send('Hi, Client, I am a server');
});
 
// 유저가 /post 로 body 에 value 를 담아 요청 했을 때, value 를 전송합니다.
app.post('/',(req,res)=>{
    console.log("[Server] POST : "+JSON.stringify(req.body))
    res.send(`post value is : `+req.body.Client+``)
})
 
// 유저가 /get/<value> 를 요청 했을 때, value 를 전송합니다.
app.get('/get/:value',(req,res)=>{
    res.send(`
            get value is : `+req.params.value+`
    `)
})
 

var io = require('socket.io')(server);
var roomName;

io.on('connection', function (socket) {
    console.log('connect');
    var instanceId = socket.id;

    socket.on('joinRoom',function (data) {
        console.log(data);
        socket.join(data.roomName);
        roomName = data.roomName;
    });

    socket.on('reqMsg', function (data) {
        console.log(data);
        io.sockets.in(roomName).emit('recMsg', {comment: instanceId + " : " + data.comment+'\n'});
    })
});
