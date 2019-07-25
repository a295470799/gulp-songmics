"use strict";var shopCart={successHandle:function(t){$(".shopCart_right .cart-subtotal").html(currency+t.subtotal),$(".shopCart_right .cart-shipping").html(t.shipping),$(".shopCart_right .cart-tax").html(t.tax),$(".shopCart_right .cart-total").html(currency+t.total)},add:function(t,a,c){t&&$.ajax({url:"/api/cart/setProductCount",type:"POST",data:{product_id:t,action:"increment",count:a||1},success:function(t){ajaxSuccess(t,function(){c&&c(),getShopcartItem()})}})},delete:function(t,a){$.ajax({url:"/api/cart/delete",type:"POST",data:{product_id:t},success:function(t){ajaxSuccess(t,function(){t.data.carts&&0!=t.data.carts.length||(window.location.href=window.location.href),shopCart.successHandle(t.data.total),a&&a(),getShopcartItem()})}})},updateCount:function(n,t,i){n&&t&&$.ajax({url:"/api/cart/setProductCount",type:"POST",data:{product_id:n,action:"update",count:t},success:function(c){ajaxSuccess(c,function(){getShopcartItem();var t=c.data&&c.data.carts;if(t){var a=t.find(function(t){return t.product_id==n});a&&($(i).parents("ul").find(".price").html(currency+a.subtotal),a.discount&&0<parseFloat(a.discount)&&$(i).parents("ul").find(".old_price").html(currency+a.discount_price),shopCart.successHandle(c.data.total))}})}})},addWish:function(t){t&&$.ajax({url:"/api/wish/setWish",type:"POST",data:{product_id:t,action:"add"},success:function(t){ajaxSuccess(t,function(){getWish()})}})}};$(document).ready(function(){$(".shopcart_template").on("click",".cart-remove",function(){var t=$(this);shopCart.delete(t.parents("ul").attr("data-id"),function(){t.parents("ul").remove()})}),$(".shopcart_template").on("click",".cart-addwish",function(){var t=$(this);shopCart.addWish(t.parents("ul").attr("data-id"))}),$(".shopcart_template").on("click",".icon-add",function(){var t=parseInt($(this).siblings("input").val())+1;$(this).siblings("input").val(t),shopCart.updateCount($(this).parents("ul").attr("data-id"),t,this)}),$(".shopcart_template").on("click",".icon-reduce",function(){var t=$(this).siblings("input"),a=parseInt($(this).siblings("input").val());if(a<2)return!1;a--,t.val(a),shopCart.updateCount($(this).parents("ul").attr("data-id"),a,this)}),$(".shopcart_template").on("blur","input.cart-count",function(){var t=$(this).val();t=t<2?1:t,$(this).val(t),shopCart.updateCount($(this).parents("ul").attr("data-id"),t,this)})});