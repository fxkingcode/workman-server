const flash = require('connect-flash');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config(); //.env 설정

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const { sequelize } = require('./models');
sequelize.sync();
const prod = process.env.NODE_ENV === 'production';


const app = express();

app.set('port', process.env.PORT || 3000); //포트 설정
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(flash()); //1회성 메세지
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => { 
  res.send('workman 백엔드 정상 동작!');
});

//라우터 주소 설정
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);



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

app.listen(prod ? app.get('port') : 3000, () => {
  console.log('info', `${app.get('port')}번 포트에서 서버 실행중입니다.`);
});

module.exports = app;
