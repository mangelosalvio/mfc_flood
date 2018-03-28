const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var express = require('express');
var router = express.Router();
var moment = require('moment');
const Log = require('../models/Log')
const User = require('../models/User')


function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
		err.status = 401;
		return res.redirect('/login');
    //return next(err);
  }
}


/* GET home page. */
router.get('/', requiresLogin ,function(req, res, next) {

	
	var filter = {};

	if (req.query.from_date) {

		var from_date = moment(req.query.from_date);
		var to_date = moment(req.query.to_date);

		to_date.add(1,'day').subtract(1,'minute');

		filter = {
			current_time : { '$gte' : from_date.format('YYYY-MM-DD'), '$lte' : to_date.format('YYYY-MM-DD HH:mm:ss') }
		};
	}
	
	const logs = Log.find(filter).sort({ current_time : -1 }).limit(100).exec().then((logs) => {
		res.render('index', { title: 'Express', logs : logs, from_date : req.query.from_date, to_date : req.query.to_date });
	}, (err) => {
		throw err
	})
});

/**
 * Get Login Page
 */
router.post('/login', [
		check('username')
			.isLength({ min : 1 }).withMessage('Username is required'),
		check('password')
			.isLength({ min : 1 }).withMessage('Password is required'),
	] ,function(req, res, next) {
		var user = new User({
			username : req.body.username
		});

		const errors = validationResult(req);

		if ( !errors.isEmpty() ) {
			res.status(401);
			res.render('login', { user, errors : errors.mapped() });
		} else {
			/**
			 * Check login of User here
			 */
			User.authenticate(req.body.username, req.body.password, (error, user) => {
				if ( error || !user ) {
					var err = new Error("Wrong email or password");
					err.status = 401;

					return res.render('login',{errors : { password : { msg : 'Invalid Username and Password' }  }})
					return next(err);
				} else {
					req.session.userId = user._id;
					return res.redirect('/');
				}
				
			});
		}
		

	// confirm that user typed same password twice
	/* if (req.body.password !== req.body.passwordConf) {
		var err = new Error('Passwords do not match.');
		err.status = 400;
		res.send("passwords dont match");
		return next(err);
	} */
	
	/* if (req.body.email &&
	req.body.username &&
	req.body.password &&
	req.body.passwordConf) {

		var userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			passwordConf: req.body.passwordConf,
		}
	
		User.create(userData, function (error, user) {
			if (error) {
			return next(error);
			} else {
			req.session.userId = user._id;
			return res.redirect('/profile');
			}
		});

	} else if (req.body.logemail && req.body.logpassword) {
		User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
			if (error || !user) {
			var err = new Error('Wrong email or password.');
			err.status = 401;
			return next(err);
			} else {
			req.session.userId = user._id;
			return res.redirect('/profile');
			}
		});
	} else {
		var err = new Error('All fields required.');
		err.status = 400;
		return next(err);
	} */
});

router.get('/login', function(req, res, next) {

	
	var msg = {
		success_message : req.flash('success_message')
	}

	return res.render('login', { errors : {}, msg })
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
	if (req.session) {
	  // delete session object
	  req.session.destroy(function (err) {
		if (err) {
		  return next(err);
		} else {
		  return res.redirect('/');
		}
	  });
	}
  });


module.exports = router;
