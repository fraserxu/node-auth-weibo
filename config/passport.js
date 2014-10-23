var LocalStrategy = require('passport-local').Strategy
var WeiboStrategy = require('passport-weibo').Strategy

var User = require('../app/models/user')

var configAuth = require('./auth')

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user)
    })
  })

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.email': email}, function(err, user) {
        if (err)
          return done(err)

        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
        } else {
          var newUser = new User()
          newUser.local.email = email
          newUser.local.password = newUser.generateHash(password)

          newUser.save(function(err) {
            if (err)
              throw err

            return done(null, newUser)
          })
        }
      })
    })
  }))

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    User.findOne({ 'local.email': email}, function(err, user) {
      if (err)
        return done(err)

      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.'))

      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))

      return done(null, user)
    })
  }))

  passport.use(new WeiboStrategy({
    clientID: configAuth.weiboAuth.appkey,
    clientSecret: configAuth.weiboAuth.secret,
    callbackURL: configAuth.weiboAuth.oauth_callback_url,
    passReqToCallback: true
  }, function(req, token, refreshToken, profile, done) {

      process.nextTick(function () {
        if (!req.user) {
          User.findOne({ 'weibo.id': profile.id }, function(err, user) {
            if (err)
              return done(err)

            if (user) {
              if (!user.weibo.token) {
                user.weibo.token = token
                user.weibo.name = profile.name

                user.save(function(err) {
                  if (err)
                    throw err

                  return done(null, user)
                })
              }

              return done(null, user)
            } else {
              var newUser = new User()

              newUser.weibo.id    = profile.id
              newUser.weibo.token = token
              newUser.weibo.name  = profile.displayName

              newUser.save(function(err) {
                if (err)
                  throw err

                return done(null, newUser)
              })
            }
          })
        } else {
          var user = req.user

          user.weibo.id = profile.id
          user.weibo.token = token
          user.weibo.name = profile.displayName

          user.save(function(err) {
            if (err)
              throw err

            return done(null, user)
          })
        }
      });
    }
  ))
}


