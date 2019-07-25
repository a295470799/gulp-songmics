"use strict";function MouseEvent(e){this.x=e.pageX,this.y=e.pageY}!function(r){r.extend(r.fn,{livequery:function(i,n,u){var o,s=this;return r.isFunction(i)&&(u=n,n=i,i=void 0),r.each(r.livequery.queries,function(e,t){if(!(s.selector!=t.selector||s.context!=t.context||i!=t.type||n&&n.$lqguid!=t.fn.$lqguid||u&&u.$lqguid!=t.fn2.$lqguid))return(o=t)&&!1}),(o=o||new r.livequery(this.selector,this.context,i,n,u)).stopped=!1,r.livequery.run(o.id),this},expire:function(i,n,u){var o=this;return r.isFunction(i)&&(u=n,n=i,i=void 0),r.each(r.livequery.queries,function(e,t){o.selector!=t.selector||o.context!=t.context||i&&i!=t.type||n&&n.$lqguid!=t.fn.$lqguid||u&&u.$lqguid!=t.fn2.$lqguid||this.stopped||r.livequery.stop(t.id)}),this}}),r.livequery=function(e,t,i,n,u){return this.selector=e,this.context=t||document,this.type=i,this.fn=n,this.fn2=u,this.elements=[],this.stopped=!1,this.id=r.livequery.queries.push(this)-1,n.$lqguid=n.$lqguid||r.livequery.guid++,u&&(u.$lqguid=u.$lqguid||r.livequery.guid++),this},r.livequery.prototype={stop:function(){var i=this;this.type?this.elements.unbind(this.type,this.fn):this.fn2&&this.elements.each(function(e,t){i.fn2.apply(t)}),this.elements=[],this.stopped=!0},run:function(){if(!this.stopped){var i=this,e=this.elements,n=r(this.selector,this.context),t=n.not(e);this.elements=n,this.type?(t.bind(this.type,this.fn),0<e.length&&r.each(e,function(e,t){r.inArray(t,n)<0&&r.event.remove(t,i.type,i.fn)})):(t.each(function(){i.fn.apply(this)}),this.fn2&&0<e.length&&r.each(e,function(e,t){r.inArray(t,n)<0&&i.fn2.apply(t)}))}}},r.extend(r.livequery,{guid:0,queries:[],queue:[],running:!1,timeout:null,checkQueue:function(){if(r.livequery.running&&r.livequery.queue.length)for(var e=r.livequery.queue.length;e--;)r.livequery.queries[r.livequery.queue.shift()].run()},pause:function(){r.livequery.running=!1},play:function(){r.livequery.running=!0,r.livequery.run()},registerPlugin:function(){r.each(arguments,function(e,t){if(r.fn[t]){var i=r.fn[t];r.fn[t]=function(){var e=i.apply(this,arguments);return r.livequery.run(),e}}})},run:function(e){null!=e?r.inArray(e,r.livequery.queue)<0&&r.livequery.queue.push(e):r.each(r.livequery.queries,function(e){r.inArray(e,r.livequery.queue)<0&&r.livequery.queue.push(e)}),r.livequery.timeout&&clearTimeout(r.livequery.timeout),r.livequery.timeout=setTimeout(r.livequery.checkQueue,20)},stop:function(e){null!=e?r.livequery.queries[e].stop():r.each(r.livequery.queries,function(e){r.livequery.queries[e].stop()})}}),r.livequery.registerPlugin("append","prepend","after","before","wrap","attr","removeAttr","addClass","removeClass","toggleClass","empty","remove"),r(function(){r.livequery.play()});var n=r.prototype.init;r.prototype.init=function(e,t){var i=n.apply(this,arguments);return e&&e.selector&&(i.context=e.context,i.selector=e.selector),"string"==typeof e&&(i.context=t||document,i.selector=e),i},r.prototype.init.prototype=r.prototype}(jQuery),jQuery.easing.jswing=jQuery.easing.swing,jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,t,i,n,u){return jQuery.easing[jQuery.easing.def](e,t,i,n,u)},easeInQuad:function(e,t,i,n,u){return n*(t/=u)*t+i},easeOutQuad:function(e,t,i,n,u){return-n*(t/=u)*(t-2)+i},easeInOutQuad:function(e,t,i,n,u){return(t/=u/2)<1?n/2*t*t+i:-n/2*(--t*(t-2)-1)+i},easeInCubic:function(e,t,i,n,u){return n*(t/=u)*t*t+i},easeOutCubic:function(e,t,i,n,u){return n*((t=t/u-1)*t*t+1)+i},easeInOutCubic:function(e,t,i,n,u){return(t/=u/2)<1?n/2*t*t*t+i:n/2*((t-=2)*t*t+2)+i},easeInQuart:function(e,t,i,n,u){return n*(t/=u)*t*t*t+i},easeOutQuart:function(e,t,i,n,u){return-n*((t=t/u-1)*t*t*t-1)+i},easeInOutQuart:function(e,t,i,n,u){return(t/=u/2)<1?n/2*t*t*t*t+i:-n/2*((t-=2)*t*t*t-2)+i},easeInQuint:function(e,t,i,n,u){return n*(t/=u)*t*t*t*t+i},easeOutQuint:function(e,t,i,n,u){return n*((t=t/u-1)*t*t*t*t+1)+i},easeInOutQuint:function(e,t,i,n,u){return(t/=u/2)<1?n/2*t*t*t*t*t+i:n/2*((t-=2)*t*t*t*t+2)+i},easeInSine:function(e,t,i,n,u){return-n*Math.cos(t/u*(Math.PI/2))+n+i},easeOutSine:function(e,t,i,n,u){return n*Math.sin(t/u*(Math.PI/2))+i},easeInOutSine:function(e,t,i,n,u){return-n/2*(Math.cos(Math.PI*t/u)-1)+i},easeInExpo:function(e,t,i,n,u){return 0==t?i:n*Math.pow(2,10*(t/u-1))+i},easeOutExpo:function(e,t,i,n,u){return t==u?i+n:n*(1-Math.pow(2,-10*t/u))+i},easeInOutExpo:function(e,t,i,n,u){return 0==t?i:t==u?i+n:(t/=u/2)<1?n/2*Math.pow(2,10*(t-1))+i:n/2*(2-Math.pow(2,-10*--t))+i},easeInCirc:function(e,t,i,n,u){return-n*(Math.sqrt(1-(t/=u)*t)-1)+i},easeOutCirc:function(e,t,i,n,u){return n*Math.sqrt(1-(t=t/u-1)*t)+i},easeInOutCirc:function(e,t,i,n,u){return(t/=u/2)<1?-n/2*(Math.sqrt(1-t*t)-1)+i:n/2*(Math.sqrt(1-(t-=2)*t)+1)+i},easeInElastic:function(e,t,i,n,u){var o=1.70158,s=0,r=n;if(0==t)return i;if(1==(t/=u))return i+n;if(s||(s=.3*u),r<Math.abs(n)){r=n;o=s/4}else o=s/(2*Math.PI)*Math.asin(n/r);return-r*Math.pow(2,10*(t-=1))*Math.sin((t*u-o)*(2*Math.PI)/s)+i},easeOutElastic:function(e,t,i,n,u){var o=1.70158,s=0,r=n;if(0==t)return i;if(1==(t/=u))return i+n;if(s||(s=.3*u),r<Math.abs(n)){r=n;o=s/4}else o=s/(2*Math.PI)*Math.asin(n/r);return r*Math.pow(2,-10*t)*Math.sin((t*u-o)*(2*Math.PI)/s)+n+i},easeInOutElastic:function(e,t,i,n,u){var o=1.70158,s=0,r=n;if(0==t)return i;if(2==(t/=u/2))return i+n;if(s||(s=u*(.3*1.5)),r<Math.abs(n)){r=n;o=s/4}else o=s/(2*Math.PI)*Math.asin(n/r);return t<1?r*Math.pow(2,10*(t-=1))*Math.sin((t*u-o)*(2*Math.PI)/s)*-.5+i:r*Math.pow(2,-10*(t-=1))*Math.sin((t*u-o)*(2*Math.PI)/s)*.5+n+i},easeInBack:function(e,t,i,n,u,o){return null==o&&(o=1.70158),n*(t/=u)*t*((o+1)*t-o)+i},easeOutBack:function(e,t,i,n,u,o){return null==o&&(o=1.70158),n*((t=t/u-1)*t*((o+1)*t+o)+1)+i},easeInOutBack:function(e,t,i,n,u,o){return null==o&&(o=1.70158),(t/=u/2)<1?n/2*(t*t*((1+(o*=1.525))*t-o))+i:n/2*((t-=2)*t*((1+(o*=1.525))*t+o)+2)+i},easeInBounce:function(e,t,i,n,u){return n-jQuery.easing.easeOutBounce(e,u-t,0,n,u)+i},easeOutBounce:function(e,t,i,n,u){return(t/=u)<1/2.75?n*(7.5625*t*t)+i:t<2/2.75?n*(7.5625*(t-=1.5/2.75)*t+.75)+i:t<2.5/2.75?n*(7.5625*(t-=2.25/2.75)*t+.9375)+i:n*(7.5625*(t-=2.625/2.75)*t+.984375)+i},easeInOutBounce:function(e,t,i,n,u){return t<u/2?.5*jQuery.easing.easeInBounce(e,2*t,0,n,u)+i:.5*jQuery.easing.easeOutBounce(e,2*t-u,0,n,u)+.5*n+i}}),function(l){l.fn.jqueryzoom=function(e){var c={xzoom:200,yzoom:200,offset:10,position:"right",lens:1,preload:1};e&&l.extend(c,e);var t="";l(this).hover(function(){var o=l(this).offset().left,s=l(this).offset().top,r=l(this).children("img").get(0).offsetWidth,a=l(this).children("img").get(0).offsetHeight;t=l(this).children("img").attr("alt");var e=l(this).children("img").attr("jqimg");if(""==e)return!1;l(this).children("img").attr("alt",""),0==l("div.zoomdiv").get().length&&(l(this).after("<div class='zoomdiv'><img class='bigimg' src='"+e+"'/></div>"),l(this).append("<div class='jqZoomPup'>&nbsp;</div>")),"right"==c.position?o+r+c.offset+c.xzoom>screen.width?leftpos=o-c.offset-c.xzoom:leftpos=o+r+c.offset:(leftpos=o-c.xzoom-c.offset,leftpos<0&&(leftpos=o+r+c.offset)),l("div.zoomdiv").css({top:s,left:leftpos}),l("div.zoomdiv").width(c.xzoom),l("div.zoomdiv").height(c.yzoom),l("div.zoomdiv").show(),c.lens||l(this).css("cursor","crosshair"),l(document.body).mousemove(function(e){mouse=new MouseEvent(e);var t=l(".bigimg").get(0).offsetWidth,i=l(".bigimg").get(0).offsetHeight,n="x",u="y";if(isNaN(u)|isNaN(n)){u=t/r,n=i/a;l("div.jqZoomPup").width(c.xzoom/u),l("div.jqZoomPup").height(c.yzoom/n),c.lens&&l("div.jqZoomPup").css("visibility","visible")}xpos=mouse.x-l("div.jqZoomPup").width()/2-o,ypos=mouse.y-l("div.jqZoomPup").height()/2-s,c.lens&&(xpos=mouse.x-l("div.jqZoomPup").width()/2<o?0:mouse.x+l("div.jqZoomPup").width()/2>r+o?r-l("div.jqZoomPup").width()-2:xpos,ypos=mouse.y-l("div.jqZoomPup").height()/2<s?0:mouse.y+l("div.jqZoomPup").height()/2>a+s?a-l("div.jqZoomPup").height()-2:ypos),c.lens&&l("div.jqZoomPup").css({top:ypos,left:xpos}),scrolly=ypos,l("div.zoomdiv").get(0).scrollTop=scrolly*n,scrollx=xpos,l("div.zoomdiv").get(0).scrollLeft=scrollx*u})},function(){l(this).children("img").attr("alt",t),l(document.body).unbind("mousemove"),c.lens&&l("div.jqZoomPup").remove(),l("div.zoomdiv").remove()}),count=0,c.preload&&(l("body").append("<div style='display:none;' class='jqPreload"+count+"'>sdsdssdsd</div>"),l(this).each(function(){var e=l(this).children("img").attr("jqimg"),t=jQuery("div.jqPreload"+count).html();jQuery("div.jqPreload"+count).html(t+'<img src="'+e+'">')}))}}(jQuery);