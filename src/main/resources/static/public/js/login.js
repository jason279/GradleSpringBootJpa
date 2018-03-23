$(function(){
	$.get('/check_failture_flag', function(data){
		if(data.status == 1){
			$.ajax({
				url: '/get_patchca',
				async: false,
	           	type: "post",
	           	success: function(data){
					var captchaDom = $('<label for="captcha"><img id="login_captcha" src="' + data + '" style="cursor:pointer;" /></label>'
						+'<input type="text" name="captcha" style="float:right;">');
					$('#captcha').html(captchaDom);
	           	}
			});
			
			$('#login_captcha').click(function(){
				$.ajax({
					url: '/get_patchca',
					async: false,
		           	type: "post",
		           	data: {imgOldPath: $('#login_captcha').attr('src')},
		           	success: function(data){
		           		$('#login_captcha').attr('src', data);
		           	}
				});
			});
		}
	});
	
});