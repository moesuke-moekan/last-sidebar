/*
 * jQuery Last Sidebar v1.2.1 - horizontal slide menu plugin
 *
 * under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Written while knead boobs in one hand by Suzusaki Makoto
 * http://xn--nckmepf1g6g.com/
 */

(function($){

	$.fn.lastSidebar = function(options) {

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

		// this
		var menu = this;

		// merge the default
		var params = $.extend(defaults, options);
		var $docBody = $(document.body);
		var currentScrollY;

		// overlay
		var overlayIdName = 'lastOverlay';
		var $overlay = null;

		// is open
		var isOpen = true;

		// ------------------------------
		// load functions
		// ------------------------------

		var init = function() {

			// add class name
			menu.addClass('lastSidebar');

			// add overlay
			var overlay = document.createElement('a');
			overlay.setAttribute('href', '#');
			overlay.id = overlayIdName;
			document.body.appendChild(overlay);
			$overlay = $('#' + overlayIdName);

			// resize position
			resizePosition();

			// ------------------------------
			// event
			// ------------------------------

			// eventName define
			var eventResize;
			var eventTap;
			var ua = navigator.userAgent;
			if((ua.indexOf('iPhone') > 0 && ua.indexOf('iPad') === -1) || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0) {
				eventResize = 'orientationchange';
				eventTap = 'tap click';
			} else {
				eventResize = 'resize';
				eventTap = 'click';
			}

			// resize functions
			$(window).on(eventResize, resizeAction);

			// tap functions
			$(params.itemTrigger).add($overlay).on(eventTap, tapAction);

			// if noscroll ( for iOS7- )
			$(window).on('scroll', function() {
				if($('body').hasClass('noscroll')){
					$('html').height(window.innerHeight);
				}
			});
		};

		// ------------------------------
		// resize action
		// ------------------------------

		var resizeAction = function() {
			if($docBody.hasClass('open')){
				$docBody.css(params.align, 0).removeClass('open');
				$(params.itemTrigger).removeClass('active');
				$overlay.hide();
			}
			if($docBody.hasClass('noscroll')){
				var currentBody = parseInt($docBody.css('top'), 10) * -1;
				$docBody.removeClass('noscroll').scrollTop(currentBody).css('top', '');
				$('html').height('');
			}
			resizePosition();
		};


		// ------------------------------
		// resize positioning
		// ------------------------------

		var resizePosition = function() {
			if(isOpen){
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
						default:
							// no default route
							break;
					}
					menu.css({ left: prptLeft, right: prptRight }).hide();
				}else{
					menu.css({ left: '', right: '' });
					$overlay.hide();
				}
				isOpen = false;
			}
		};


		// ------------------------------
		// tap action
		// ------------------------------

		var tapAction = function() {
			console.log('!');
			var menuWidth = menu.outerWidth();
			$docBody.toggleClass('open');
			// No set of break point or Window width is mobile
			if(!params.breakPoint || window.innerWidth <= params.breakPoint){
				if($docBody.hasClass('open')){
					// callback
					params.openBefore();
					// show overlay
					$overlay.stop().fadeIn(params.speed);
					// show in the slide
					switch(params.align){
						case 'right':
							menu.stop().show().animate({ right: 0 }, params.speed, 'swing');
							$docBody.stop().animate({ right: menuWidth }, params.speed, 'swing');
							break;
						case 'left':
							menu.stop().show().animate({ left: 0 }, params.speed, 'swing');
							$docBody.stop().animate({ left: menuWidth }, params.speed, 'swing');
							break;
						default:
							// no default route
							break;
					}
					$(params.itemTrigger).addClass('active');
					if(params.noscroll){
						$('html').height(window.innerHeight);
						currentScrollY = $(window).scrollTop();
						$docBody.addClass('noscroll').css('top', -1 * currentScrollY);
					}
					isOpen = true;
					// callback
					params.openAfter();
				}else{
					// callback
					params.closeBefore();
					// hide overlay
					$overlay.stop().fadeOut(params.speed);
					// hide in the slide
					switch(params.align){
						case 'right':
							menu.stop().animate({ right: -menuWidth }, params.speed, 'swing', function(){
								menu.hide();
							});
							$docBody.stop().animate({ right: 0 }, params.speed, 'swing');
							break;
						case 'left':
							menu.stop().animate({ left: -menuWidth }, params.speed, 'swing', function(){
								menu.hide();
							});
							$docBody.stop().animate({ left: 0 }, params.speed, 'swing');
							break;
						default:
							// no default route
							break;
					}
					$(params.itemTrigger).removeClass('active');
					if(params.noscroll){
						$('html').height('');
						$docBody.removeClass('noscroll').css('top', '');
						$(window).scrollTop(currentScrollY);
					}
					isOpen = false;
					// callback
					params.closeAfter();
				}
			}
			return false;
		};

		// start initialize
		init();

		return(this);

	};

})(jQuery);
