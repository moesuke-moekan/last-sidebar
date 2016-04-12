/*
 * jQuery Last Sidebar v1.2.0 - horizontal slide menu plugin
 *
 * under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Written while knead boobs in one hand by Suzusaki Makoto
 * http://xn--nckmepf1g6g.com/
 */

(function($){

	$.fn.lastSidebar = function(options){

		// default settings
		var defaults = {
			itemTrigger: '#menuTrigger',
			align: 'right',
			speed: 300,
			breakPoint: false,
			noscroll: false,
			openBefore: function(){},
			openAfter: function(){},
			closeBefore: function(){},
			closeAfter: function(){}
		};

		// merge the default
		var params = $.extend(defaults, options);
		var menu = this;
		var docBody = $(document.body);
		var currentScrollY;

		// is opend
		var opend = true;

		// ------------------------------
		// load functions
		//------------------------------

		// add class name
		menu.addClass('lastSidebar');

		// add overlay
		var overlayName = '#lastOverlay';
		var overlay = document.createElement('a');
		overlay.setAttribute('href', '#');
		overlay.id = 'lastOverlay';
		document.body.appendChild(overlay);

		// resize position
		resizePosition();

		// ------------------------------
		// event
		//------------------------------

		// eventName define
		var eventResize;
		var eventTap;
		if((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') === -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0){
			eventResize = 'orientationchange';
			eventTap = 'tap click';
		}else{
			eventResize = 'resize';
			eventTap = 'click';
		}

		// resize functions
		$(window).on(eventResize, resizeAction);

		// tap functions
		$(params.itemTrigger + ', ' + overlayName).on(eventTap, tapAction);

		// if noscroll ( for iOS7- )
		$(window).on('scroll', function(){
			if($('body').hasClass('noscroll')){
				$('html').height(window.innerHeight);
			}
		});

		// resize action
		function resizeAction(){
			if(docBody.hasClass('open')){
				docBody.css(params.align, 0).removeClass('open');
				$(params.itemTrigger).removeClass('active');
				$(overlayName).hide();
			}
			if(docBody.hasClass('noscroll')){
				var currentBody = -1 * parseInt(docBody.css('top'));
				docBody.removeClass('noscroll').scrollTop(currentBody).css('top', '');
				$('html').height('');
			}
			resizePosition();
		}

		// resize positioning
		function resizePosition(){
			if(opend){
				var prptLeft,
						prptRight;
				// No set of break point or Window width is mobile
				if(!params.breakPoint || window.innerWidth <= params.breakPoint){
					switch(params.align){
						case 'right':
							prptLeft = 'auto';
							prptRight = -menu.width();
							break;
						case 'left':
							prptLeft = -menu.width();
							prptRight = 'auto';
							break;
						// no default route
					}
					menu.css({ left: prptLeft, right: prptRight }).hide();
				}else{
					menu.css({ left: '', right: '' });
					$(overlayName).hide();
				}
				opend = false;
			}
		}

		// tap action
		function tapAction(){
			var menuWidth = menu.outerWidth();
			docBody.toggleClass('open');
			// No set of break point or Window width is mobile
			if(!params.breakPoint || window.innerWidth <= params.breakPoint){
				if(docBody.hasClass('open')){
					// callback
					params.openBefore();
					// show overlay
					$(overlayName).stop().fadeIn(params.speed);
					// show in the slide
					switch(params.align){
						case 'right':
							menu.stop().show().animate({ right: 0 }, params.speed, 'swing');
							docBody.stop().animate({ right: menuWidth }, params.speed, 'swing');
							break;
						case 'left':
							menu.stop().show().animate({ left: 0 }, params.speed, 'swing');
							docBody.stop().animate({ left: menuWidth }, params.speed, 'swing');
							break;
						// no default route
					}
					$(params.itemTrigger).addClass('active');
					if(params.noscroll){
						$('html').height(window.innerHeight);
						currentScrollY = $(window).scrollTop();
						docBody.addClass('noscroll').css('top', -1 * currentScrollY);
					}
					opend = true;
					// callback
					params.openAfter();
				}else{
					// callback
					params.closeBefore();
					// hide overlay
					$(overlayName).stop().fadeOut(params.speed);
					// hide in the slide
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
						// no default route
					}
					$(params.itemTrigger).removeClass('active');
					if(params.noscroll){
						$('html').height('');
						docBody.removeClass('noscroll').css('top', '');
						$(window).scrollTop(currentScrollY);
					}
					opend = false;
					// callback
					params.closeAfter();
				}
			}
			return false;
		}

		return(this);

	};

})(jQuery);
