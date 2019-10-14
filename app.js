var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//express session
var session = require("express-session")({
  secret:'keyboard cat',
  cookie :{800000}
});
//socket io
var iosession = require("express-socket.io-session")(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3000);
//socket 引入 iosession
io.use(isession);

io.on("connection",function(socket){
  socket.emit("msg_hand","链接成功");
  console.log("客户端链接成功");
  var temp_data='';

  socket.on("msg_return_client",function(data){
    console.log("收到回复:" + data +"创建时间("+ new Date()+")");
    temp_data = data;
    socket.emit("msg_return_server",temp_data,res=>console.log("响应成功"));
  })

})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
