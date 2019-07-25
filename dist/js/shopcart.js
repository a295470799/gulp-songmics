var shopCart = {
	successHandle: function(total){
		//购物车操作成功之后修改CART SUMMARY价格
		$(".shopCart_right .cart-subtotal").html(currency + total.subtotal);
		$(".shopCart_right .cart-shipping").html(total.shipping);
		$(".shopCart_right .cart-tax").html(total.tax);
		$(".shopCart_right .cart-total").html(currency + total.total);
	},
	add: function(pid, count, nextFun) {
		if(pid){
			$.ajax({
				url: "/api/cart/setProductCount",
				type: "POST",
				data: {
					product_id: pid,
					action: "increment",
					count: count || 1
				},
				success: function(data){
					ajaxSuccess(data, function(){
						nextFun && nextFun();
						getShopcartItem();
					})
				}
			})
		}
	},
	delete: function(pid, nextFun){
		$.ajax({
			url: "/api/cart/delete",
			type: "POST",
			data: {
				product_id: pid
			},
			success: function(data){
				ajaxSuccess(data, function(){
					if(!data.data.carts || data.data.carts.length == 0){
						window.location.href = window.location.href;
					}
					shopCart.successHandle(data.data.total);
					nextFun && nextFun();
					getShopcartItem();
				})
			}
		})
	},
	updateCount: function(pid, count, obj){
		if(pid && count){
			$.ajax({
				url: "/api/cart/setProductCount",
				type: "POST",
				data: {
					product_id: pid,
					action: "update",
					count: count
				},
				success: function(data){
					ajaxSuccess(data, function(){
						getShopcartItem();
						var carts = data.data && data.data.carts;
						if(carts){
							var product = carts.find(function (item){
								return item.product_id == pid;
							})
							if(product){
								$(obj).parents("ul").find(".price").html(currency + product.subtotal);
								if(product.discount && parseFloat(product.discount) > 0){
									$(obj).parents("ul").find(".old_price").html(currency + product.discount_price);	
								}
								shopCart.successHandle(data.data.total);
							}
						}
					})
				}
			})
		}
	},
	addWish: function(pid){
		if(pid){
			$.ajax({
				url: '/api/wish/setWish',
				type: 'POST',
				data:{
				product_id: pid,
				action: "add"
				},
				success: function(data){
					ajaxSuccess(data, function(){
						getWish();
					});
				}
			})
		}
	}
}
$(document).ready(function(){
	$(".shopcart_template").on("click", ".cart-remove", function(){
		var $this = $(this);
		shopCart.delete($this.parents("ul").attr("data-id"),function(){
			$this.parents("ul").remove();
		})
	})
	$(".shopcart_template").on("click", ".cart-addwish", function(){
		var $this = $(this);
		shopCart.addWish($this.parents("ul").attr("data-id"));
	})
	$(".shopcart_template").on("click", ".icon-add", function(){
		var count = parseInt($(this).siblings("input").val()) + 1;
		$(this).siblings("input").val(count)
		shopCart.updateCount($(this).parents("ul").attr("data-id"),count,this);
	})
	$(".shopcart_template").on("click", ".icon-reduce", function(){
		var $count = $(this).siblings("input");
		var count = parseInt($(this).siblings("input").val());
		if(count < 2){
			return false;
		}
		count--;
		$count.val(count);
		shopCart.updateCount($(this).parents("ul").attr("data-id"),count,this);
	})
	$(".shopcart_template").on("blur", "input.cart-count", function(){
		var count = $(this).val();
		count = count < 2 ? 1 :count;
		$(this).val(count);
		shopCart.updateCount($(this).parents("ul").attr("data-id"),count,this);
	})
})