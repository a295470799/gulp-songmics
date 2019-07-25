var addressValid = {
	errObj: ".totalerror",//错误提示标签-默认值
	errInfo: "Please enter the correct format",//格式提示信息-默认值
	nullInfo: "This is a required field",//不能为空提示信息标签-默认值
	addressObj: ".shippingAddres",//表单所在Dom元素标签默认值
	continueObj: ".continue",//点击下一步标签默认值
	phoneReg: /^[0-9]{10,12}$/,//手机验证默认值
	init: function(options){
		//可选参数
		addressValid.addressObj = options && options.addressObj || addressValid.addressObj;
		addressValid.errObj = options && options.errObj || addressValid.errObj;
		addressValid.continueObj = options && options.continueObj || addressValid.continueObj;
		addressValid.errInfo = options && options.errInfo || addressValid.errInfo;
		addressValid.nullInfo = options && options.nullInfo || addressValid.nullInfo;
		
		//绑定Input/Select输入框焦点事件
		$(addressValid.addressObj).on("focus", 'input[required],select[required]', function(){
			addressValid.hideError(this);
		})
		
		//绑定Input/Select离开焦点事件
		$(addressValid.addressObj).on("blur", 'input[required],select[required]', function(){
			addressValid.validData(this);
		})
		
		//绑定点击下一步, nextFun：下一步的执行函数
		$(addressValid.addressObj).on("click", addressValid.continueObj, function(){
			addressValid.savecontinue(options && options.nextFun);
		})
	},
	showError: function(obj,errInfo){
		$(obj).addClass("border").siblings(addressValid.errObj).html(errInfo).show();
	},
	hideError: function(obj){
		$(obj).removeClass("border").siblings(addressValid.errObj).hide();
	},
	validData: function(obj){
		var obj_val = $(obj).val();
		var obj_id = $(obj).prop("id");
		if(!obj_val){
			addressValid.showError(obj,addressValid.nullInfo);
			return false;
		}
		switch(obj_id){
			case "email":
				if(!emailReg.test(obj_val)){
					addressValid.showError(obj,addressValid.errInfo);
					return false;
				}
				break;
			case "phone":
				if(!addressValid.phoneReg.test(obj_val)){
					addressValid.showError(obj,addressValid.errInfo);
					return false;
				}
				break;
		}
		addressValid.hideError(obj);
	},
	savecontinue: function(nextFun){
		var $inputs = $(""+addressValid.addressObj+" input[required]");
		var $selects = $(""+addressValid.addressObj+" select[required]");
		var nextStep = true;
		$inputs.each(function(){
			addressValid.validData(this);
			if($(this).hasClass("border")) nextStep = false;
		});
		$selects.each(function(){
			addressValid.validData(this);
			if($(this).hasClass("border")) nextStep = false;
		})
		nextStep && nextFun && nextFun();
	}
}
var addressField = {
	email: $("#email"),
	phone: $("#phone"),
	phone_standby: $("#altematePhone"),
	firstname: $("#firstName"),
	lastname: $("#lastName"),
	address_1: $("#address1"),
	address_2: $("#address2"),
	postcode: $("#zipCode"),
	country: $("#country"),
	zone: $("#state"),
	city: $("#city"),
	address_id: $("#address_id"),
	shipping_id: $("#shipping_id"),
	billing_id: $("#billing_id"),
	code: $("#code"),
	product_id: $("#product_id"),
	coupon_code :$("#code"),
}
var addressEnum = {
	shipping: 1,
	billing: 2
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
		coupon_code: addressField.coupon_code.val() || "",
	}
}

