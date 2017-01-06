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
        var underlines = function () {
            var array = new Array();
            for(let i = 0; i<random.length; i++){
                array[i] = '_';
            }
            return array;
        };
    req.session.name = {
        word: random,
        underlines: underlines(),
        underNumber: random.length,
        usedletters: [],
        count: 0,
        alert: "You can do it!"
    };
    res.redirect('vesalo');
});
//game is accesed
router.get('/vesalo', function (req, res) {
    res.render('user', {
        underlines: req.session.name.underlines.join(' '),
        usedletters: req.session.name.usedletters,
        alert: req.session.name.alert
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
            if (req.session.name.word.indexOf(letter) >= 0) {
                for (let i = 0; i < req.session.name.word.length; i++) {
                    if (req.session.name.word[i] == letter) {
                        req.session.name.underlines[i] = letter;
                        req.session.name.underNumber--;
                        if (req.session.name.underNumber === 0) {
                            req.session.name.status = 'won';
                        }
                    }
                }
            } else {
                req.session.name.alert = 'That letter isnt in the word!';
                req.session.name.count++;
            }
        }
    }
    res.send({
        underlines: req.session.name.underlines,
        usedletters: req.session.name.usedletters,
        alert: req.session.name.alert,
        count: req.session.name.count,
        status: req.session.name.status
    });

});
router.post('/gameover', function (req, res) {
    res.send(req.body.data);
});
router.get('/gameover/:id', function (req, res) {
    if (req.params.id == 'lost') {
        var str = 'Game over, you lose!';
        var wrd = 'The wanted word was ' + '\'' + req.session.name.word + '\'';
    } else if (req.params.id == 'won') {
        var str = 'You won!';
        var wrd = 'The wanted word was ' + '\'' + req.session.name.word + '\'' + ', good job';
    } else {
        return;
    }
    res.render('gameover', {
        title: str,
        word: wrd
    });
});
module.exports = router;
