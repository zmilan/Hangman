var Hangman = (function () {
    let API = [];
    const Sbtn = $('#search');
    const underlinesH = $('#underlines');
    const usedLeetersH = $('#usedLeeters');
    const alertH = $('#alert');
    Sbtn.on('click', function () {
        API.postInfo();
        $('#textbox').val('');
    });
    API.postInfo = function () {
        let letter = $('#textbox').val();
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/guess',
            data: {letter: letter},
            success: function (data) {
                usedLeetersH.html(data.usedletters.join(','));
                underlinesH.html(data.underlines.join(' '));
                alertH.html(data.alert);
                if (data.count > 0) {
                    let num = $('#img' + data.count);
                    num.css('display', 'block');
                    if (data.count === 6) {
                        window.location.replace('gameover/lost');
                    }
                }
                if (data.status == 'won') {
                    window.location.replace('gameover/won');
                }
            },
        });
    }
})();