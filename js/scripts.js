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
      $("header, body").removeClass("active");
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
  $("#mobile-menu-open").click(function () {
    $("header, body").addClass("active");
  });

  // Close mobile menu 
  $("#mobile-menu-close").click(function () {
    $("header, body").removeClass("active");
  });

  // Load additional projects 
  $("#view-more-projects").click(function (e) {
    e.preventDefault();
    $(this).fadeOut(300, function () {
      $("#more-projects").fadeIn(300);
    });
  });
})(jQuery);