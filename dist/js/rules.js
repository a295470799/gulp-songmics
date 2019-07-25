$(function(){
	$('.listLeft>ul li.leftSlider:not(".faqs")').on("click",function(){
		$(this).addClass('aui-current').siblings().removeClass('aui-current');
		$('.listRight>div:eq('+$(this).index()+')').show().siblings().hide();
	})
	$('.listLeft>ul li.leftSlider.faqs span').on("click",function(){
		var url = $(this).attr("data-url");
		if($(this).find("i.iconfont").hasClass("icon-reduce")){
			$(this).find("i.iconfont").removeClass("icon-reduce").addClass("icon-add");
			$(this).siblings('ul').hide();
		}else{
			window.location.href = url;
		}
	})
	$(".listLeft>ul li.leftSlider .faqsList").on("click",function(){
		var id = $(this).attr("data-id");
		$(".listDetails .faqsAll").hide();
		$(".listDetails .faqsAll[data-id='"+id+"']").show();
	})
	$(".rulesList li.faqs ul li").on("click",function(){
		$(this).addClass("active").siblings().removeClass("active");
	});
	$(".listDetails .faqDetails span.faqSlider").on("click",function(){
		$(this).siblings(".sliderDetails").toggle();
		if($(this).find("i").hasClass("icon-reduce")){
			$(this).children().removeClass("icon-reduce").addClass("icon-add")
		}else{
			$(this).children().removeClass("icon-add").addClass("icon-reduce")
		}
	})

	$(".listRight .tableDetail input[required],select[required],textarea").on("blur", function(){
		if($(this).val()){
			$(this).removeClass("err");
			$(this).next(".totalerror").html("").hide();
		}else{
			$(this).next(".totalerror").html("This is a required field").show();
			$(this).addClass("err");
		}
	})

	$(".listRight .rulesSumit").on("click", function(){
		var $this = $(this);
		$(".listRight .tableDetail input[required],select[required],textarea").blur();
		if($(".listRight .tableDetail input[required].err,select[required].err,textarea.err").length == 0 && !$this.attr("disabled")){
			$this.after('<div class="loading"><img style="width:40px" src="/static/web/img/loading.gif"/></div>');
			$this.attr("disabled", true);
			$.ajax({
				url: "/api/feedback/create",
				type: "POST",
				data:{
					firstname: $("#firstname").val() || "",
					lastname: $("#lastname").val() || "",
					email: $("#email").val() || "",
					phone: $("#phone").val() || "",
					order_number: $("#ordernum").val() || "",
					content: $("#content").val() || "",
					subject: $("#subject").val() || "",
				},
				success: function(data){
					ajaxSuccess(data, function(){
						showMsg(data.message);
						setTimeout("window.location.href = window.location.href", 2000);
					},$this)
				}
			})
		}
	})

	$(".cus-order-track input").on("blur", function(){
		var obj_val = $(this).val() || "";
		if(obj_val){
			$(this).removeClass("err");
			$(this).next(".err_msg").html("");
		}else{
			$(this).next(".err_msg").html("This is a required field");
			$(this).addClass("err");
		}
	});

	$(".cus-order-track .trackOrder span").on("click", function(){
		var $this = $(this);
		$(".track-order .title").siblings("div").remove();
		$(".cus-order-track input").blur();
		if($(".cus-order-track input.err").length == 0 && !$this.attr("disabled")){
			$this.after('<div style="width:140px" class="loading"><img style="width:40px" src="/static/web/img/loading.gif"/></div>');
			$this.attr("disabled", true);
			$.ajax({
				url: "/api/track/list",
				type: "POST",
				data:{
					order_number: $("#order_num").val() || "",
					email: $("#email").val() || "",
				},
				success: function(data){
					ajaxSuccess(data, function(){
						var jsonData = data.data;
						var html = "";
						for (var i = 0; i < jsonData.length; i++) {
							html += '<div class="border"><p>Tracking Number:<span>'+jsonData[i].track_number+'</span></p><p>Carrier:<span>'+jsonData[i].track_code+'</span></p><p>Tracking URL:<a target="_blank" href="'+jsonData[i].track_url+'">View</a></p></div>';
						}
						$(".track-order .title .order-num").html("Track Order: " + $("#order_num").val());
						$(".track-order .title").after(html);
						$(".track-order").show();
						$(".common-bg").show();
						openBox();
					}, $this)
				}
			})
		}
	})
});
