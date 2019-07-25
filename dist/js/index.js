$(document).ready(function(){
	var windowScroll_t;
    $(window).scroll(function(){
        clearTimeout(windowScroll_t);
        windowScroll_t = setTimeout(function() {
            if ($(this).scrollTop() > 100){
              $('.scroll-to-top').fadeIn();
            }else{
              $('.scroll-to-top').fadeOut();
            }
        }, 500);
        
    });
    
    $('.scroll-to-top').click(function(){
        $("html, body").animate({scrollTop: 0}, 1000, "easeOutCubic");
        return false;
    });
    var dragger = function (horizontal, scrollbar, content) {
      this.horizontal = document.getElementById(horizontal);
      this.scrollbar = document.getElementById(scrollbar);
      this.content = document.getElementById(content);
      this.init();
    };
    dragger.prototype = {
      init: function () {
        var f = this, g = document, b = window, m = Math;
        f.horizontal.onmousedown = function (e) {
          var x = (e || b.event).clientX;
          var l = this.offsetLeft;
          var max = f.scrollbar.offsetWidth - this.offsetWidth;
          g.onmousemove = function (e) {
            var thisX = (e || b.event).clientX;
            var to = m.min(max, m.max(-2, l + (thisX - x)));
            f.horizontal.style.left = to + 'px';
            var leftTo = (to / f.scrollbar.offsetWidth) * f.content.offsetWidth;
            f.ondrag(leftTo);
            b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
          };
          g.onmouseup = new Function('this.onmousemove=null');
        };
      },
      ondrag: function (x) {
        this.content.style.left = -Math.max(0, x) + 'px';
      }
    }
    function scrollInit(){
      var containerLi = $("#mZiel_container>ul>li");
      var liCount = containerLi.length;
      var divWidth = ((liCount-1) * $(containerLi[0]).outerWidth(true))+($(containerLi[liCount-1]).outerWidth());
      $("#mZiel_container").width(divWidth);
      var scrollBar = "mZiel_scrollbar_horizontal";
      var zielContainer = "mZiel_container";
      var proportion = $("#" + scrollBar).width() / $("#" + zielContainer).width();
      $("#mZiel_dragger_horizontal").width(proportion * $("#" + scrollBar).width());
      new dragger('mZiel_dragger_horizontal', scrollBar, zielContainer);
    }
    $(document).ready(function(){
      scrollInit();
    })
    window.onresize=function(){
      scrollInit();
    }
    $(".topAdvice .icon-close").click(function(){
      $(".topAdvice").hide();
    })
})