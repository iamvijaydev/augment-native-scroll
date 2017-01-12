# Augment Native Scroll
Experiments with custom wrappers over native scroll to achieve higher order functions

### Objective
Primary objective is to have multiple (related) scrollable areas, scroll as one, when anyone of them is scrolled. The demos are step up to test them on UIWebView (iOS) and determine the best way we can achieve the desired results. There are three different implemented flavors of native scrolls listed below:

### Synchronous Scroll
_mouse and keyboard scroll_

Related scrollable areas scroll as one when anyone of them is scrolled via mouse or keyboard. This is primarily focused for non-touch devices.

[Demo](https://iamvijaydev.github.io/augment-native-scroll/#/synchronous-scroll)

### Swipe to Scroll
_tap/click-hold swipe_

Related scrollable areas can be scrolled via swipe or on non-touch devices mimicking the same via mouse. This is primarily focused for bring touch like features to non-touch devices.

[Demo](https://iamvijaydev.github.io/augment-native-scroll/#/swipe-to-scroll)

### Both
_both flavors_

Both the scrolling feature working together smoothly.

[Demo](https://iamvijaydev.github.io/augment-native-scroll/#/synchronous-scroll-swipe)
