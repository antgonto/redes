var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Modulos importados para la autenticacion con twitter
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
//Para la config de express, se solicita el modulo session
var session = require('express-session');

//Se define la strategy
passport.use(new Strategy({
    consumerKey: 'fx2AxgDTupTgwE0Yi7N2wpCXs', //Cambiar por su propio consumerkey (API key)
    consumerSecret: 'vkIeDL2gfH3FffHt1k8CGrt9VMWTYiVyGZIT8xo8gWVeefWUlk', //Cambiar por su propio consumerSecret (API secret key)
    callbackURL: 'http://localhost:3000/twitter/return' //Este URL es el destino que el OAuth tiene permiso para redirigirse luego del proceso de autenticacion.~ 
}, function(token, tokenSecret, profile, callback) {	//~Es importante identificar tu propio URL para que el OAuth reconozca el uRL specifico como valido.
    return callback(null, profile);
}));

//Se serealiza lo que se retorna desde Twitter
passport.serializeUser(function(user, callback) {
    callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
    callback(null, obj);
})

var app = express();

//ver configuración del motor
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Se debe descomentar después de colocar su favicon en / pública
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Se configura el modulo session
app.use(session({secret: 'whatever', resave: true, saveUninitialized: true}))

//Se declara que se usa passport
app.use(passport.initialize())
app.use(passport.session())

//Este es el GET request

app.get('/', function(req, res) {
    res.render('index', {user: req.user}) //Ese index el vista creada
})

//Se define el destino del URL que se puso en el index y que se vaya al servicio de autentificacion de Twitter
app.get('/twitter/login', 
	passport.authenticate('twitter'))

//Se define donde retorna luego de Twitter y que pasa si la autentifiacion no es correcta
app.get('/twitter/return', 
	passport.authenticate('twitter', {
    failureRedirect: '/'///Autenticacion fallida, redirije a la pagina principal.
}), function(req, res) {
    res.redirect('/') //Autenticacion exitosa, redirije a la pagina principal.
})

module.exports = app; 