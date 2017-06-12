/**
 * jQuery Form Space
 * https://github.com/heathdutton/jquery-formspace
 *
 * Copyright 2017, Heath Dutton
 * Licensed under the MIT license.
 *
 * Hides fixed navigation when form fields are focused to conserve space on smaller screens.
 *
 *   Usage: $('body').formSpace();
 */
(function ($) {

    $.fn.formSpace = function (options) {

        var settings = $.extend({
            // Selector for header fixed navigation items. This default is as used in Bootstrap.
            header: '.navbar-fixed-top, .navbar-static-top',
            // Selector for footer fixed navigation items. This default is as used in Bootstrap.
            footer: '.navbar-fixed-bottom, .navbar-static-bottom',
            // The delay (in ms) after a DOM change before re-attaching to form fields.
            delay: 1000,
            // Selector for fields that we wish to detect focus on. These are fields that mobile devices will open a "keyboard" for.
            fields: 'input[type=text], input[type=password], input[type=tel], input[type=image], input[type=file], select, textarea',
            // Speed of the animation to hide.
            speed: 100,
            // Class/es to add for hiding, should CSS be needed.
            class: 'formspace_hidden',
            // Optionally use this for desktop as well.
            mobileOnly: true
        }, options);

        // Check if the current device needs formSpace
        if (settings.mobileOnly) {
            // jQuery.browser.mobile (http://detectmobilebrowser.com/) updated Jun 12, 2017
            (function (a) {
                (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
            })(navigator.userAgent || navigator.vendor || window.opera);
            if (!jQuery.browser.mobile) {
                // We are on a desktop device, and desktop is disabled.
                return this;
            }
        }

        var $scope = this,
            $headers = $(settings.header),
            $footers = $(settings.footer),
            focusCheckTimer,
            formAttachTimer,
            shownState = true,
            // Hide all fixed navigation items.
            hideFixed = function () {
                if (shownState) {
                    $headers
                        .removeClass(settings.class)
                        .each(function () {
                            $(this)
                                .stop()
                                .animate({
                                    top: $(this).outerHeight() * -1
                                }, settings.speed);
                        });
                    $footers
                        .addClass(settings.class)
                        .each(function () {
                            $(this)
                                .stop()
                                .animate({
                                    bottom: $(this).outerHeight() * -1
                                }, settings.speed);
                        });
                    scopeAttach();
                    shownState = false;
                }
            },
            // Show all fixed navigation items.
            showFixed = function () {
                if (!shownState) {
                    scopeDetach();
                    $headers
                        .removeClass(settings.class)
                        .each(function () {
                            $(this)
                                .stop()
                                .animate({
                                    top: $(this).data('formSpace.top') + 'px'
                                }, settings.speed);
                        });
                    $footers
                        .removeClass(settings.class)
                        .each(function () {
                            $(this)
                                .stop()
                                .animate({
                                    top: $(this).data('formSpace.bottom') + 'px'
                                }, settings.speed);
                        });
                    scopeAttach();
                    shownState = true;
                }
            },
            // Attach to forms whenever the DOM changes.
            focusCheck = function (delay) {
                if (typeof delay !== 'number') {
                    // An abbreviated delay to allow mobile devices to shift focus from one field to another.
                    delay = Math.ceil(settings.delay / 5);
                }
                focusCheckTimer = setTimeout(function () {
                    var $focus = $(':focus');
                    if ($focus.length) {
                        // Detect if we are still focused on one of the pertinent fields.
                        if ($focus.first().is(settings.fields)) {
                            hideFixed();
                        } else {
                            showFixed();
                        }
                    } else {
                        showFixed();
                    }
                }, delay);
            },
            formAttach = function (delay) {
                if (typeof delay !== 'number') {
                    delay = settings.delay;
                }

                // Wait a delay, to prevent overloading loops due to DOM changing scripts.
                formAttachTimer = setTimeout(function () {
                    $(settings.fields)
                        .off('focus.formSpace.focus')
                        .off('blur.formSpace.blur')
                        .on('focus.formSpace.focus', function () {
                            focusCheck(0);
                        })
                        .on('blur.formSpace.blur', function () {
                            focusCheck();
                        });
                }, delay);

                // Check the focus in case it has already been made.
                focusCheck(0);
            },
            scopeDetach = function () {
                $scope
                    .off('DOMSubtreeModified.formSpace');
            },
            scopeAttach = function () {
                $scope
                    .off('DOMSubtreeModified.formSpace')
                    .on('DOMSubtreeModified.formSpace', function () {
                        formAttach();
                    });
            };

        // Apply context to field selectors (gets around jQuery bug when finding inputs by type with context).
        var fields = settings.fields.split(',');
        for (var i = 0; i < fields.length; i++) {
            fields[i] = $scope.selector + ' ' + fields[i].trim();
        }
        settings.fields = fields.join(',');

        if ($headers.length || $footers.length) {
            $headers.each(function () {
                $(this).data('formSpace.top', $(this).position().top);
            });
            $footers.each(function () {
                $(this).data('formSpace.bottom', $(this).position().bottom);
            });
            // Initial form attachment.
            formAttach(0);

            // Trigger a re-attachment to forms when the DOM has changed.
            scopeAttach();
        }
        return this;
    };

}(jQuery));
