var screen_w = parseInt(window.screen.width);
if(screen_w < 768){
  var creat_meta = document.createElement('meta');
  creat_meta.name = 'viewport';
  creat_meta.content='width=768,initial-scale=0.333333333,minimum-scale=0.333333333,maximum-scale=0.333333333,user-scalable=no';
  document.head.appendChild(creat_meta);
}else if(screen_w <= 1199){
  var creat_meta = document.createElement('meta');
  creat_meta.name = 'viewport';
  creat_meta.content='width=768,initial-scale=0.55333333,minimum-scale=0.55333333,maximum-scale=0.55333333,user-scalable=no';
  document.head.appendChild(creat_meta);
}
var currency = "$";
var emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
var checkLogin = document.cookie.indexOf("customer_token") > -1;
var openBox = function() {
  $("html").css("margin-right", window.innerWidth - document.documentElement.clientWidth);
  $("html").addClass("window-scroll-fixed");
}
var closeBox = function() {
  $("html").removeClass("window-scroll-fixed");
  $("html").css("margin-right", 0);
}
var login = function() {
  openBox();
  $(".sign-wapper").show();
  $(".common-bg").show();
}
var btnHandle = function(btnSubmit) {
  if(btnSubmit) {
    btnSubmit.removeAttr("disabled");
    btnSubmit.next(".loading").hide();
  }
}
var ajaxSuccess = function(data, successCallback, btnSubmit) {
  if(data) {
    if(data.code == 200) {
      successCallback && successCallback();
    } else if(data.code == 400) {
      showMsg(data.message);
      btnHandle(btnSubmit);
    } else if(data.code == 401) {
      btnHandle(btnSubmit);
      login();
    }
  } else {
    showMsg("System busy");
    btnHandle(btnSubmit);
  }
}
//列表页，详情页添加心愿单(不包括购物车)
var addWish = function(obj) {
  var $this = $(obj).find("i");
  var act = $this.hasClass("active") ? "delete" : "add";
  var pid = $this.attr("data-id");
  if(pid) {
    $.ajax({
      url: '/api/wish/setWish',
      type: 'POST',
      data: {
        product_id: pid,
        action: act
      },
      success: function(data) {
        ajaxSuccess(data, function() {
          $this.toggleClass("active");
          getWish();
        });
      }
    })
  }
}
var getWish = function() {
  if(checkLogin) {
    $(".wish-sign").show();
    $(".wish-sign.not").hide();
  }
  $.ajax({
    url: "/api/wish/getWish",
    type: "POST",
    success: function(data) {
      ajaxSuccess(data, function() {
        var wishs = data.data;
        var html = "";
        for(var i = 0; i < wishs.length; i++) {
          html += '<li><a title="' + wishs[i].product_name + '" href="' + wishs[i].url + '"><img src="' + wishs[i].image + '"></a></li>'
          if(i == 2) break;
        }
        if(html) {
          $(".wishlist-header ul").html(html);
          if(wishs.length > 3 && $(".wishlist-header ul").next("div").length == 0) {
            html = '<div class="wish-signin"><div class="sing_in"><span>Fulfill your wishs</span><a href="/account/login">Sign in</a></div><div class="view_all"><a href="/account/wish"><span>View All</span></a></div></div>';
            $(".wishlist-header ul").append(html);
            checkLogin ? $(".wish-signin .sing_in").hide() : "";
          }
          $("span.wish-num").html(wishs.length);
        } else {
          html = '<p class="wish-sign not">Did you find something you really, really want? </p><p><a href="http://dev.a.songmics.com/account/login">Sign in</a>to keep track of your favorites—anytime, anywhere.</p>';
          if(checkLogin) {
            html = '<p class="wish-sign">Did you find something you really, really want? </p><p>Keep track of your favorites.</p>';
          }
          $(".wishlist-header ul").html(html);
          $("span.wish-num").html(0);
        }
      });
    }
  })
}
var getShopcartItem = function() {
  $.ajax({
    url: "/api/cart/getCart",
    type: "POST",
    success: function(data) {
      ajaxSuccess(data, function() {
        var carts = data.data.carts;
        var total = data.data.total;
        if(carts) {
          var html = "";
          for(var i = 0; i < carts.length; i++) {
            html += '<li>';
            html += '<div class="shopcartList">';
            html += '<div class="shopcartList_left">';
            html += '<a title="' + carts[i].product_name + '" href="' + carts[i].url + '"><img src="' + carts[i].image + '"></a>';
            html += '</div>';
            html += '<div class="shopcartList_Right">';
            html += '<div class="list_Right_top">';
            html += '<a href="' + carts[i].url + '" title="' + carts[i].product_name + '" class="shopcartName">' + carts[i].product_name + '</a>';
            html += '</div>';
            html += '<div class="list_Right_bottom">';
            html += '<div class="left">';
            html += '<span>Qty: <i class="number">' + carts[i].count + '</i></span>';
            html += '</div>';
            html += '<div class="right">';
            html += '<span class="price">' + currency + carts[i].subtotal + '</span>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</li>';
            if(i == 3) break;
          }
          if(html) {
            $(".shopcart-header ul").html(html);
            $(".shopcart-header .shopcart_viewAll span").html("SHOWING " + (carts.length > 3 ? 4 : carts.length) + " OF " + carts.length);
            $(".shopcart-header .all_price").html(currency + total.total);
            $(".shopcart-header span.cart-num").html(carts.length);
            $(".shopcart-header .shopcart_viewAll").show();
            $(".shopcart-header .view_all").show();
            $(".shopcart-header .checkedOut").show();
          }
        }
      });
    }
  })
}

