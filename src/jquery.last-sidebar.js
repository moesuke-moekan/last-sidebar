/*
 * jQuery Last Sidebar v1.3.1 - horizontal slide menu plugin
 *
 * under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Written while knead boobs in one hand by Suzusaki Makoto
 * https://xn--nckmepf1g6g.com/
 */

(function($) {

	$.fn.lastSidebar = function(options) {

		// default settings
		var defaults = {
			itemTrigger: '#menuTrigger',
			align: 'right',
			speed: 300,
			breakPoint: null,
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

		// validation
		if(params.breakPoint !== null) {
			if(isNaN(params.breakPoint)) {
				params.breakPoint = null;
			} else if(typeof params.breakPoint !== Number) {
				params.breakPoint = Number(params.breakPoint);
			}
		}

		// button
		var $itemTrigger = null;

		// overlay
		var overlayIdName = 'lastOverlay';
		var $overlay = null;

		// is open
		var isOpen = false;

		/**
		 * load functions
		 */
		var init = function() {

			// add class name
			menu.addClass('lastSidebar');

			// button
			$itemTrigger = $(params.itemTrigger);

			// add overlay
			var overlay = document.createElement('a');
			overlay.setAttribute('href', '#');
			overlay.id = overlayIdName;
			document.body.appendChild(overlay);
			$overlay = $('#' + overlayIdName);

			// resize position
			resizePosition(true);

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
			$itemTrigger.add($overlay).on(eventTap, tapAction);
		};

		/**
		 * resize action
		 */
		var resizeAction = function() {
			if($docBody.hasClass('open')) {
				$docBody.css(params.align, 0).removeClass('open');
				$itemTrigger.removeClass('active');
				$overlay.hide();
			}
			if($docBody.hasClass('noscroll')) {
				var currentBody = parseInt($docBody.css('top'), 10) * -1;
				$docBody.removeClass('noscroll').scrollTop(currentBody).css('top', '');
				$('html').height('');
			}
			resizePosition(false);
		};

		/**
		 * resize positioning
		 * @param isFirstLoad
		 */
		var resizePosition = function(isFirstLoad) {
			if((!isOpen && !isFirstLoad)) {
				return;
			}
			var propLeft,
				propRight;
			// No set of break point or Window width is mobile
			if(!params.breakPoint || window.innerWidth <= params.breakPoint) {
				switch(params.align){
					case 'right':
						propLeft = 'auto';
						propRight = menu.width() * -1;
						break;
					case 'left':
						propLeft = menu.width() * -1;
						propRight = 'auto';
						break;
					default:
						// no default route
						break;
				}
				menu.css({
					left: propLeft,
					right: propRight
				}).hide();
			} else {
				menu.css({
					left: '',
					right: ''
				});
				$overlay.hide();
			}
			isOpen = false;
		};

		/**
		 * tap action
		 */
		var tapAction = function(ev) {
			ev.preventDefault();

			var menuWidth = menu.outerWidth();
			// No set of break point or Window width is mobile
			if(!params.breakPoint || window.innerWidth <= params.breakPoint) {
				$docBody.toggleClass('open');
				if($docBody.hasClass('open')){
					openAction(menuWidth);
				} else {
					closeAction(menuWidth);
				}
			}
		};

		/**
		 * open sidebar
		 * @param menuWidth
		 */
		var openAction = function(menuWidth) {
			// callback
			params.openBefore();

			// show overlay
			$overlay.stop().fadeIn(params.speed);

			// show in the slide
			switch(params.align){
				case 'right':
					menu.stop().show().animate({
						right: 0
					}, params.speed, 'swing');
					$docBody.stop().animate({
						right: menuWidth
					}, params.speed, 'swing');
					break;
				case 'left':
					menu.stop().show().animate({
						left: 0
					}, params.speed, 'swing');
					$docBody.stop().animate({
						left: menuWidth
					}, params.speed, 'swing');
					break;
				default:
					// no default route
					break;
			}
			$itemTrigger.addClass('active');
			if(params.noscroll){
				$('html').height(window.innerHeight);
				currentScrollY = $(window).scrollTop();
				$docBody.addClass('noscroll').css('top', -1 * currentScrollY);
			}
			isOpen = true;

			// callback
			params.openAfter();
		};

		/**
		 * close sidebar
		 * @param menuWidth
		 */
		var closeAction = function(menuWidth) {
			// callback
			params.closeBefore();

			// hide overlay
			$overlay.stop().fadeOut(params.speed);

			// hide in the slide
			switch(params.align){
				case 'right':
					menu.stop().animate({
						right: (menuWidth * -1)
					}, params.speed, 'swing', function() {
						menu.hide();
					});
					$docBody.stop().animate({
						right: 0
					}, params.speed, 'swing');
					break;
				case 'left':
					menu.stop().animate({
						left: (menuWidth * -1)
					}, params.speed, 'swing', function() {
						menu.hide();
					});
					$docBody.stop().animate({
						left: 0
					}, params.speed, 'swing');
					break;
				default:
					// no default route
					break;
			}
			$itemTrigger.removeClass('active');
			if(params.noscroll){
				$('html').height('');
				$docBody.removeClass('noscroll').css('top', '');
				$(window).scrollTop(currentScrollY);
			}
			isOpen = false;

			// callback
			params.closeAfter();
		};

		// ------------------------------
		// PUBLIC FUNCTIONS
		// ------------------------------

		/**
		 * close sidebar
		 */
		menu.closeSlide = function() {
			// No set of break point or Window width is mobile
			if(!params.breakPoint || window.innerWidth <= params.breakPoint) {
				if(!$docBody.hasClass('open')){
					return;
				}
				var menuWidth = menu.outerWidth();
				$docBody.removeClass('open');
				closeAction(menuWidth);
			}
		};

		// start initialize
		init();

		return this;
	};

})(jQuery);
