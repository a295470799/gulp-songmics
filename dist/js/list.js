$(document).ready(function(){
  //列表页产品双图切换-mousemove
  $(".list-products").on("mousemove", ".product-list dt", function() {
    var $img = $(this).find("img");
    var nextImg = $img.attr("data-next");
    $img.prop("src", nextImg)
    $(this).find(".quick-review").show();
  })
  //列表页产品双图切换-mouseout
  $(".list-products").on("mouseout", ".product-list dt", function() {
    var $img = $(this).find("img");
    var original = $img.attr("data-original");
    $img.prop("src", original);
    $(this).find(".quick-review").hide();
  })
  //QuickView
  $(".list-products").on("click", ".quick-review", function() {
    getQuickView($(this).attr("data-id"));
    openBox();
  })
  //QuickView弹窗关闭
  $(".list-main").on("click",".qv-close", function() {
    $(".qv-main").remove();
    $(".bg-qucik").hide();
    closeBox();
  })
  //QuickView数量操作：增加
  $(".list-main").on("click", ".qty-up", function() {
    var $qty = $(this).siblings("input");
    checkQty($qty, "u");
  })
  //QuickView数量操作：减少
  $(".list-main").on("click", ".qty-down", function() {
    var $qty = $(this).siblings("input");
    checkQty($qty, "d");
  })
  //QuickView数量操作：焦点离开
  $(".list-main").on("blur", "#qty_num", function() {
    checkQty($(this));
  })
  //列表页价格筛选逻辑
  $(".list-filter-price-ok").on("click", function() {
    var begin = $("#price-begin").val();
    var end = $("#price-end").val();

    if(end || begin){
      begin = parseFloat(begin);
      end = parseFloat(end);
      if(begin<=0||end<=0){
        showMsg("Cannot be less than 0");
      }
      else if(begin>end){
        showMsg("incorrect price");
      }else{
        var cid =  $("#index_category_id").val();
        getProducts(true, begin, end);
      }
    }else{
      showMsg("Please enter price");
    }
  })
  //列表页价格筛选重置
  $(".list-filter-price-reset").on("click",function(){
    clearPrice();
  })
  //列表页底部加载更多
  $("#view_more").on("click",function(){
    getProducts(false);
  });
  //懒加载初始化
  $("img.lazy").lazyload({effect: "fadeIn"});
  //列表页三级类目切换
  // $(".list-filter-cate span[data-id]").on("click",function(){
  //   if($(this).hasClass("active")) return false;
  //   clearAll();
  //   var cid  = $(this).attr("data-id");
  //   if(cid){
  //     $("#index_category_id").val(cid);
  //     $(".list-filter-cate span[data-id]").removeClass("active");
  //     $(this).addClass("active");
  //     getProducts(true);
  //   }
  // })
  //列表页左侧排序(Best Selling, New Arrivals, Our Picks)
  $(".list-filter-ot span[data-type]").on("click",function(){
    $(".list-filter-ot span[data-type]").removeClass("active");
    $(this).addClass("active");
    clearRight();
    getProducts(true);
  })
  //列表页右侧排序(A to Z, Price:Low to High, Price:High to Low, Avg: Customer Rating)
  $(".sort-by-cont span[data-type]").on("click",function(){
    $(".sort-by-title span").attr("data-type",$(this).attr("data-type"));
    $(".sort-by-title span").html($(this).html());
    $(".list-filter-ot span[data-type]").removeClass("active");
    getProducts(true);
  })
  //列表产品/QuickView产品 加入/取消心愿单
  $(".list-main").on("click", ".addwish", function(){
    addWish(this);
  })
  //QuickView弹窗SKU切换
  $(".list-main").on("click", ".option span[data-sku]", function(){
    var pid = $(this).attr("data-pid");
    if(pid){
      getQuickView(pid);
    }
  })
  //添加购物车
  $(".list-main").on("click", ".addtocart", function(){
    var $this = $(this);
    shopCart.add($this.attr("data-id"), $("#qty_num").val(), function(){
        $this.html("Added");
        setTimeout(function(){$this.html('Add to Cart');},800)
    });
  })
})
//产品数量输入检查
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
//显示加载中
function showLoading(){
  $(".loading").show();
  $(".view-more").hide();
  $(".view-more .no-item").hide();
  $("#view_more").show();
}
//隐藏加载中
function hideLoading(){
  $(".loading").hide();
  $(".view-more").show();
}
//ajax加载无数据处理
function noData(filter,total){
  if(filter){
    $(".list-products").html('');
    $("#view_more").hide();
    $(".view-more .no-item").show();
  }else{
    $(".loading").hide();
    $(".view-more").hide();
  }
  if(total && total > 0){
    $(".view-more").hide();
  }
}
//ajax加载产品
var pageIndex = 1;
function getProducts(filter, minPrice, maxPrice){
  var cid = $("#index_category_id").val();
  if(cid){
    showLoading();
    var url = "/api/product/getProducts";
    if(filter) pageIndex=0;
    pageIndex++;
    var order = $(".sort-by-title span").attr("data-type") || $(".list-filter-ot span[data-type].active").attr("data-type");
    $.ajax({
      url: url,
      type: "POST",
      data: {
        page: pageIndex,
        category_id: cid,
        min_price: minPrice | 0,
        max_price: maxPrice | 0,
        order: order,
        label: ""
      },
      success:function(data){
        ajaxSuccess(data, function(){
          hideLoading();
          var jsonData = data.data;
          if(jsonData){
            if(jsonData.nav){
              $(".bread-crumbs").html(jsonData.nav);
            }
            var page_count = parseInt(jsonData.page_count);
            var page_size = parseInt(jsonData.params.page_size);
            var total = parseInt(jsonData.total);

            if(page_count * page_size > total) {
              noData(filter,total);
            }
            var html = "";
            var products = jsonData.products;
            if(products && products.length > 0){
              for (var i = 0; i < products.length; i++) {
                var discount = parseFloat(products[i].discount);
                var productUrl = products[i].url;
                var productname = products[i].product_name;
                html += '<dl class="product-list">';
                html += '<dt>';
                html += '<a href="'+ productUrl +'" title="'+ productname +'">';
                html += '<img src="'+ products[i].image +'" data-original="'+ products[i].image +'" data-next="'+ products[i].image_addition +'" alt="'+ productname +'">';
                html += '</a>';
                if(products[i].label){
                  html += '<div class="special-icon">'+ products[i].label +'</div>';
                }
                else if(discount > 0){
                  discount = discount * 100;
                  html += '<div class="off-sale">';
                  if(discount<10){
                    html += '<span>&nbsp;&nbsp;'+ discount +'</span>'
                  }else{
                    html += '<span>'+ discount +'</span>'
                  }
                  html += '</div>';
                }
                html += '<div class="addwish">';
                var active = products[i].wish == 1 ? 'active' : '';
                html += '<i data-id="'+ products[i].id +'" class="iconfont '+ active +'"></i>'
                html += '</div>';
                html += '<div data-id="'+ products[i].id +'" class="quick-review">quick view</div>';
                html += '</dt><dd>';
                html += '<p>';
                html += '<a href="'+ productUrl +'" title="'+ productname +'">'+ productname +'</a>';
                html += '</p>';
                if(discount > 0){
                  html += '<div class="p-price">';
                  html += '<div class="current-price">';
                  html += '<span>$</span><span>'+ products[i].price +'</span>';
                  html += '</div>';
                  html += '<del class="original-price">';
                  html += '<span>$</span><span>'+ products[i].discount_price +'</span>';
                  html += '</del>';
                  html += '</div>';
                }else{
                  html += '<div class="p-price">';
                  html += '<span>$</span><span>'+ products[i].price +'</span>';
                  html += '</div>';
                }
                html += '</dd></dl>';
                
              }
              
              if(filter){
                $(".list-products").html(html);
              }else{
                $($(".product-list")[$(".product-list").length-1]).after(html);
              }
            }else{
              noData(filter);
            }
          }
        })
      }
    })
  }
}
//ajax加载QuickView数据
function getQuickView(pid) {
  if(pid){
    var url = "/api/product/getProductQuick";
    $.ajax({
      url: url,
      type: 'POST',
      data: {
        product_id: pid
      },
      success:function(data){
        ajaxSuccess(data, function(){
          var jsonData = data.data;
          var images = jsonData.images;
          var attributes = jsonData.attributes;
          var active = "";
          if($(".qv-main")) $(".qv-main").remove();
          var html = '<div class="qv-main">';
          html += '<div class="iconfont icon-close qv-close"></div>';
          html += '<div class="qv-pics">';
          html += '<div class="swiper-container gallery-top">';
          html += '<div class="swiper-wrapper">';
          for (var i = 0; i < images.length; i++) {
             html += '<div class="swiper-slide"><img src="'+ images[i].image +'" /></div>';
          }
          html += '</div>';
          html += '</div>';
          html += '<div class="swiper-container gallery-thumbs">';
          html += '<div class="swiper-wrapper">';
          for (var i = 0; i < images.length; i++) {
            html += '<div class="swiper-slide"><img src="'+ images[i].image +'" /></div>';
          }
          html += '</div>';
          html += '<div class="swiper-button-next swiper-button-white"></div>';
          html += '<div class="swiper-button-prev swiper-button-white"></div>';
          html += '</div>';
          html += '</div>';
          html += '<div class="qv-content">';
          html += '<div class="qv-title">';
          html += '<div class="qv-stitle">'+ jsonData.short_name +'</div>';
          html += '<div class="av-ltitle">'+ jsonData.name +'</div>';
          html += '</div>';
          html += '<div class="qv-price">';
          html += '<div class="qv-nprice">';
          html += '<span>$</span><span>'+ jsonData.price +'</span>';
          html += '</div>';
          if(parseFloat(jsonData.discount) > 0){
            html += '<del class="qv-oprice">';
            html += '<span>$</span><span>'+ jsonData.discount_price +'</span>';
            html += '</del>';
          }
          html += '</div>';
          html += '<div class="qv-middle points">';
          html += '<span class="qv-freeship">free shipping</span>';
          html += '<span>|</span>';
          html += '<span>'+ jsonData.comment_count +' Reviews</span>';
          html += '<span class="star star' + jsonData.star+'"></span>';
          html += '<span>' + jsonData.pointProportion +' points</span>';
          html += '</div>';

          html += '<div class="qv-options">';
          attributes = objOfValueToArr(attributes);
          for (var i = 0; i < attributes.length; i++) {
            html += '<div class="option">';
            html += '<div class="item-left" data-id="'+ attributes[i].attribute_id +'">'+ attributes[i].attribute_name +'</div>';
            attributes[i].attribute_option = objOfValueToArr(attributes[i].attribute_option);
            for (var j = 0; j < attributes[i].attribute_option.length; j++) {
              var attributesId = attributes[i].attribute_option[j].id;
              var attributesName = attributes[i].attribute_option[j].attribute_option_value;
              active = attributes[i].attribute_option[j].selected == 1 ? "item active" :"";
              var className = attributes[i].attribute_option[j].is_click == 1 ? "item" :"";
              var options = "";
              if(className){
                options+=' data-pid="'+ attributes[i].attribute_option[j].product_id +'" data-sku="'+ attributes[i].attribute_option[j].sku +'"';
              }
              html += '<span'+options+' data-id="'+ attributesId +'" data-name="'+ attributesName +'" class="'+className+active+'">'+ attributesName +'</span>';
            }
            html += '</div>';
          }
          html += '<div class="option-qty">';
          html += '<div class="item-qty">QTY</div>';
          html += '<div class="item-qty-num">';
          html += '<input type="number" min="1" max="10" id="qty_num" value="1" />';
          html += '<span class="qty-up"></span>';
          html += '<span class="qty-down"></span>';
          html += '</div>';
          html += '</div>';
          html += '<div class="option-buy">';
          html += '<span data-id="'+ jsonData.id +'" class="addtocart">Add to Cart</span>';
          html += '<a href=""><span class="buyamazon">Buy on Amazon</span></a>';
          html += '</div>';
          html += '<div class="addwish">';
          html += '<div>';
          active = jsonData.wish == 1 ? "active" :"";
          html += '<i data-id="'+ jsonData.id +'" class="iconfont icon-likeHover '+ active +'"></i>';
          html += '<span>Add to Wish List</span>';
          html += '</div>';
          html += '</div>';
          html += '</div>';

          html+='<div class="qv-details"><a href="'+ jsonData.url +'">View Full Details</a></div>';
          html+='</div>';
          html+='</div>';

          $(".list-main").append(html);

          var galleryThumbs = new Swiper('.gallery-thumbs', {
            spaceBetween: 10,
            slidesPerView: 6,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            observer:true, 
            observeParents:true
          });
          var galleryTop = new Swiper('.gallery-top', {
            spaceBetween: 10,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            thumbs: {
              swiper: galleryThumbs
            },
            observer:true, 
            observeParents:true
          });

          $(".qv-main").show();
          $(".bg-qucik").show();
        });
      }
    })
  }
}
//把对象转为数组
function objOfValueToArr(object) {
    var arr = [];
    var i = 0;
    for (var item in object) {
        arr[i] = object[item];
        i++;
    }
    return arr;
}
//重置所有筛选条件
function clearAll(){
  clearLeft();
  clearPrice();
  clearRight();
}
//左侧排序重置
function clearLeft(){
  $(".list-filter-ot span[data-type]").removeClass("active");
  $($(".list-filter-ot span[data-type]")[0]).addClass("active");
}
//价格筛选重置
function clearPrice(){
  $("#price-begin").val('');
  $("#price-end").val('');
}
//右侧排序重置
function clearRight(){
  $(".sort-by-title span").html("Most Relevant").attr("data-type","");
}