var updatePrice = function(shipping, tax, couponPrice, total){
	if(shipping){
		$(".shipping-price").html(currency + shipping);
	}
	if(couponPrice){
		$(".save").show();
		$(".save .save-price").html("-" + currency + couponPrice);
	}
	if(tax){
		$(".taxprice").html(tax);
	}
	$(".right_list .total").html(currency + total);
}
var addressOperate = {
	redirectUrl: "",
	shippingInfo: "",
	billingInfo: "",
	updateInfo: "",
	operate: "add",
	createAddress: function(addressType, nextFun){
		var url = addressType == addressEnum.shipping ? "/api/address/createShipping" : "/api/address/createBilling";
		$.ajax({
			url: url,
			type: "POST",
			data: getAddressData(),
			success: function(data){
				ajaxSuccess(data, function(){
					if(data.data){
						var addressId = data.data.id || data.data.address_id;
						if(addressType == addressEnum.shipping){
							addressOperate.shippingInfo = data.data;
							addressField.shipping_id.val(addressId);
							var total = data.data.total;
							updatePrice(total.shipping, total.tax, total.coupon_price, total.total);
						}else if(addressType == addressEnum.billing){
							addressOperate.billingInfo = data.data;
							addressField.billing_id.val(addressId);
						}
						addressOperate.updateInfo = data.data;
						addressOperate.operate = "edit";
						if(nextFun){
							addressOperate.getAllAddress(nextFun);
						}else if(addressOperate.redirectUrl){
							window.location.href = addressOperate.redirectUrl
						}
					}
				})
			}
		})
	},
	createShipping: function(nextFun){
		addressOperate.createAddress(addressEnum.shipping, nextFun);
	},
	createBilling: function(nextFun){
		addressOperate.createAddress(addressEnum.billing, nextFun);
	},
	updateAddress: function(addressType, nextFun){
		var url = addressType == addressEnum.shipping ? "/api/address/updateShipping" : "/api/address/updateBilling";
		$.ajax({
			url: url,
			type: "POST",
			data: getAddressData(),
			success: function(data){
				ajaxSuccess(data, function(){
					if(data.data){
						var addressId = data.data.id || data.data.address_id;
						if(addressType == addressEnum.shipping){
							addressField.shipping_id.val(addressId);
							var total = data.data.total;
							updatePrice(total.shipping, total.tax, total.coupon_price, total.total);
						}else if(addressType == addressEnum.billing){
							addressField.billing_id.val(addressId);
						}
						addressOperate.updateInfo = data.data;
						addressOperate.operate = "edit";
						addressOperate.getAllAddress(nextFun);
					}
				})
			}
		})
	},
	updateShipping: function(nextFun){
		addressOperate.updateAddress(addressEnum.shipping, nextFun);
	},
	updateBilling: function(nextFun){
		addressOperate.updateAddress(addressEnum.billing, nextFun);
	},
	getAddress: function(nextFun){
		$.ajax({
			url: "/api/address/getAddress",
			type: "POST",
			data: getAddressData(),
			success: function(data){
				ajaxSuccess(data, function(){
					if(data.data){
						addressOperate.shippingInfo = data.data.shipping;
						addressOperate.billingInfo = data.data.billing;
						nextFun && nextFun();
					}
				})
			}
		})
	},
	getAllAddress: function(nextFun){
		$.ajax({
			url: "/api/address/getAllAddress",
			type: "POST",
			success: function(data){
				ajaxSuccess(data, function(){
					if(data.data){
						addressOperate.shippingInfo = data.data.shipping;
						addressOperate.billingInfo = data.data.billing;
						nextFun && nextFun();
					}
				})
			}
		})
	},
}
var fillUpAddress = function(addressInfo, init){
	if(addressInfo){
		var tempInfo = addressInfo[0] || addressInfo;
		if(addressInfo.length > 1){
			for (var i = 0; i < addressInfo.length; i++) {
				if(addressInfo[i].type == "shipping" && addressInfo[i].id == addressField.shipping_id.val()){
					tempInfo = addressInfo[i];
				}else if(addressInfo[i].type == "billing" && addressInfo[i].id == addressField.billing_id.val()){
					tempInfo = addressInfo[i];
				}
			}
		}
		var defaultId = tempInfo.id;
		if(!init){
			var html = "<option selected value='"+defaultId+"'>"+tempInfo.firstname+" "+tempInfo.lastname+", "+tempInfo.address_1+", "+(tempInfo.address_2 ? tempInfo.address_2+", ":"");
			html += tempInfo.postcode+", "+(tempInfo.zone_name || ($("#state [value="+ tempInfo.zone_id +"]").html()))+", "+ (tempInfo.country_name || ($("#country [value="+ tempInfo.country_id +"]").html()))+", "+ tempInfo.phone+"</option>";
			
			for (var i = 0; i < addressInfo.length; i++) {
				if(defaultId == addressInfo[i].id) continue;
				html += "<option value='"+addressInfo[i].id+"'>"+addressInfo[i].firstname+" "+addressInfo[i].lastname+", "+addressInfo[i].address_1+", "+(addressInfo[i].address_2 ? addressInfo[i].address_2+", ":"");
				html += addressInfo[i].postcode+", "+addressInfo[i].zone_name+", "+ addressInfo[i].country_name+", "+ addressInfo[i].phone+"</option>";
			}
			html += "<option value='-1'>Add a new address</option>";
			$(".editAddress #select_more").html(html);
		}
		addressField.email.val(tempInfo.email);
		addressField.firstname.val(tempInfo.firstname);
		addressField.lastname.val(tempInfo.lastname);
		addressField.city.val(tempInfo.city);
		addressField.phone.val(tempInfo.phone);
		addressField.phone_standby.val(tempInfo.phone_standby);
		addressField.postcode.val(tempInfo.postcode);
		addressField.zone.val(tempInfo.zone_id);
		addressField.address_1.val(tempInfo.address_1);
		addressField.address_2.val(tempInfo.address_2);
		addressField.country.val(tempInfo.country_id);
		addressField.address_id.val(defaultId);
	}
}
var fillUpShippingAddress = function(){
	fillUpAddress(addressOperate.shippingInfo);
}
var fillUpBillingAddress = function(){
	fillUpAddress(addressOperate.billingInfo);
}
var clearAddress = function(){
	addressField.email.val("");
	addressField.firstname.val("");
	addressField.lastname.val("");
	addressField.city.val("");
	addressField.phone.val("");
	addressField.phone_standby.val("");
	addressField.postcode.val("");
	addressField.zone.val("");
	addressField.address_1.val("");
	addressField.address_2.val("");
	addressField.country.val("");
}
//添加、编辑地址
var operateAddress = function(){
	if(!checkLogin){
		if($(".tableLeft .continue").hasClass("shipping")){
			addressOperate.createShipping(operateAddressSucc);
		}else{
			addressOperate.createBilling(operateAddressSucc);
		}
	}else{
		if($(".tableLeft .continue").hasClass("shipping")){
			if(addressOperate.operate == "add"){
				addressOperate.createShipping(operateAddressSucc);
			}else if(addressOperate.operate == "edit"){
				addressOperate.updateShipping(operateAddressSucc);
			}
		}else{
			if(addressOperate.operate == "add"){
				addressOperate.createBilling(operateAddressSucc);
			}else if(addressOperate.operate == "edit"){
				addressOperate.updateBilling(operateAddressSucc);
			}
		}
	}
}
//添加、编辑地址成功后的操作
var operateAddressSucc = function(){
	$(".editAddress").hide();
	$(".common-bg").hide();
	closeBox();
	var action = $(".tableLeft .continue").hasClass("shipping") ? "shipping" : "billing";
	var info = addressOperate.updateInfo;

	if(addressOperate.operate == "edit"){
		$(".addressTittle span."+ action).removeClass("add").addClass("edit").html("Edit");
	}else if(addressOperate.operate == "add"){
		$(".addressTittle span."+ action).removeClass("edit").addClass("add").html("Add");
	}

	if(info){
		var html = '<li>'+ info.firstname +' '+ info.lastname +'</li>';
		html += '<li>'+ info.address_1 +', '+ (info.address_2 || "") +'</li>';
		html += '<li>'+ ($("#state [value="+ info.zone_id +"]").html() || "") +', '+ info.city +'  '+ info.postcode +'</li>';
		html += '<li>'+ ($("#country [value="+ info.country_id +"]").html() || "") +'</li>';
		html += '<li>'+ info.phone +'</li>';
		action == "billing" ? html += '<li>'+ info.email +'</li>' : "";
		$(".addressEdit .addressDetail."+ action +" ul").html(html);
		if(action == "billing"){
			addressField.billing_id.val(info.id || info.address_id);
			$(".payment .billing.addressDetail").removeClass("border");
		}else if(action == "shipping"){
			addressField.shipping_id.val(info.id || info.address_id);
			$(".payment .shipping.addressDetail").removeClass("border");
		}
	}
}
var clearCode = function(){
	$(".save").hide();
	$(".save .save-price").html("");
	$(".right_list .total").html(currency + $("#original-price").val());
	$(".codeInput").show();
	$(".applyed").hide();
	$(".applyed .applyedLeft").html("CODE ");
	$("#code").val("");
}
//优惠卷
var checkPromocode = function(){
	$(".code .code_err").html("").hide();
	var promocode = $("#promocode").val();
	if(!promocode){
		$(".code_err").html("Please enter the code").show();
		return false;
	}
	$.ajax({
		url: "/api/coupon/validateCode",
		type: "POST",
		data:{
			code: promocode,
			total: $("#original-price").val()
		},
		success: function(data){
			ajaxSuccess(data, function(){
				if(data.data){
					updatePrice(null, null, data.data.coupon_price, data.data.total);
					$(".applyed").show();
					$(".applyed .applyedLeft").html("CODE " + promocode).show();
					$(".codeInput").hide();
					$("#code").val(promocode);
				}
			})
		}
	})
}
var btnContinue = function(){
	var payMethod = $("#payment-paypal").prop("checked");
	var result = true;
	if(payMethod){
		$(".paymentMethod .paypal").removeClass("err");
	}else{
		$(".paymentMethod .paypal").addClass("err");
		result = false;
	}
	if(checkLogin){
		if(addressField.shipping_id.val()){
		$(".payment .shipping.addressDetail").removeClass("border");
			result ? result = true : result;
		}else{
			$(".payment .shipping.addressDetail").addClass("border");
			result = false;
		}
		if(addressField.billing_id.val()){
			$(".payment .billing.addressDetail").removeClass("border");
			result ? result = true : result;
		}else{
			$(".payment .billing.addressDetail").addClass("border");
			result = false;
		}
	}
	if(result){
		placeOrder();
	}
}
//生成订单
var placeOrder = function(){
	$(".common-bg").show();
	$(".common-loading").show();
	$.ajax({
		url: "/api/order/create",
		type: "POST",
		data: {
			shipping_id:addressField.shipping_id.val() || "", 
			billing_id:addressField.billing_id.val() || "",
			coupon_code: addressField.code.val() || "",
			product_id: addressField.product_id.val() || "",
			subscription: $("#order_subscription").prop("checked") ? 1 : 0
		},
		success: function(data){
			if(data){
				if(data.code == 200){
					window.location.href = data.data;
				}else if(data.code == 400){
					$(".common-bg").hide();
					$(".common-loading").hide();
					showMsg(data.message);
				}
			}else{
				$(".common-bg").hide();
				$(".common-loading").hide();
				showMsg("System busy, Please retry");
			}
		}
	})
}