var stripScript = function(s) {
  var pattern = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——|{}【】‘；：”“'。，、？+]");
  if(s.length == 0)
    return;
  var rs = "";
  for(var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '')
  }
  return rs;
}

var search = function() {
  var key = $("#search_key").val();
  key = stripScript(key);
  if(key != "") {
    key = jQuery.trim(key);
    key = key.replace(/\s+/gi, "-");
    key = key.replace(/\*/gi, "-");
    key = key.replace(/\+/gi, "-");
    key = key.replace(/\?/gi, "-");
    key = key.replace(/ˇ/gi, "");
    key = key.replace(/!/gi, "");
    key = key.replace(/@/gi, "");
    key = key.replace(/%/gi, "");
    key = key.replace(/</gi, "");
    key = key.replace(/>/gi, "");
    key = key.replace(/&/gi, "");
    key = key.replace(/\|/gi, "");
    key = key.replace(/#/gi, "");
    key = key.replace(/\//gi, "");
    key = key.replace(/\(/gi, "");
    key = key.replace(/\)/gi, "");
    key = key.replace(/\[/gi, "");
    key = key.replace(/\]/gi, "");
    key = key.replace(/"/gi, "");
    key = key.replace(/'/gi, "");
    key = key.replace(/\//gi, "");
    key = key.replace(/\\/gi, "")
  }
  key = key.replace(/(^-*)|(-*$)/gi, '');
  key = key.trim();
  if(key == "") {
    return;
  }
  var href = "/search?k="
  var param = encodeURI(key);
  var url = href + param;
  window.location.href = url;
}

function checkSocalLogin(url, time) {
  setInterval(function() {
    if(document.cookie.indexOf("customer_token") > -1) {
      window.location.href = url;
    }
  }, time || 2000);
}

function openWin(openUrl, title) {
  var iWidth = 800;
  var iHeight = 800;
  var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
  var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
  window.open(openUrl, title || "", "height=" + iHeight + ", width=" + iWidth + ", top=" + iTop + ", left=" + iLeft);
}

function getRequest() {
  var url = location.search;
  var theRequest = new Object();
  if(url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for(var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

function showMsg(msg, time) {
  $("body").append('<div class="layer-msg"><span>' + msg + '</span></div>');
  setTimeout("$('.layer-msg').remove()", time || 2000);
}

$(document).ready(function() {
  getShopcartItem();
  getWish();

  $('.sign-wapper .facebook,.sign-wapper .google').on('click', function() {
    openWin($(this).attr('data-url'));
    checkSocalLogin(window.location.href);
  });

  if(checkLogin) {
    $(".personalDetail .sign_in").hide();
    $(".personalDetail .sign_up").hide();
    $(".wishlist-header .sing_in").hide();
  } else {
    $(".personalDetail .sign_out").hide();
  }

  $(".sign-wapper .close").on("click", function() {
    $(".sign-wapper").hide();
    $(".common-bg").hide();
    closeBox();
  });
  $(".sign-wapper .loginSumit").on("click", function() {
    $(".sign-wapper .loading").show();
    var email = $("#login_email").val();
    var password = $("#login_pwd").val();
    $.ajax({
      url: "/api/account/login",
      type: "POST",
      data: {
        email: email,
        password: password
      },
      success: function(data) {
        ajaxSuccess(data, function(){
          window.location.href = window.location.href;
        })
      }
    })
  });

  $(".footer .emailInput button").on("click", function() {
    var email = $("#btn_subscription").val();
    var $errObj = $(".footerList .err_msg");
    if(email) {
      if(emailReg.test(email)) {
        $errObj.html("");
        $.ajax({
          url: "/api/subscription",
          type: "POST",
          data: {
            email: email
          },
          success: function(data) {
            ajaxSuccess(data, function(){
              showMsg(data.message);
            });
          }
        })
      } else {
        $errObj.html("Please enter a valid email address");
      }
    } else {
      $errObj.html("This is a required field");
    }
  })

  window.confirm = function(message, yesCallBack, noCallBack) {
    if(message && yesCallBack) {
      var html = '<div class="layer-confirm">';
      html += '<i class="close iconfont icon-close"></i>';
      html += "<span class='tipsTitle'>" + message + "</span>";
      html += '<div class="operationSubmit">';
      html += '<span class="layer-yes">Yes</span>';
      html += '<span class="layer-no">No</span>';
      html += '</div></div>';
      $("body").append(html);
      $(".common-bg").show();
      openBox();
      $(".layer-confirm .layer-yes").on("click", function() {
        yesCallBack();
        closeBox();
      })

      $(".layer-confirm .layer-no").on("click", function() {
        noCallBack && noCallBack();
        $(".layer-confirm").remove();
        $(".common-bg").hide();
        closeBox();
      })
      $(".layer-confirm .close").on("click", function() {
        $(".layer-confirm").remove();
        $(".common-bg").hide();
        closeBox();
      })
    } else {
      showMsg("message or callback error");
    }
  }

  $(".btn_search").on("click", function() {
    search();
  });

  $(".track-order .close").on("click", function() {
    $(".track-order").hide();
    $(".common-bg").hide();
    closeBox();
  })
})