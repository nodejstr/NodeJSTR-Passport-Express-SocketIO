$(function () {
    var socket = io.connect();
    socket.on('heartbeat', function () {
        console.log('heartbeat')
        statusChanged(true)
    });

    socket.on('connected', function () {
        statusChanged(true)
    });

    socket.on('data', function (data) {
        statusChanged(true)
        counter()
        $('#log').prepend('<strong>@'+data.user.screen_name + '</strong> :' + data.text + '<br/>')
    });

    socket.on('error', function (data) {
        statusChanged(false)
        $('#log').prepend(JSON.stringify(data))
    });

    function setCounter(count) {
        console.log('asdada' + count)
        $('#count').text(count)
    }

    function statusChanged(value) {
        if (!!value) {
            $('#startStop').html('<i class="icon-ok icon-large icon-white"></i> On Live')
            $('#startStop').removeClass('btn-danger btn-info').addClass('btn-success')
        } else {
            $('#startStop').html('<i class="icon-off icon-large icon-white"></i> Offline')
            $('#startStop').removeClass('btn-success btn-info').addClass('btn-danger')
        }
    }

    $('#startStop').bind('click', function () {
        console.log('Engine Started')
        socket.emit('startengine', {
            track: $('#trackKeys').val(),
            id:    $('#userId').text()
        })
    })
});

function counter()
{
    $('#count').text(parseInt($('#count').text())+1)
}