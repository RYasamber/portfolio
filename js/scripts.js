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

  // INSTANT SCROLL when nav is clicked
  $("header a").click(function (e) {
    // Treat as normal link if no-scroll class
    if ($(this).hasClass("no-scroll")) return;

    e.preventDefault();
    var heading = $(this).attr("href");
    var scrollDistance = $(heading).offset().top;

    // INSTANT SCROLL (no animation)
    $("html, body").stop().scrollTop(scrollDistance);

    // Hide the menu once clicked if mobile
    if ($("header").hasClass("active")) {
      $("header, body, #menu").removeClass("active");
    }
  });

  // INSTANT Scroll to top
  $("#to-top").click(function () {
    $("html, body").stop().scrollTop(0);
  });

  // INSTANT Scroll to first element
  $("#lead-down span").click(function () {
    var scrollDistance = $("#lead").next().offset().top;
    $("html, body").stop().scrollTop(scrollDistance);
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

  // Hide/show lead-down button on scroll
  var $leadDown = $("#lead-down");
  var $lead = $("#lead");
  function setLeadDownHidden(hidden) {
    if (hidden) {
      $leadDown.addClass("is-hidden");
      $leadDown.attr("aria-hidden", "true");
      // remove from keyboard order
      $leadDown.find("span").attr("tabindex", "-1");
    } else {
      $leadDown.removeClass("is-hidden");
      $leadDown.attr("aria-hidden", "false");
      $leadDown.find("span").removeAttr("tabindex");
    }
  }

  function checkLeadDownVisibility() {
    // Hide when user scrolls past the hero or after a small scroll distance
    var leadBottom = $lead.offset().top + $lead.outerHeight();
    var scrolled = $(window).scrollTop();

    var shouldHide = false;

    if (scrolled > 140) {
      shouldHide = true;
    } else if (scrolled > 60 && scrolled >= leadBottom - 100) {
      shouldHide = true;
    }

    setLeadDownHidden(shouldHide);
  }

  // Debounce utility
  function debounce(fn, wait) {
    var t;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    };
  }

  var debouncedCheck = debounce(checkLeadDownVisibility, 80);

  // Run on load and scroll (debounced)
  $(window).on("scroll resize", debouncedCheck);
  $(document).ready(checkLeadDownVisibility);

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

    function tick() {
      var phrase = phrases[i % phrases.length];
      if (!deleting) {
        display = phrase.slice(0, display.length + 1);
        $typeEl.text(display);
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
        $typeEl.text(display);
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

    // start
    $typeEl.text("");
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
})(jQuery);
