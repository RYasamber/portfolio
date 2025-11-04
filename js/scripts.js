/*!
    Title: Dev Portfolio Template
    Version: 1.2.2
    Last Change: 03/25/2020
    Author: YASAMBER RAI
    
    Description: This file contains all the scripts associated with the single-page
    portfolio website.
*/

(function ($) {
  // Show current year
  $("#current-year").text(new Date().getFullYear());

  // Remove no-js class
  $("html").removeClass("no-js");

  // Let native smooth scroll handle in-page anchors; close mobile menu when used
  $("header a").click(function (e) {
    var href = $(this).attr('href') || '';
    // If it's not an internal anchor (starts with '#'), allow normal navigation
    if (href.charAt(0) !== '#') {
      // If mobile menu is open, close it but do not prevent navigation (so target=_blank works)
      if ($('header').hasClass('active')) {
        $('header, body, #menu').removeClass('active');
      }
      return; // allow default behavior for external links
    }

    // Treat as normal link if no-scroll class
    if ($(this).hasClass('no-scroll')) return;

    // Hide the menu once clicked if mobile
    if ($('header').hasClass('active')) {
      $('header, body, #menu').removeClass('active');
    }
    // Allow browser's default smooth behavior to handle the scroll
  });

  // Create timeline
  $("#experience-timeline").each(function () {
    $this = $(this);
    $userContent = $this.children("div");

    $userContent.each(function () {
      $(this)
        .addClass("vtimeline-content")
        .wrap(
          '<div class="vtimeline-point"><div class="vtimeline-block"></div></div>'
        );
    });

    $this.find(".vtimeline-point").each(function () {
      $(this).prepend(
        '<div class="vtimeline-icon"><i class="fa fa-map-marker"></i></div>'
      );
    });

    $this.find(".vtimeline-content").each(function () {
      var date = $(this).data("date");
      if (date) {
        $(this)
          .parent()
          .prepend('<span class="vtimeline-date">' + date + "</span>");
      }
    });
  });

  // Open mobile menu
  // Toggle mobile menu when hamburger is activated (click or keyboard)
  $("#mobile-menu-open").on('click keypress', function (e) {
    // allow Enter (13) or Space (32) or click to toggle
    if (e.type === 'click' || e.keyCode === 13 || e.keyCode === 32) {
      if ($('body').hasClass('active')) {
        closeMobileMenu();
      } else {
        $("header, body, #menu").addClass("active");
        // accessibility state
        $(this).attr('aria-expanded', 'true');
        $('#menu').attr('aria-hidden', 'false');
      }
      e.preventDefault();
    }
  });

  // Close mobile menu
  function closeMobileMenu() {
    $("header, body, #menu").removeClass("active");
    // reset accessibility state
    $("#mobile-menu-open").attr('aria-expanded', 'false');
    $('#menu').attr('aria-hidden', 'true');
  }

  // Note: explicit close control removed; hamburger toggle and other handlers
  // (overlay click, nav link click, ESC) call closeMobileMenu() instead.

  // Close when clicking the overlay (body.active ::before acts as overlay)
  $(document).on('click', function (e) {
    if ($('body').hasClass('active')) {
      // if click is outside the menu and not the open button, close
      var $target = $(e.target);
      if ($target.closest('#menu').length === 0 && $target.closest('#mobile-menu-open').length === 0) {
        closeMobileMenu();
      }
    }
  });

  // Ensure nav links close the sidebar on click (mobile behavior)
  $('#menu a').click(function () {
    if ($('body').hasClass('active')) {
      closeMobileMenu();
    }
  });

  // Close on ESC key when menu is open
  $(document).on('keydown', function (e) {
    if ($('body').hasClass('active') && e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // Load additional projects
  $("#view-more-projects").click(function (e) {
    e.preventDefault();
    $(this).fadeOut(300, function () {
      $("#more-projects").fadeIn(300);
    });
  });

  // Smooth Typewriter effect for lead subtitle
  (function initTypewriter() {
    var $typeEl = $("#lead-type");
    if (!$typeEl.length) return;

    // Respect prefers-reduced-motion
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      $typeEl.text(
        $typeEl
          .data("phrases")
          .replace(/\[|\]|\"/g, "")
          .split(",")[0] || ""
      );
      return;
    }

    var raw = $typeEl.attr("data-phrases") || "[]";
    var phrases;
    try {
      phrases = JSON.parse(raw);
    } catch (e) {
      phrases = [raw];
    }
    if (!Array.isArray(phrases) || !phrases.length) return;

    var i = 0;
    var deleting = false;
    var display = "";
    var lastTime = 0;
    var speed = 60; // ms per char (typing)
    var pauseBetween = 1000; // pause at end

    // Use a stable text node inside the element so pseudo-element cursor (::after)
    // remains attached and doesn't get removed during element text replacement.
    var textNode = document.createTextNode("");
    $typeEl.empty().append(textNode);

    function tick() {
      var phrase = phrases[i % phrases.length];
      if (!deleting) {
        display = phrase.slice(0, display.length + 1);
        textNode.nodeValue = display;
        if (display === phrase) {
          // pause then start deleting
          setTimeout(function () {
            deleting = true;
            requestAnimationFrame(tick);
          }, pauseBetween);
          return;
        }
      } else {
        display = phrase.slice(0, display.length - 1);
        textNode.nodeValue = display;
        if (display.length === 0) {
          deleting = false;
          i++;
        }
      }
      // randomize speed a little for natural feel
      var variance = Math.round((Math.random() - 0.5) * 30);
      setTimeout(function () {
        requestAnimationFrame(tick);
      }, Math.max(30, speed + variance));
    }

    // start — initialize the persistent text node and kick off the loop
    textNode.nodeValue = "";
    requestAnimationFrame(tick);
  })();

  // Accessibility: avoid mouse clicks leaving focus on buttons/links that then look "stuck".
  // Keep keyboard focus behavior intact; blur only for pointer (mouse) interactions.
  (function preventMouseFocusStick() {
    // feature-detect: addEventListener and matches
    if (!window.addEventListener) return;

    // selector for interactive primary button(s) - include resume button class
    var selector = '.btn-rounded-white';
    var els = document.querySelectorAll(selector);
    if (!els || !els.length) return;

    els.forEach(function (el) {
      // on mousedown from a pointer device, blur after a tick so keyboard focus still works
      el.addEventListener('mousedown', function (e) {
        // only act for primary/pointer inputs; ignore if keyboard-initiated
        // blur after a short timeout to allow focus to be applied then removed
        setTimeout(function () {
          try {
            el.blur();
          } catch (err) {
            /* swallow */
          }
        }, 10);
      });
    });
  })();

  // Header hide/show on scroll (YouTube-style)
  (function initScrollHeader() {
    var $header = $('header');
    var lastScrollTop = 0;
    var delta = 10; // minimum scroll distance to trigger hide/show (reduce jitter)
    var navbarHeight = $header.outerHeight();
    var didScroll = false;

    // Track scroll events
    $(window).scroll(function() {
      didScroll = true;
    });

    // Check scroll direction every 250ms
    setInterval(function() {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hasScrolled() {
      var scrollTop = $(window).scrollTop();
      
      // Make sure they scroll more than delta
      if (Math.abs(lastScrollTop - scrollTop) <= delta) {
        return;
      }
      
      // If at top of page, always show header
      if (scrollTop <= navbarHeight) {
        $header.removeClass('header-hidden').addClass('header-visible');
        lastScrollTop = scrollTop;
        return;
      }
      
      // If scrolling down and past the navbar, hide
      if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
        // Scrolling Down - Hide header
        $header.removeClass('header-visible').addClass('header-hidden');
      } else {
        // Scrolling Up - Show header
        if (scrollTop + $(window).height() < $(document).height()) {
          $header.removeClass('header-hidden').addClass('header-visible');
        }
      }
      
      lastScrollTop = scrollTop;
    }

    // Initialize header as visible
    $header.addClass('header-visible');
  })();

  // Scroll to Top Button functionality
  (function initScrollToTop() {
    var $scrollBtn = $('#scroll-to-top');
    var $window = $(window);
    var showThreshold = 300; // Show button after scrolling 300px
    
    // Show/hide button based on scroll position
    function toggleScrollButton() {
      var scrollTop = $window.scrollTop();
      
      if (scrollTop > showThreshold) {
        $scrollBtn.addClass('visible');
      } else {
        $scrollBtn.removeClass('visible');
      }
    }
    
    // Smooth scroll to top when button is clicked
    $scrollBtn.on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, 400, 'swing');
    });
    
    // Handle scroll events with throttling for performance
    var scrollTimeout;
    $window.on('scroll', function() {
      // Clear existing timeout
      clearTimeout(scrollTimeout);
      
      // Set new timeout for smooth performance
      scrollTimeout = setTimeout(toggleScrollButton, 10);
    });
    
    // Initialize button state
    toggleScrollButton();
  })();

  // Respect reduced motion for background video
  (function manageBackgroundVideo() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var video = document.querySelector('.video-background video');
    if (!video) return;

    function updatePlayback() {
      if (prefersReducedMotion.matches) {
        try {
          video.pause();
          video.removeAttribute('autoplay');
        } catch (e) {}
      }
    }

    updatePlayback();
    if (prefersReducedMotion.addEventListener) {
      prefersReducedMotion.addEventListener('change', updatePlayback);
    }
  })();
})(jQuery);
