var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        Atitle: 'Animal names',
        Ctitle: 'City names',
        Ftitle: 'Female names',
        Mtitle: 'Male names'
    });
});
router.post('/user', function (req, res) {
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
            img6: 'none'},
        count : 0,
        alert: "You can do it!",
        status: ''
    };
    res.redirect('vesalo');
    console.log(req.session);
});
//game is accesed
router.get('/vesalo', function (req, res) {
        res.render('user', {
            underlines: req.session.name.underlines,
            usedletters: req.session.name.usedletters,
            img1: req.session.name.imagesShown.img1,
            img2: req.session.name.imagesShown.img2,
            img3: req.session.name.imagesShown.img3,
            img4: req.session.name.imagesShown.img4,
            img5: req.session.name.imagesShown.img5,
            img6: req.session.name.imagesShown.img6,
            alert : req.session.name.alert,
            status: req.session.name.status
        });
});
router.post('/guess', function (req, res) {
    req.session.name.alert = 'You can do it!';
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
                            req.session.name.status = 'won';
                        }
                    }
                }
            }else{
                console.log('That letter isnt in the word');
                req.session.name.count++;
                if (req.session.name.count === 6){
                    req.session.name.status = 'lost';
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
            alert: req.session.name.alert,
            status: req.session.name.status
        });
});
router.post('/gameover', function(req,res) {
    res.send(req.body.data);
});
router.get('/gameover/:id', function(req, res) {
    if (req.params.id == 'lost') {
        var str = 'Game over, you lose!';
        var wrd = 'The wanted word was ' + '\'' + req.session.name.word + '\'';
    } else if (req.params.id == 'won'){
        var str = 'You won!';
        var wrd = 'The wanted word was ' + '\'' + req.session.name.word + '\'' + ', good job' ;
    }else{
        return;
    }
    res.render('gameover', {
        title: str,
        word: wrd
    });
});
module.exports = router;
