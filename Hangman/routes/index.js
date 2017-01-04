var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        Atitle: 'Animal names',
        Ctitle: 'City names',
        Ftitle: 'Female names',
        Mtitle: 'Male names'
    });
});
router.post('/user', function (req, res, next) {
    var propNames = Object.keys(req.body);
    var names = req.app.datafile[propNames];
    var random = names[Math.floor(Math.random() * names.length)].toLowerCase();
    var underCount = function () {
        var under = new Array();
        for (var i = 0; i < random.length; i++) {
            under[i] = "_";
        }
        return under;
    };
    req.session.name = {
        word: random,
        underlines: underCount(),
        underNumber: random.length,
        usedletters: [],
        imagesShown:{
            img1: 'none',
            img2: 'none',
            img3: 'none',
            img4: 'none',
            img5: 'none',
            img6: 'none'
        },
        count : 0,
        alert: ""
    };
    res.redirect('vesalo');
    console.log(req.session);
});
//game is accesed
router.get('/vesalo', function (req, res, next) {
        res.render('user', {
            underlines: req.session.name.underlines,
            usedletters: req.session.name.usedletters,
            img1: req.session.name.imagesShown.img1,
            img2: req.session.name.imagesShown.img2,
            img3: req.session.name.imagesShown.img3,
            img4: req.session.name.imagesShown.img4,
            img5: req.session.name.imagesShown.img5,
            img6: req.session.name.imagesShown.img6,
            alert : req.session.name.alert
        });
});
router.post('/guess', function (req, res, next) {
    req.session.name.alert = '';
    var letter = req.body.letter;
    //is it a letter?
    if (!letter.match(/[a-z]/)) {
        req.session.name.alert = 'Please enter a letter!';
    } else {
        //has it been used?
        if (req.session.name.usedletters.indexOf(letter) >= 0) {
            req.session.name.alert = 'You already used that letter!';
        } else {
            req.session.name.usedletters.push(letter);
            if (req.session.name.word.indexOf(letter)>= 0){
                for (var i = 0; i < req.session.name.word.length; i++) {
                    if(req.session.name.word[i] == letter){
                        req.session.name.underlines[i] = letter;
                        req.session.name.underNumber--;
                        if (req.session.name.underNumber === 0){
                            res.redirect('gameover/won');
                            return;
                        }
                    }
                }
            }else{
                console.log('That letter isnt in the word');
                req.session.name.count++;
                if (req.session.name.count === 6){
                    res.redirect('gameover/lost');
                    return;
                }
                let lele = 'img' + req.session.name.count.toString();
                req.session.name.imagesShown[lele] = 'block';
            }
        }
    }
    //render the page
    res.render('user', {
        underlines: req.session.name.underlines,
        usedletters: req.session.name.usedletters,
        img1: req.session.name.imagesShown.img1,
        img2: req.session.name.imagesShown.img2,
        img3: req.session.name.imagesShown.img3,
        img4: req.session.name.imagesShown.img4,
        img5: req.session.name.imagesShown.img5,
        img6: req.session.name.imagesShown.img6,
        alert: req.session.name.alert
    });
});

router.get('/gameover/:id', function(req, res, next) {
    if (req.params.id == 'lost') {
        var str = 'Game over, you lose!';
        var wrd = 'The wanted word was ' + req.session.name.word;
    } else {
        var str = 'You won!';
        var wrd = 'The wanted word was ' + req.session.name.word + ', good job';
    }
    res.render('gameover', {
        title: str,
        word: wrd
    });
});
module.exports = router;
