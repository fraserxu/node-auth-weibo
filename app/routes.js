module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index.ejs')
  })

  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') })
  })

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  })

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user
    })
  })

  app.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
  })

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }))

  app.get('/auth/weibo', passport.authenticate('weibo'))

  app.get('/auth/weibo/callback', passport.authenticate('weibo', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))

  app.get('/connect/local', function(req, res) {
    res.render('connect-local.ejs', { message: req.flash('loginMessage')})
  })

  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/connect/local',
    failureFlash: true
  }))

  app.get('/connect/weibo', passport.authorize('weibo'))
  app.get('/connect/weibo/callback', passport.authorize('weibo', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))

  app.get('/unlink/local', function(req, res) {
    var user = req.user
    user.local.email = undefined
    user.local.password = undefined
    user.save(function(err) {
      res.redirect('/profile')
    })
  })

  app.get('/unlink/weibo', function(req, res) {
    var user = req.user
    user.weibo.token = undefined
    user.save(function(err) {
      res.redirect('/profile')
    })
  })
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next()

  res.redirect('/')
}
