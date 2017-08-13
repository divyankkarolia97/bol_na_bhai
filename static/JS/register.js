$(function(){



    if($('#alert').html()=='username already exists'){
        $('#alertDiv').css('visibility',"");
    }



    $('#registrationForm').submit(function(event){
        event.preventDefault();


        if($('#name').val() == $('#username').val()){

            $('#alertDiv').css("visibility","");

            $('#alert').html('name and username should be different')
            return;
        }


        if($('#avatar').val() == ""){

            $('#alertDiv').css("visibility","");

            $('#alert').html('please choose a profile image')
            return;
        }

        var arr = $('#avatar').val().split('.');
        if( arr[arr.length-1] != 'jpg' && arr[arr.length-1] != 'png' && arr[arr.length-1] !='jpeg' ){

            $('#alertDiv').css('visibility',"");
            $('#alert').html('upload a valid image')
            return;

        }

        if($('#password').val() !== $('#passwordConfirmation').val()){
            $('#alertDiv').css('visibility',"");
            $('#alert').html('passwords dont match');
            return;

        }



        $('#registrationForm').unbind('submit').submit();


    })



})