/*
 * jQuery Last Sidebar v1.0.0 - horizontal slide menu plugin
 * under the MIT license
 *
 * Written while knead boobs in one hand
 * Copyright 2015 Suzusaki Makoto - http://xn--nckmepf1g6g.com/
 */

(function($){
	
	$.fn.lastSidebar = function(options){
		
		var defaults = {
			itemTrigger: '#menuTrigger',
			align: 'right',
			speed: 300,
			breakPoint: false
		};
		var params = $.extend(defaults, options);
		var menu = this;
		var menuWidth;
		var docBody;
		
		menu.addClass('lastSidebar');
		$('body').append('<a href="#" id="lastOverlay"></a>');
		resizePosition();
		$(window).on('resize', function(){
			docBody = $(document.body);
			if(docBody.hasClass('open')){
				docBody.css(params.align, 0).removeClass('open');
				$(params.itemTrigger).removeClass('active');
				$('#lastOverlay').hide();
			}
			resizePosition();
		});
		
		$(params.itemTrigger + ', #lastOverlay').on('tap', function(){
			tapAction();
			return false;
		});
		
		function resizePosition(){
			if(!params.breakPoint || window.innerWidth <= params.breakPoint){
				switch(params.align){
					case 'right':
						menu.css({ left: 'auto', right: -menu.width() }).hide();
						break;
					case 'left':
						menu.css({ left: -menu.width(), right: 'auto' }).hide();
						break;
				}
			}else{
				switch(params.align){
					case 'right':
						menu.css({ left: '', right: '' });
						break;
					case 'left':
						menu.css({ left: '', right: '' });
						break;
				}
				$('#lastOverlay').hide();
			}
		}
		
		function tapAction(){
			docBody = $(document.body);
			menuWidth = menu.outerWidth();
			docBody.toggleClass('open');
			if(!params.breakPoint || window.innerWidth <= params.breakPoint){
				if(docBody.hasClass('open')){
					$('#lastOverlay').stop().fadeIn(params.speed);
					switch(params.align){
						case 'right':
							menu.stop().show().animate({ right: 0 }, params.speed, 'swing');
							docBody.stop().animate({ right: menuWidth }, params.speed, 'swing');
							break;
						case 'left':
							menu.stop().show().animate({ left: 0 }, params.speed, 'swing');
							docBody.stop().animate({ left: menuWidth }, params.speed, 'swing');
							break;
					}
					$(params.itemTrigger).addClass('active');
				}else{
					$('#lastOverlay').stop().fadeOut(params.speed);
					switch(params.align){
						case 'right':
							menu.stop().animate({ right: -menuWidth }, params.speed, 'swing', function(){
								menu.hide();
							});
							docBody.stop().animate({ right: 0 }, params.speed, 'swing');
							break;
						case 'left':
							menu.stop().animate({ left: -menuWidth }, params.speed, 'swing', function(){
								menu.hide();
							});
							docBody.stop().animate({ left: 0 }, params.speed, 'swing');
							break;
					}
					$(params.itemTrigger).removeClass('active');
				}
			}
		}
		
		return(this);
		
	};
	
})(jQuery);
