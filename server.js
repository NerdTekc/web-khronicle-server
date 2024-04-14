require('dotenv').config()
const axios = require('axios')
const path = require('path');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

/* Express Routers */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authenticationRouter = require('./routes/authentication/authentication');

const server = express();

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

server.use('/', indexRouter);
server.use('/api/users', usersRouter);
server.use('/api/auth', authenticationRouter);

module.exports = server;
