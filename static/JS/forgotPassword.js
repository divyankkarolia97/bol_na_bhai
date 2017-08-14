
$(function(){


    $('#forgotPasswordForm').submit(function(event){

        event.preventDefault();


            if($('#email').val().length<1){
                $('#alertDiv').css("visibility","");
                $('#alert').html('enter your email');
                return;
            }
            $.post('/verifyEmail',{email:$('#email').val()},function(data){
                if(data === 'false'){
                    $('#alertDiv').css("visibility","");
                    $('#alert').html('enter a valid email');
                }
                else{
                    $('#forgotPasswordForm').unbind('submit').submit();
                }

            })






    })


})