$(document).ready(function(){
	if(!checkLogin){
		$(".editAddress .editSelect").hide();
	}

	$(".billingAddress_check input").on("click", function(){
		var checked = $(this).prop("checked");
		if(checked){
			addressField.address_id.val("");
			addressOperate.operate = "add";
			addressOperate.shippingInfo ? fillUpAddress(addressOperate.shippingInfo, true) : addressOperate.getAllAddress(fillUpShippingAddress);
		}else{
			$("#select_more").val() == -1 ? addressOperate.operate = "add" : addressOperate.operate = "edit";
			addressField.address_id.val($("#select_more").val());
		}
	})

	$(".addressTittle span.edit,.addressTittle span.add").on("click",function(){
		//edit add
		var $title = $(".editAddress .payment_title span");
		var $sameasShip = $(".editAddress .billingAddress_check");
		var isAdd = $(this).hasClass("add");
		var $selectMore = $(".editAddress .editSelect");
		addressOperate.operate = isAdd ? "add" : "edit";
		$(".billingAddress_check #sameasship").prop("checked", false);
		if($(this).hasClass("shipping")){
			//shipping
			if(isAdd){
				$title.html("ADD SHIPPING ADDRESS");
				$(".editAddress .editSelect").hide(); 
			}else{
				$title.html("CHANGE THE SHIPPING ADDRESS");
				addressOperate.shippingInfo ? fillUpShippingAddress() : addressOperate.getAllAddress(fillUpShippingAddress);
				$selectMore.show(); 
			}
			$sameasShip.hide();
			$(".tableLeft .continue").addClass("shipping").removeClass("billing");
		}else{
			//billing
			if(isAdd){
				$title.html("ADD BILLING ADDRESS");
				$(".editAddress .editSelect").hide();
				clearAddress();
			}else{
				$title.html("CHANGE THE BILLING ADDRESS");
				addressOperate.billingInfo ? fillUpBillingAddress() : addressOperate.getAllAddress(fillUpBillingAddress);
				$selectMore.show(); 
			}
			
			(addressOperate.shippingInfo || addressField.shipping_id.val()) ? $sameasShip.show() : $sameasShip.hide();
			$(".tableLeft .continue").addClass("billing").removeClass("shipping");
		}
		$(".common-bg").show();
		$(".editAddress").show();
		openBox();
	});

	$(".editAddress .close").on("click",function(){
		$(".editAddress .tableList").find("input,select").removeClass("border");
		$(".editAddress .tableList").find(".totalerror").hide();
		$(".common-bg").hide();
		$(".editAddress").hide();
		clearAddress();
		closeBox();
	}); 

	$(".editSelect span").on("click",function(){
		$(this).siblings("ul").toggle();
	});

	$(".right_list .codeInput .apply").on("click",function(){
		checkPromocode();
	});

	$(".code .applyedRight").on("click", function(){
		clearCode();
	})

	$(".right_list .continue").on("click", btnContinue);

	$(".editAddress #select_more").on("change", function(){
		var val = $(this).val();
		if(val == -1){
			clearAddress();
			addressField.address_id.val("");
			addressOperate.operate = "add";
			return false;
		}
		$(".billingAddress_check #sameasship").prop("checked", false);
		addressField.address_id.val(val);
		addressOperate.operate = "edit";
		var action = $(".tableLeft .continue").hasClass("shipping") ? "shipping" : "billing";
		if(action == "shipping"){
			if(addressOperate.shippingInfo){
				addressField.shipping_id.val(val);
				fillUpAddress(addressOperate.shippingInfo, true);
			}
		}else if(action == "billing"){
			if(addressOperate.billingInfo){
				addressField.billing_id.val(val);
				fillUpAddress(addressOperate.billingInfo, true);
			}
		}

	})

})