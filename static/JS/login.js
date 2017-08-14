$(function(){


    $('#loginForm').submit(function(event){
        event.preventDefault();

    if( $('#username').val().length < 1){
        $('#tipDiv').css('visibility',"");

        $('#tip').html('enter your username');
        return;
    }

    if( $('#password').val().length < 1){
        $('#tipDiv').css('visibility',"");

        $('#tip').html('enter your password');
        return;
    }


    $.post('/verifyCreds',{username:$('#username').val(),password:$('#password').val()},function(data){

        if(data === 'username'){
            $('#alertDiv').css("visibility","");
            $('#alert').html('wrong username');

        }
        else if(data === 'password'){
            $('#alertDiv').css("visibility","");
            $('#alert').html('wrong password');

        }else{

            $('#loginForm').unbind('submit').submit();

        }



    })





    })



})