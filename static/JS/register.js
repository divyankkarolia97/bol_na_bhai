$(function(){



    if($('#alert').html()=='username already exists'){
        $('#alertDiv').css('visibility',"");
    }



    $('#registrationForm').submit(function(event){
        event.preventDefault();


        if($('#email').val()<1){


            $('#alertDiv').css("visibility","");

            $('#alert').html('enter your email')
            return;

        }

        var x=$('#email').val().split('@');

        if(x.length<2){

            $('#alertDiv').css("visibility","");

            $('#alert').html('enter a valid email address')
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



        if($('#name').val() <1){

            $('#alertDiv').css("visibility","");

            $('#alert').html('enter your name')
            return;
        }


        if($('#username').val()<1){

            $('#alertDiv').css("visibility","");

            $('#alert').html('enter your username')
            return;
        }

        if($('#name').val() == $('#username').val()){

            $('#alertDiv').css("visibility","");

            $('#alert').html('name and username should be different')
            return;
        }

        if($('#password').val().length <8){
            $('#alertDiv').css('visibility',"");
            $('#alert').html('passwords should be atleast 8 lettters');
            $('#tipDiv').css('visibility',"");
            $('#tip').html('for security add numerals and special characters to your password');
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