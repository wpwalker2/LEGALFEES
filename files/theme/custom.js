jQuery(function($) {

  // Mobile sidebars
  $.fn.expandableSidebar = function(expandedClass) {
    var $me = this;

    $me.on('click', function() {
      if(!$me.hasClass(expandedClass)) {
        $me.addClass(expandedClass);
      } else {
        $me.removeClass(expandedClass);
      }
    });
  }

  // Postload class for handling navigation + cart cloning
  $('body').addClass('postload');

  // Where all the magic happens
  var stripesController = {

    init: function(opts) {
      var base = this;
      
        setTimeout(function(){
            base._moveElements();
        }, 800);
    },

    _moveElements: function() {
      var base = this;

      // Move cart to header, otherwise hide the cart
      if($('#wsite-nav-cart-a').length > 0) {
        $('.menu-controls-bar .container').append('<div id="miniCart" class="mini-cart-wrap"><span id="miniCartIcon" class="mini-cart-icon"></span></div>')
        $('#wsite-mini-cart').detach().appendTo('#miniCart');
      } else {
        $('#miniCart').hide();
      }
      
      // Watch for changes on non-mobile nav
      $('#navHidden').on('DOMSubtreeModified propertychange', function() {
        $("#navHidden li a").each(function(){

          // Differentiating post-load nav elements by the presence of an id (only currently available modifier)
          // Skipping nav cart, which has a different placement in this theme
          if ($(this).attr("id") && ($(this).attr("id") !== "wsite-nav-cart-a")) {
            var navLinkId = $(this).attr("id");
            var navLinkParent = $(this).parent().detach();

            // Append to mobile nav if new element
            if (!$("#nav #"+navLinkId).length) {
              $("#nav .wsite-menu-default").append(navLinkParent);
            }
          }
        });
      });

      // Init other functions only after elements have successfully been moved
      base._addClasses();

      // Timeout to check cart
      setTimeout(function(){
        base._attachEvents();
        base._checkCartItems();
      }, 500);
    },

    _checkCartItems: function() {
      var base = this;
      
      if($('#wsite-mini-cart').find('li.wsite-product-item').length > 0) {
        $('.mini-cart-wrap').addClass('full');
        $('.page-content-wrapper').addClass('footer-full');
      } else {
        $('.mini-cart-wrap').removeClass('full');
        $('.page-content-wrapper').removeClass('footer-full');
      }
    },

    _addClasses: function() {
      var base = this;

      // Add class to nav items with subnav
      $('.wsite-menu-default').find('li.wsite-menu-item-wrap').each(function(){
        var $me = $(this);

        if($me.children('.wsite-menu-wrap').length > 0) {

          $me.addClass('has-submenu');
          $('<span class="icon-caret"></span>').insertAfter($me.children('a.wsite-menu-item'));
        }
      });

      // Add class to subnav items with subnav
      $('.wsite-menu').find('li.wsite-menu-subitem-wrap').each(function(){
        var $me = $(this);

        if($me.children('.wsite-menu-wrap').length > 0) {

          $me.addClass('has-submenu');
          $('<span class="icon-caret"></span>').insertAfter($me.children('a.wsite-menu-subitem'));
        }
      });

        // Keep subnav open if submenu item is active
        $('li.wsite-menu-subitem-wrap.wsite-nav-current').parents('.wsite-menu-wrap').addClass('open');

      // Add fullwidth class to gallery thumbs if less than 6
      $('.imageGallery').each(function(){
        if ($(this).children('div').length <= 6) {
          $(this).children('div').addClass('fullwidth-mobile');
        }
      });
    },

    _cartFull: function() {
      var base = this;

      $('.mini-cart-wrap').addClass('full');
      $('.page-content-wrapper').addClass('footer-full');
      $("html, body").animate({ scrollTop: 0 }, 600);
    },

    _cartEmpty: function() {
      var base = this;

      $('.mini-cart-wrap').removeClass('full');
      $('.page-content-wrapper').removeClass('footer-full');
    },

    _attachEvents: function() {
        var base = this;

        $('label.hamburger').on('click', function() {
            if(!$('body').hasClass('nav-open')) {
                $('body').addClass('nav-open');
            } else {
                $('body').removeClass('nav-open');
            }
        });


        // Subnav toggle
        $('li.has-submenu span.icon-caret').on('click', function() {
            var $me = $(this);

            if($me.siblings('.wsite-menu-wrap').hasClass('open')) {
                $me.siblings('.wsite-menu-wrap').removeClass('open');
            } else {
                $me.siblings('.wsite-menu-wrap').addClass('open');
            }
        });

      // Mini cart toggle
      $('#miniCartIcon').on('click', function(){
        $('#wsite-mini-cart').toggle();
      });

      // Scroll to top when add items to cart
      $('#wsite-com-product-add-to-cart, .wsite-product-button').on('click', function(){
        base._cartFull();
      });

      // Toggle mobile cart (to be reworked)
      $('.wsite-remove-button').on('click', function(){
        base._cartEmpty(); 
      });

      // Store category dropdown
      $('.wsite-com-sidebar').expandableSidebar('sidebar-expanded');

      // Search filters dropdown
      $('#wsite-search-sidebar').expandableSidebar('sidebar-expanded');

      // Init swipe on mobile
      if ('ontouchstart' in window) {
        $('body').on('click', 'a.w-fancybox', function() {
          base._initSwipeGallery();
        });
      }
    },

    _initSwipeGallery: function() {
      var base = this;

      setTimeout(function(){
        var touchGallery = document.getElementsByClassName('fancybox-wrap')[0];
        var mc = new Hammer(touchGallery);
        mc.on("panleft panright", function(ev) {
          if (ev.type == "panleft") {
            $("a.fancybox-next").trigger("click");
          } else if (ev.type == "panright") {
            $("a.fancybox-prev").trigger("click");
          }
          base._initSwipeGallery();
        });
      }, 500);
    }
  };


  $(document).ready(function(){
    stripesController.init();
  });
});
