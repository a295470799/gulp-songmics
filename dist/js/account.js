var updateName = function(){
	var firstname = $("#firstname").val();
	var lastname = $("#lastname").val();
	if(firstname && lastname){
		$.ajax({
			url: "/api/account/updateName",
			type: "POST",
			data: {
				firstname: firstname,
				lastname: lastname
			},
			success: function(data){
				ajaxSuccess(data, function(){
					showMsg(data.message);
					$(".name_i").html(firstname + " " + lastname);
					$(".name_info").hide();
					$(".name_info").prev(".info").show();
				})
			}
		})
	}
}
var updateEmail = function(){
	var pwd = $("#password_email").val();
	var email = $("#new_email").val();
	var email_confirm = $("#confirm_email").val();
	if(pwd && email && email_confirm){
		$.ajax({
			url: "/api/account/updateEmail",
			type: "POST",
			data: {
				password_current: pwd,
				email_new: email,
				email_confirm: email_confirm
			},
			success: function(data){
				ajaxSuccess(data, function(){
					showMsg(data.message);
					$(".email_i").html(email);
					$(".email_info").hide();
					$(".email_info").prev(".info").show();
				})
			}
		})
	}
}
var updatePassword = function(){
	var password_current = $("#password_current").val();
	var password_new = $("#password_new").val();
	var password_confirm = $("#password_confirm").val();
	if(password_current && password_new && password_confirm){
		$.ajax({
			url: "/api/account/updatePassword",
			type: "POST",
			data: {
				password_current: password_current,
				password_new: password_new,
				password_confirm: password_confirm
			},
			success: function(data){
				ajaxSuccess(data, function(){
					showMsg(data.message);
					$(".pwd_info").hide();
					$(".pwd_info").prev(".info").show();
				})
			}
		})
	}
}
var removeWish = function(pid, nextFun){
	if(pid){
		$.ajax({
			url: '/api/wish/setWish',
			type: 'POST',
			data:{
				product_id: pid,
				action: "delete"
			},
			success: function(data){
				ajaxSuccess(data,function(){
					nextFun && nextFun();
				})
			}
		})
	}
}
var addressField = {
	email: $(".tableDetail #email"),
	phone: $(".tableDetail #phone"),
	phone_standby: $(".tableDetail #altematePhone"),
	firstname: $(".tableDetail #firstName"),
	lastname: $(".tableDetail #lastName"),
	address_1: $(".tableDetail #address1"),
	address_2: $(".tableDetail #address2"),
	postcode: $(".tableDetail #zipCode"),
	country: $(".tableDetail #country"),
	zone: $(".tableDetail #state"),
	city: $(".tableDetail #city"),
	address_id: $("#address_id")
}
var showForm = function(text, inp_text, data, shipType){
	openBox();
	$(".payment_title span").html(text);
	$(".shippingEditAddress .saveDefault label").html(inp_text);
	var $continue = $(".shippingEditAddress .continue span");
	if(data){
		$continue.addClass("edit");
		var jsonData = JSON.parse(data);
		addressField.email.val(jsonData.email);
		addressField.firstname.val(jsonData.firstname);
		addressField.lastname.val(jsonData.lastname);
		addressField.address_1.val(jsonData.address_1);
		addressField.address_2.val(jsonData.address_2);
		addressField.country.val(jsonData.country_id);
		addressField.city.val(jsonData.city);
		addressField.postcode.val(jsonData.postcode);
		addressField.phone.val(jsonData.phone);
		addressField.phone_standby.val(jsonData.phone_standby);
		addressField.zone.val(jsonData.zone_id);
		addressField.address_id.val(jsonData.id);
	}else{
		$continue.addClass("add");
	}
	$(".common-bg").show();
	$(".shippingEditAddress").show();
	if(shipType){
		$continue.addClass("billing");
		$(".shippingEditAddress .tableLeft .tableList .shipBill").show();
	}else{
		$continue.addClass("shipping");
		$(".shippingEditAddress .tableLeft .tableList .shipBill").hide();
	}
}
var addressOperate = function(url){
	$.ajax({
		url: url,
		type: "POST",
		data: getAddressData(),
		success: function(data){
			ajaxSuccess(data, function(){
				window.location.href = window.location.href;
			});
		}
	})
}
var deleteOrSetDefault = function(id, shipType, del){
	if(id){
		var data = del ? { address_id: id } : { address_id: id, type: shipType  }
		$.ajax({
			url: del ? "/api/address/delete" : "/api/address/setDefault",
			type: "POST",
			data: data,
			success: function(data){
				ajaxSuccess(data, function(){
					window.location.href = window.location.href;
				});
			}
		})
	}else{
		showMsg("System busy");
	}
}

