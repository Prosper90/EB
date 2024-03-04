(function($) {
    "use strict";

    var windowOn = $(window);

    // PreLoader Js
    windowOn.on("load", function() {
        $("#loading").fadeOut(1000);
    });

    // WOW active
    new WOW().init();

    // Mobile Menu Js
    $("#mobile-menu").meanmenu({
        meanMenuContainer: ".mobile-menu",
        meanScreenWidth: "1199",
        meanExpand: ['<i class="fal fa-plus"></i>'],
        meanContract: ['<i class="fal fa-minus"></i>'],
    });
    $("#mobile-menu-media-all").meanmenu({
        meanMenuContainer: ".mobile-menu-media-all",
        meanScreenWidth: "8000",
        meanExpand: ['<i class="fal fa-plus"></i>'],
        meanContract: ['<i class="fal fa-minus"></i>'],
    });

    // Sidebar Js
    $(".sidebar-toggle-btn").on("click", function() {
        $(".sidebar__area").addClass("sidebar-opened");
        $(".body-overlay").addClass("opened");
    });
    $(".sidebar__close-btn").on("click", function() {
        $(".sidebar__area").removeClass("sidebar-opened");
        $(".body-overlay").removeClass("opened");
    });

    // Side Info Js
    $(".side-info-close,.offcanvas-overlay").on("click", function() {
        $(".side-info").removeClass("info-open");
        $(".offcanvas-overlay").removeClass("overlay-open");
    });
    $(".side-toggle").on("click", function() {
        $(".side-info").addClass("info-open");
        $(".offcanvas-overlay").addClass("overlay-open");
    });

    $(".offset__btn").on("click", function() {
        $(".offset-content-wrapper").addClass("offset-show");
    });
    $(".offset-content-close").on("click", function() {
        $(".offset-content-wrapper").removeClass("offset-show");
    });

    // Sticky Header Js
    windowOn.on("scroll", function() {
        var scroll = $(window).scrollTop();
        if (scroll < 100) {
            $("#header-sticky").removeClass("sticky");
        } else {
            $("#header-sticky").addClass("sticky");
        }
    });

    $(window).on("scroll", function() {
        if ($(".sticked-menu").length) {
            var headerScrollPos = 130;
            var sticky = $(".sticked-menu");
            if ($(window).scrollTop() > headerScrollPos) {
                sticky.addClass("sticky-fixed");
            } else if ($(this).scrollTop() <= headerScrollPos) {
                sticky.removeClass("sticky-fixed");
            }
        }
        if ($(".scroll-to-top").length) {
            var stickyScrollPos = 100;
            if ($(window).scrollTop() > stickyScrollPos) {
                $(".scroll-to-top").fadeIn(500);
            } else if ($(this).scrollTop() <= stickyScrollPos) {
                $(".scroll-to-top").fadeOut(500);
            }
        }
    });

    // Data Background Js
    $("[data-background]").each(function() {
        $(this).css(
            "background-image",
            "url( " + $(this).attr("data-background") + "  )"
        );
    });

    if ($(".tabs-box").length) {
        $(".tabs-box .tab-buttons .tab-btn").on("click", function(e) {
            e.preventDefault();
            var target = $($(this).attr("data-tab"));

            if ($(target).is(":visible")) {
                return false;
            } else {
                target
                    .parents(".tabs-box")
                    .find(".tab-buttons")
                    .find(".tab-btn")
                    .removeClass("active-btn");
                $(this).addClass("active-btn");
                target
                    .parents(".tabs-box")
                    .find(".tabs-content")
                    .find(".tab")
                    .fadeOut(0);
                target
                    .parents(".tabs-box")
                    .find(".tabs-content")
                    .find(".tab")
                    .removeClass("active-tab");
                $(target).fadeIn(300);
                $(target).addClass("active-tab");
            }
        });
    }

    // Testimonial One
    if ($(".testimonial-one__active").length) {
        $(".testimonial-one__active").owlCarousel({
            loop: true,
            navText: ['<i class="fa-light fa-arrow-left"></i>', '<i class="fa-light fa-arrow-right"></i>'],
            nav: true,
            margin: 10,
            responsive: {
                0: {
                    items: 1,
                    stagePadding: 0,
                },
                576: {
                    items: 1,
                    stagePadding: 0,
                },
                768: {
                    items: 1,
                    stagePadding: 120,
                },
                992: {
                    items: 1,
                    stagePadding: 160,
                },
                1200: {
                    items: 1,
                    stagePadding: 150,
                },
                1400: {
                    items: 1,
                    stagePadding: 200,
                },
                1600: {
                    items: 1,
                    stagePadding: 290,
                },
            }
        });
    }

    // Testimonial Two
    if ($(".testimonial-two__active").length) {
        $(".testimonial-two__active").owlCarousel({
            items: 1,
            loop: true,
            nav: false,
            margin: 10,
            dotsData: true,
            animateOut: 'fadeOutDown',
            animateIn: 'fadeInDown',
        });
    }

    // Testimonial Three
    if ($(".testimonial-three__active").length) {
        $(".testimonial-three__active").slick({
            dots: true,
            fade: false,
            autoplay: false,
            slidesToShow: 1,
            prevArrow: '<button type="button" class="slick-prev"><i class="fa-regular fa-arrow-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="fa-regular fa-arrow-right"></i></button>',
            arrows: true,
            responsive: [{
                    breakpoint: 992,
                    settings: {
                        arrows: false,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                    }
                }
            ]
        });
    }

    // Testimonial Two
    if ($(".case-study-two__active").length) {
        $('.case-study-two__active').owlCarousel({
            loop: true,
            navText: ['<i class="fa-light fa-arrow-left"></i>', '<i class="fa-light fa-arrow-right"></i>'],
            nav: true,
            autoHeight: true,
            responsive: {
                0: {
                    items: 1,
                    stagePadding: 0,
                },
                576: {
                    items: 1,
                    stagePadding: 0,
                },
                768: {
                    items: 1,
                    stagePadding: 120,
                },
                992: {
                    items: 1,
                    stagePadding: 160,
                },
                1200: {
                    items: 1,
                    stagePadding: 150,
                },
                1400: {
                    items: 1,
                    stagePadding: 200,
                },
                1600: {
                    items: 1,
                    stagePadding: 290,
                },
            }
        });
    }

    // Brand One
    if ($(".brand-one__active").length) {
        $('.brand-one__active').owlCarousel({
            loop: true,
            nav: false,
            autoplay: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 3
                },
                1000: {
                    items: 5
                }
            }
        });
    }

    // Magnific Popup Img View
    if ($(".popup-image").length) {
        $('.popup-image').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    }

    /* Magnific Popup Video View */
    if ($(".popup-video").length) {
        $('.popup-video').magnificPopup({
            type: 'iframe',
        });
    }

    // Swiper Init
    function thmSwiperInit() {
        // swiper slider
        const swiperElm = document.querySelectorAll(".thm-swiper__slider");
        swiperElm.forEach(function(swiperelm) {
            const swiperOptions = JSON.parse(swiperelm.dataset.swiperOptions);
            let thmSwiperSlider = new Swiper(swiperelm, swiperOptions);
        });
    }

    $(window).on("load", function() {
        thmSwiperInit();
    });

    // Case Study One
    if ($(".case-study-one__active").length) {
        new Swiper(".case-study-one__active", {
            slidesPerView: 6,
            spaceBetween: 50,
            loop: true,
            scrollbar: {
                el: ".rr-scrollbar",
                clickable: true,
            },
        });
    }

    // Toggle Password
    if ($(".toggle-password").length) {
        $(".toggle-password").on('click', function() {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("data-toggle"));
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });
    }

    function mediaSize() {
        /* Set the matchMedia */
        if (window.matchMedia('(min-width: 768px)').matches) {
            const panels = document.querySelectorAll('.col-custom')
            panels.forEach(panel => {
                panel.addEventListener('click', () => {
                    removeActiveClasses()
                    panel.classList.add('active')
                })
            })

            function removeActiveClasses() {
                panels.forEach(panel => {
                    panel.classList.remove('active')
                })
            }

        } else {
            /* Reset for CSS changes â€“ Still need a better way to do this! */
            $(".col-custom ").addClass("active");
        }
    };
    /* Call the function */
    mediaSize();
    /* Attach the function to the resize event listener */
    window.addEventListener('resize', mediaSize, false);

    var $gridOne = $('.portfolio-active').isotope();
    // filter items on button click
    $('.portfolio-menu').on('click', 'button', function() {
        var filterValue = $(this).attr('data-filter');
        $gridOne.isotope({ filter: filterValue });
    });

    // Isotop Filter Activation
    $('.portfolio-menu button').on('click', function(event) {
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
        event.preventDefault();
    });

    // Popular Causes Progress Bar
    if ($(".count-bar").length) {
        $(".count-bar").appear(
            function() {
                var el = $(this);
                var percent = el.data("percent");
                $(el).css("width", percent).addClass("counted");
            }, {
                accY: -50
            }
        );
    }

    //Progress Bar / Levels
    if ($(".progress-levels .progress-box .bar-fill").length) {
        $(".progress-box .bar-fill").each(
            function() {
                $(".progress-box .bar-fill").appear(function() {
                    var progressWidth = $(this).attr("data-percent");
                    $(this).css("width", progressWidth + "%");
                });
            }, {
                accY: 0
            }
        );
    }

    //Fact Counter + Text Count
    if ($(".count-box").length) {
        $(".count-box").appear(
            function() {
                var $t = $(this),
                    n = $t.find(".count-text").attr("data-stop"),
                    r = parseInt($t.find(".count-text").attr("data-speed"), 10);

                if (!$t.hasClass("counted")) {
                    $t.addClass("counted");
                    $({
                        countNum: $t.find(".count-text").text()
                    }).animate({
                        countNum: n
                    }, {
                        duration: r,
                        easing: "linear",
                        step: function() {
                            $t.find(".count-text").text(Math.floor(this.countNum));
                        },
                        complete: function() {
                            $t.find(".count-text").text(this.countNum);
                        }
                    });
                }
            }, {
                accY: 0
            }
        );
    }

    // Fun Fact
    if ($(".counter").length) {
        $('.counter').countUp({
            delay: 10,
            time: 2000
        });
    }

    // Nice Select Js
    if ($("select").length) {
        $("select").niceSelect();
    }

})(jQuery);