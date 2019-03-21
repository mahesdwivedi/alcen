var express = require('express');
var router = express.Router();
var flag = false;
const news = require('../models/notice');
const career = require('../models/careerSchema');
var linkifyHtml = require('linkifyjs/html');

/* GET home page. */
router.get('/', function(req, res, next) {
  var query = news.find({})
  query.select('title body');
  query.exec((err, data) => {
    res.render('index', {
      "datas": data
    });
  })
});

router.get('/Achievements', function(req, res, next) {
  res.render("Achievements");
})
router.get('/option', function(req, res, next) {
  session = req.session;
  if (session.uniqueID) {
    res.render('option');
  } else {
    {
      res.render('form');
    }
  }
});
router.get('/delete/:title', function(req, res, next) {

  var deleteTitle = req.params.title;
  news.deleteOne({
    title: deleteTitle
  }, function(err) {
    res.redirect('/');
  });
});
router.get('/careerdelete/:title', function(req, res, next) {
  var deleteTitle = req.params.title;
  career.deleteOne({
    careerTitle: deleteTitle
  }, function(err) {
    res.redirect('/career');
  });
});
router.get('/career', function(req, res, next) {
  var query = career.find({})
  query.select('careerTitle careerBody');
  query.exec((err, data) => {
    res.render('career', {
      "datas": data
    });
    //res.status(200).send(data)
  })
});


router.get('/aboutus', function(req, res, next) {
  res.render("aboutus1");
});
router.get('/career-test', function(req, res, next) {
  res.render("career-test");
});
router.get('/product', function(req, res, next) {
  res.render('product');
});
router.get('/f', function(req, res, next) {
  res.render('form');
});
router.get('/project', function(req, res, next) {
  res.render('project');
});
router.get('/details/:title', async function(req, res, next) {
  let session = req.session
  let title = req.params.title
  let datas = await news.find({
    title: title
  }, 'title body')
  let fulldata = await news.find({}, 'title body')
  if (session.uniqueID) {
    res.render('detail', {
      "datas": datas[0],
      "fulldata": fulldata,
      "flag": true
    })
  } else {
    res.render('detail', {
      "datas": datas[0],
      "fulldata": fulldata,
      "flag": false
    })
  }
});
router.get('/careerdetails/:title', async function(req, res, next) {
  try {
    let session = req.session
    let title = req.params.title
    let datas = await career.find({
      careerTitle: title
    }, 'careerTitle careerBody')
    let fulldata = await career.find({}, 'careerTitle careerBody')
    if (session.uniqueID) {
      res.render('careerdetail', {
        "datas": datas[0],
        "fulldata": fulldata,
        "flag": true
      })
    } else {
      res.render('careerdetail', {
        "datas": datas[0],
        "fulldata": fulldata,
        "flag": false
      })
    }
  } catch (err) {
    console.log(err);
  }
});
router.get('/login', function(req, res, next) {
  //  var flag = 0;
  res.render('login', {
    title: 'form',
    success: false,
    errors: req.session.errors,
  });
  req.session.errors = null;
});
router.post('/login', function(req, res, next) {
  let session = req.session;
  if (req.body.email == 'admin@xyz.com' && req.body.pass == 'admin') {
    session.uniqueID = req.body.email;
    flag = true;
  } else {
    flag = false;
  }
  res.redirect('redirect');
});
router.get('/redirect', function(req, res, next) {
  let session = req.session;
  if (session.uniqueID) {
    res.redirect('option');
  } else {
    {
      res.render('form');
    }
  }
});
router.get('/addnews', function(req, res, next) {
  let session = req.session;
  if (session.uniqueID) {
    res.render('add');
  } else {
    {
      res.render('form');
    }
  }
});
router.post('/enter', function(req, res) {
  let latestnews = new news(req.body);
  latestnews.save()
    .then(res.redirect('/option'))
    .catch((err) => console.log(err))
});
router.get('/addcareer', function(req, res, next) {
  let session = req.session;
  if (session.uniqueID) {
    res.render('careeradd');
  } else {
    {
      res.render('form');
    }
  }
});
router.post('/addcareer', function(req, res) {
  let newCareer = new career(req.body);
  newCareer.save()
    .then(res.redirect('/option'))
    .catch((err) => console.log(err))
});
module.exports = router;