var getAddressData = function(){
	return {
		email: addressField.email.val(),
		phone: addressField.phone.val(),
		phone_standby: addressField.phone_standby.val(),
		firstname: addressField.firstname.val(),
		lastname: addressField.lastname.val(),
		address_1: addressField.address_1.val(),
		address_2: addressField.address_2.val() || "",
		postcode: addressField.postcode.val(),
		country_id: addressField.country.val(),
		zone_id: addressField.zone.val(),
		city: addressField.city.val(),
		address_id: addressField.address_id.val() || "",
		status: $("#save_default").prop("checked") ? 1 : ""
	}
}

var searchOrder = function(){
	window.location.href = "/account/order?number=" + $("#order_search").val();
}

$(document).ready(function () {
	$(".infoRight span.edit").on("click", function(){
		$(this).parents(".info").hide();
		$(this).parents(".info").next(".infoEdit").show();
	});

	$(".infoEdit .cancel").on("click", function(){
		$(this).parents(".infoEdit").prev(".info").show();
		$(this).parents(".infoEdit").hide();
	});

	$(".name_update").on("click", function(){
		$(this).parents(".infoEdit").find("input").blur();
		if($(this).parents(".infoEdit").find("input.err").length == 0){
			updateName();
		}
	});

	$(".email_update").on("click", function(){
		$(this).parents(".infoEdit").find("input").blur();
		if($(this).parents(".infoEdit").find("input.err").length == 0){
			updateEmail();
		}
	});

	$(".pwd_update").on("click", function(){
		$(this).parents(".infoEdit").find("input").blur();
		if($(this).parents(".infoEdit").find("input.err").length == 0){
			updatePassword();
		}
	});

	$(".informationDetail input").on("blur", function(){
		var obj_val = $(this).val();
		var obj_id = $(this).prop("id");
		var $msg = $(this).next(".errorMes");
		var result = true;
		if(!obj_val){
			$msg.html("This is a required field");
			result = false;
		}else{
			if(obj_id == "new_email" || obj_id == "confirm_email"){
				var emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
				if(!emailReg.test(obj_val)){
					result = false;
					$msg.html("Please enter the correct format");
				}

				if(obj_id == "confirm_email" && obj_val != $("#new_email").val()){
					$msg.html("Please enter the same email again");
					result = false;
				}
			}
			if(obj_id == "password_new" || obj_id == "password_confirm"){
				var pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
				if(!pwdReg.test(obj_val)){
					result = false;
					$msg.html("Please enter a password between 6-25 characters long and contains both letters and numbers. Special characters are not allowed.");
				}
				
				if(obj_id == "password_confirm" && obj_val != $("#password_new").val()){
					$msg.html("Your passwords do not match. Please confirm your password.");
					result = false;
				}
			}
		}
		if(result){
			$(this).removeClass("err");
			$msg.html("");
		}else{
			$(this).addClass("err");
		}
	})

	$(".informationRight").on("click", ".addToCart", function(){
		var pid = $(this).parents(".operation").attr("data-id");
		confirm("1 item added to your shopping cart.", function(){shopCart.add(pid);window.location.href = window.location.href;})
	})

	$(".informationRight .wishOperation").on("click", ".delete", function(){
		var $this = $(this);
		confirm("Are you sure to delete this item from your wish list?", function(){
			var pid = $this.parents(".operation").attr("data-id");
			removeWish(pid, function(){
				window.location.href = window.location.href;
			});
		})
	})

	$(".shippingEditAddress .continue span").on("click", function(){
		$(".shippingEditAddress input[required],select[required]").blur();
		if($(".shippingEditAddress input[required].err,select[required].err").length == 0){
			if($(this).hasClass("add")){
				if($(this).hasClass("shipping")){
					addressOperate("/api/address/createShipping");
				}else{
					addressOperate("/api/address/createBilling");
				}
			}else if($(this).hasClass("edit")){
				if($(this).hasClass("shipping")){
					addressOperate("/api/address/updateShipping");
				}else{
					addressOperate("/api/address/updateBilling");
				}
			}
		}
	});

	$(".addNew.shipping,.shippingAddNew").on("click",function(){
		showForm("add new shipping address", "Save as default shipping address");
	})
	$(".edit.shipping").on("click",function(){
		var data = $(this).siblings(".address_info").val();
		showForm("edit the shipping address", "Save as default shipping address", data, null);
	})
	$(".addNew.billing,.billingAddNew").on("click",function(){
		showForm("add new billing address", "Save as default billing address", null, true);
	})
	$(".edit.billing").on("click",function(){
		var data = $(this).siblings(".address_info").val();
		showForm("edit the billing address", "Save as default billing address", data, true);
	})

	$(".shippingEditAddress .close").on("click",function(){
		$(".common-bg").hide();
		$(".shippingEditAddress").hide();
		$(".tableDetail input").val("");
		$(".shippingEditAddress .continue span").removeClass();
		closeBox();
	})

	$(".personRight").on("click", ".moreAddress div", function(){
		$(this).parents(".moreAddress").siblings(".addressDetail").find("li.other").toggle();
		$(this).hide();
		if($(this).hasClass("more")){
			$(this).siblings(".less").show();
		}else{
			$(this).siblings(".more").show();
		}
	})

	$(".shippingEditAddress input[required],select[required]").on("blur", function(){
		var $this = $(this);
		var obj_val = $this.val();
		var obj_id = $this.prop("id");
		var $msg = $this.siblings(".totalerror");
		if(obj_val){
			if(obj_id.indexOf("email") > -1){
				var emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
				if(emailReg.test(obj_val)){
					$this.removeClass("err");
					$msg.html("");
				}else{
					$this.addClass("err");
					$msg.html("Please enter the correct format").show();
				}
			}else if(obj_id.indexOf("phone") > -1){
				var phoneReg = /^[0-9]{10,12}$/;
				if(phoneReg.test(obj_val)){
					$this.removeClass("err");
					$msg.html("");
				}else{
					$this.addClass("err");
					$msg.html("Please enter the correct format").show();
				}
			}else{
				$this.removeClass("err");
				$msg.html("");
			}
		}else{
			$this.addClass("err");
			$msg.html("This is a required field").show();
		}
	});

	$(".addressDetail .delete .del").on("click", function(){
		var id = $(this).parents("li").attr("data-id");
		confirm("Are you sure to delete this shipping address?", function(){deleteOrSetDefault(id, null ,true)});
	});

	$(".addressDetail .delete .setDefalt").on("click", function(){
		var id = $(this).parents("li").attr("data-id");
		if($(this).hasClass("billing")){
			deleteOrSetDefault(id, "billing");
		}else{
			deleteOrSetDefault(id, "shipping");
		}
	});

	$("#checked_sameship").on("click", function(){
		var checked = $(this).prop("checked");
		if(checked){
			var data = $("#shipping_default").val();
			if(data){
				var jsonData = JSON.parse(data);
				if(jsonData){
					addressField.email.val(jsonData.email);
					addressField.firstname.val(jsonData.firstname);
					addressField.lastname.val(jsonData.lastname);
					addressField.address_1.val(jsonData.address_1);
					addressField.address_2.val(jsonData.address_2);
					addressField.country.val(jsonData.country_id);
					addressField.city.val(jsonData.city);
					addressField.postcode.val(jsonData.postcode);
					addressField.phone.val(jsonData.phone);
					addressField.phone_standby.val(jsonData.phone_standby);
					addressField.zone.val(jsonData.zone_id);
				}
			}
		}
	})
	//Cancel Order
	$(".liOperation .cancel_order").on("click", function(){
		var $this = $(this);
		confirm("Do you confirm to cancel the order?", function(){
			var id = $this.parents(".liOperation").attr("data-id");
			if(id){
				$.ajax({
					url: "/api/order/cancel",
					type: "POST",
					data:{
						id: id
					},
					success: function(data){
						ajaxSuccess(data, function(){
							window.location.href = window.location.href;
						});
					}
				})
			}
		})
	})
	//Delete Order
	$(".liOperation .delete_order").on("click", function(){
		var $this = $(this);
		confirm("Do you confirm to delete the order?", function(){
			var id = $this.parents(".liOperation").attr("data-id");
			if(id){
				$.ajax({
					url: "/api/order/delete",
					type: "POST",
					data:{
						id: id
					},
					success: function(data){
						ajaxSuccess(data, function(){
							window.location.href = window.location.href;
						});
					}
				})
			}
		})
	})

	//search order
	$(".orderSearch span").on("click", function(){
		searchOrder();
	})

	//rewiew
	$(".reviewListDetail .reviewText .moreLess").on("click",function(){
		$(this).parent().toggleClass("more");
		$(this).toggleClass("act");
		$(this).hasClass("act") ? $(this).html("less view") : $(this).html("...more view");
	});
	
	$(".reviewList .picture li img").on("click",function(){
		$(this).parent("li").addClass("active").siblings().removeClass("active");
		var img = $(this).prop("src");
		
		var $bigImg = $($(this).parents(".picture").find(".big_picture img"));
		if(img == $bigImg.prop("src")){
			$bigImg.prop("src","");
			$(this).parent("li").removeClass("active");
		}else{
			$bigImg.prop("src",img);
		}
		
	})

	$(".reviewListDetail .commentText").each(function(){
		if($(this).html().length > 230){
			$(this).children(".moreLess").show();
		}else{
			$(this).children(".moreLess").hide();
			$(this).css("height","auto");
		}
	})

	$(".reviewListDetail .delete").on("click", function(){
		var id = $(this).attr("data-id");
		if(id){
			confirm("Are you sure to delete this item from your reviews?", function(){
				$.ajax({
					url: "/api/comment/delete",
					type: "POST",
					data:{
						comment_id: id
					},
					success: function(data){
						ajaxSuccess(data, function(){
							window.location.href = window.location.href;
						});
					}
				})
			})
		}
	})

	//orderShow
	$(".reviewProup .upload_pic").on("mouseover", ".removePic img",function(){
		var img = $(this).prop("src");
		$(".reviewProup .bigPic").html("<img src="+img+">").show();
	});

	$(".reviewProup .upload_pic").on("mouseout", ".removePic img",function(){
		$(".reviewProup .bigPic").html("").hide();
	});

	$(".upload_pic").on("click", ".icon-removePic", function(){
		$(this).parents(".removePic").remove();
	});

	$(".liPrice .review").on("click",function(){
		$(".reviewProup .product_name").html($(this).attr("data-title"));
		$(".reviewProup .product_img").prop("src",$(this).attr("data-img"));
		$("#review_pid").val($(this).attr("data-id"));
		$(".common-bg").show();
		$(".reviewProup").show();
		openBox();
	})
	$(".reviewProup .close").on("click",function(){
		$(".common-bg").hide();
		$(".reviewProup").hide();
		closeBox();
	})
	$('#pic_upload').on("change", function(event) {
		var files = event.target.files, file;        
		if (files && files.length > 0) {
			file = files[0];
			if(file.size > 1024 * 1024 * 5) {
			  showMsg('Sorry, The file you are trying to upload exceeds the 5MB attachment limit.')
			  return false;
			}
			if (window.FileReader) {
				var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function (e) {
                	$('.review_picture .upload_pic').append("<div class='removePic'><img src = "+e.target.result+"><span class='iconfont icon-removePic'></span></div>");
                	var input = document.getElementById('pic_upload');
					input.value = ''; 
                };
            }
       }
	})

	$(".reviewProup .btn_submit").on("click", function(){
		var $this = $(this);
		var star = $("#star_point").val();
		var title = $("#review_title").val();
		var content = $("#review_cont").val();
		var pid = $("#review_pid").val();
		var imgs = $(".removePic img");
		var imgArray = [];
		for (var i = 0; i < imgs.length; i++) {
			imgArray.push(imgs[i].src);
		}

		$("#star").next(".err_msg").remove();
		$(".review_title").find(".err_msg").remove();
		$(".review_text").find(".err_msg").remove();
		if(!star){
			$("#star").after('<div class="err_msg">Please select the Rating</div>');
		}
		if(!title){
			$(".review_title").append('<div class="err_msg">Please enter the title</div>');
		}
		if(!title){
			$(".review_text").append('<div class="err_msg">Please enter your review</div>');
		}

		if($(".reviewProup .err_msg").length == 0 && !$this.attr("disabled")){
			$this.next(".loading").show();
			$this.attr("disabled", true);
			$.ajax({
				url: "/api/comment/create",
				type: "POST",
				data:{
					title: title,
					content: content,
					product_id: pid,
					point: star,
					images: imgArray
				},
				success: function(data){
					ajaxSuccess(data, function(){
						window.location.href = window.location.href;
					}, $this);
				}
			})
		}
	})

	$(".trackOrder").on("click", function(){
		$(".track-order .title").siblings("div").remove();
		var order_number = $("#order_id").val();
		if(order_id){
			$.ajax({
				url: "/api/track/list",
				type: "POST",
				data:{
					order_number: order_number,
				},
				success: function(data){
					ajaxSuccess(data, function(){
						var jsonData = data.data;
						var html = "";
						for (var i = 0; i < jsonData.length; i++) {
							html += '<div class="border"><p>Tracking Number:<span>'+jsonData[i].track_number+'</span></p><p>Carrier:<span>'+jsonData[i].track_code+'</span></p><p>Tracking URL:<a target="_blank" href="'+jsonData[i].track_url+'">View</a></p></div>';
						}
						$(".track-order .title").after(html);
						$(".track-order").show();
						$(".common-bg").show();
						openBox();
					})
				}
			})
		}
	});
})