var inp = $("#q").val();
if (inp !== '' && inp !== undefined){
    postdata(inp);
}
function postdata(lele) {
    $.ajax({
        type:'POST',
        url: 'http://localhost:3000/gameover',
        data: {data:lele},
        success: function (where) {
            window.location.replace('gameover/' + where);
        },
        /*complete: function() {

        }*/
    });
}