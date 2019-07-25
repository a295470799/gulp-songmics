$(document).ready(function(){
	var pageIndex = 1;
	$(".view_more span").on("click",function () {
		var pid = $("#product_id").val();
		if(pid){
			pageIndex++;
			$.ajax({
				url: "/api/comment/getComments",
				type: "POST",
				data:{
					product_id: pid,
					page: pageIndex
				},
				success:function(data){
					ajaxSuccess(data, function(){
						var commentData = data.data.comments;
						var html = "";
						for (var i = 0; i < commentData.length; i++) {
							html+= '<li class="item">';
							html+= '<div class="list_left">';
							if(commentData[i].type == 1){
								html += '<span>Name:<i>'+commentData[i].firstname +' '+ commentData[i].lastname+'</i></span>';
							}else{
								html+= '<span>Name:<i>'+commentData[i].customer_name+'</i></span>';
							}
							html+= '<span>TIME:<i>'+commentData[i].created_at+'</i></span>';
							html+= '</div>';
							html+= '<div class="list_right">';
							var stars = commentData[i].point.toString().replace(".","-")
							html+= '<span class="stars"><span class="star star'+stars+'"><i>'+commentData[i].point+' points</i></span></span>';
							html+= '<span class="reviewsSummary">'+commentData[i].title+'</span>';
							html+= '<span class="reviewsDetails">'+commentData[i].content+'</span>';
							
							var imgs = commentData[i].images;
							if(imgs.length > 0){
								html+= '<div class="picture">';
								html+= '<ul>';
								for (var j = 0; j < imgs.length; j++) {
									html += '<li><img class="img-item" src="'+imgs[j]+'"></li>';
								}
								html+= '</ul>';
								html+= '<div class="clear"></div>';
								html+= '<div class="big_picture">';
								html+= '<img>';
								html+= '</div>';
							}
							html+= '</div></div></li>';
						}
						if(html){
							$($(".reviews_list li.item")[$(".reviews_list li.item").length-1]).after(html);
							
						}
						if(data.data.page * data.data.page_size > data.data.total){
							$(".view_more").hide();
						}
					})
				}
			})
		}
	});
	$("#view-content").on("click", ".qty-up", function() {
		var $qty = $(this).siblings("input");
	    checkQty($qty, "u");
	});
	$("#view-content").on("click", ".qty-down", function() {
	    var $qty = $(this).siblings("input");
	    checkQty($qty, "d");
	});
	$("#view-content").on("blur", "#qty_num", function() {
	    checkQty($(this));
	});
	$(".faqd ul li.liTop").on("click",function(){
		slideTab($(this));
	});
	$(".addwish div").on("click",function(){
		addWish(this);
	});
	//添加购物车
	$(".productRight").on("click", ".addtocart", function(){
		var $this = $(this);
		shopCart.add($("#product_id").val(), $("#qty_num").val(), function(){
		    $this.html("Added");
        	setTimeout(function(){$this.html('Add to Cart');},800)
		});
	})
})

function checkQty(obj, operate) {
  	if(obj && obj.length > 0) {
	    var qty = parseInt(obj.val());
	    if(operate == "u") {
	      qty++;
	    } else if(operate == "d") {
	      qty--;
	    }
	    if(qty <= 1) {
	      obj.val(1);
	    } else if(qty >= 10) {
	      obj.val(10);
	    } else {
	      obj.val(qty);
	    }
  	}
}

function slideTab(obj){
	obj.addClass("active").siblings().removeClass("active");
	var liHeight = obj.children("ul")[0].scrollHeight;
	if(liHeight > 330){
		$(".faqd ul li.liTop ul").css("overflow-y","scroll")
	}else{
		$(".faqd ul li.liTop ul").css("overflow-y","hidden")
	}
}
$(function(){
    slideTab($(".faqd .liTop.active"));
    
    /* 鼠标移动小图，小图对应大图显示在大图上，并替换放大镜中的图*/
    $("#specList ul li img").livequery("mouseover",function(){ 
        var imgSrc = $(this).attr("src");
        var i = imgSrc.lastIndexOf(".");
        var unit = imgSrc.substring(i);
        imgSrc = imgSrc.substring(0,i);
        var imgSrc_small = $(this).attr("src_D");
        var imgSrc_big = $(this).attr("src_H");
        $("#bigImg").attr({"src": imgSrc_small ,"jqimg": imgSrc_big });
        $(".listImg li").removeClass("active");
        $(this).parent("li").addClass("active");
    });
    
    
    //使用jqzoom
    $(".jqzoom").jqueryzoom({
        xzoom: 545, //放大图的宽度(默认是 200)
        yzoom: 545, //放大图的高度(默认是 200)
        offset: 10, //离原图的距离(默认是 10)
        position: "right", //放大图的定位(默认是 "right")
        preload:1   
    });
    
    /*如果小图过多，则出现滚动条在一行展示*/
    var btnNext = $('#specRight');
    var btnPrev = $('#specLeft')
    var ul = btnPrev.next().find('ul');

    var len = ul.find('li').length;
    var i = 0 ;
    if (len > 6) {
        $("#specRight").addClass("specRightF").removeClass("specRightT");
        ul.css("width", 150 * len)
        btnNext.click(function(e) {
            if(i>=len-6){
                
                return;
            }
            i++;
            if(i == len-6){
                $("#specRight").addClass("specRightT").removeClass("specRightF");
            }
            $("#specLeft").addClass("specLeftF").removeClass("specLeftT");
            moveS(i);
        })
        btnPrev.click(function(e) {
            if(i<=0){
                return;
            }
            i--;
            if(i==0){
                $("#specLeft").addClass("specLeftT").removeClass("specLeftF");
            }
            $("#specRight").addClass("specRightF").removeClass("specRightT");
            moveS(i);
        })
    }
    function moveS(i) {
        ul.animate({left:-84 * i}, 500)
    }
    function picAuto(){
      if ($(".listImg li").size()<=6) {
        $("#specLeft,#specRight").hide();
      }
    }
    picAuto();

    $(".reviews_list").on("click", ".img-item", function(){
        var img = $(this).prop("src");
        var $bigImg = $(this).parents(".picture").find(".big_picture img");
        if(img == $bigImg.prop("src") && $(this).parents("li").hasClass("active")){
            $bigImg.prop("src","").hide();
        }else{
            $bigImg.prop("src",img).show();
        }
        $(this).parent("li").addClass("active").siblings().removeClass("active");
    })
});
