var signin = function(){
	$(".login .content input").blur();
	if($(".login .content input.err").length == 0 && !$(".sign-btn").attr("disabled")){
		$(".sign-btn").attr("disabled", "true");
		$(".login .loading").show();
		var email = $("#lemail").val();
		var password = $("#lpassword").val();
		$.ajax({
			url: "/api/account/login",
			type: "POST",
			data:{
				email: email,
				password: password
			},
			success: function(data){
				ajaxSuccess(data, function(){
					window.location.href = "/";
				},$(".sign-btn"))
				$(".login .loading").hide();
			}
		})
	}
}
var register = function(){
	$(".register .content input").blur();
	if($(".register .content input.err").length == 0 && !$(".create-btn").attr("disabled")){
		$(".create-btn").attr("disabled", "true");
		var firstname = $("#rfirstname").val();
		var lastname = $("#rlastname").val();
		var email = $("#remail").val();
		var password = $("#rpassword").val();
		var password_confirm = $("#repeat_password").val();
		$(".register .loading").show();
		$.ajax({
			url: "/api/account/register",
			type: "POST",
			data:{
				firstname: firstname,
				lastname: lastname,
				email: email,
				password: password,
				password_confirm: password_confirm
			},
			success: function(data){
				ajaxSuccess(data, function(){
					window.location.href = "/";
				},$(".create-btn"));
				$(".register .loading").hide();
			}
		})
	}
}
$(function(){
	$('.login-register .facebook,.login-register .google').on('click', function(){
		openWin($(this).attr('data-url'));
		checkSocalLogin("/");
	});

	$(".login-register input").on("blur", function(){
		var $this = $(this);
		var id = $this.prop("id");
		var $msg = $this.siblings(".err-msg");
		var obj_val = $this.val();
		var result = true;
		if(!obj_val){
			$msg.html("This is a required field");
			result = false;
		}else{
			if(id == "lemail" || id == "remail"){
				var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
				if(!reg.test(obj_val)){
					$msg.html("Email format is incorrect");
					result = false;
				}
			}
			if(id == "rpassword" || id == "repeat_password"){
				var reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!@#$%^&*+=-_]+$)[\da-zA-Z!@#$%^&*+=-_]{6,20}$/;
				if(!reg.test(obj_val)){
					$msg.html("Please enter a password between 6-25 characters long and contains both letters and numbers. Special characters are not allowed.");
					result = false;
				}
				if(id == "repeat_password" && obj_val != $("#rpassword").val()){
					$msg.html("Your passwords do not match. Please confirm your password.");
					result = false;
				}
			}
		}
		if(result){
			$this.removeClass("err");
			$msg.html("");
		}else{
			$this.addClass("err");
		}
	})

	$(".sign-btn").on("click", function(){
		signin();
	})

	$(".create-btn").on("click", function(){
		register();
	})
});
