export function findMatchingTarget(target = {}, nodes = []) {
    if ( ! nodes.length || target.tagName === 'BODY' ) {
        return 'BODY';
    }

    let found = nodes.find(node => {
        return node.id === target.id
    });

    if ( found ) {
        return target.id;
    } else {
        return findMatchingTarget(target.parentElement);
    }
}

export function getPoint(e, hasTouch) {
    var point;

    if( hasTouch && event.touches.length ) {
        point = {
            'x' : event.touches[0].clientX,
            'y' : event.touches[0].clientY
        }
    } else {
        point = {
            'x' : event.clientX,
            'y' : event.clientY
        }
    }

    return point;
}

export const LEFT = 'LEFT'
export const RIGHT = 'RIGHT'
export const UP = 'UP'
export const DOWN = 'DOWN'
export function computeSwipe(options) {
    let diffX = options.startX - options.curX;
    let diffY = options.curY - options.startY;
    let radius = Math.atan2( diffY, diffX );
    let swipeAngle = Math.round( radius * 180 / Math.PI );

    if ( swipeAngle < 0 ) {
        swipeAngle = 360 - Math.abs(swipeAngle);
    }

    let direction = null;

    if(swipeAngle <= 45 && swipeAngle >= 0) {
        direction = LEFT;
    } else if (swipeAngle <= 360 && swipeAngle >= 315) {
        direction = LEFT;
    } else if (swipeAngle >= 135 && swipeAngle <= 225) {
        direction = RIGHT;
    } else if (swipeAngle > 45 && swipeAngle < 135) {
        direction = DOWN;
    } else {
        direction = UP;
    }

    return {
        diffX,
        diffY,
        direction
    }
}

export function computeKinetics (from, direction, swipeLength, swipeDuration) {
    var deceleration = 0.0006;

    var swipeDuration = Math.max(swipeDuration, 200);
    var speed = swipeLength / swipeDuration;

    var resultingDisplacement = (speed * speed) / (2 * deceleration);
    var duration = speed / deceleration;

    var to = 0;

    // direction is left or up
    if(direction === LEFT || direction === UP) {
        to = from - resultingDisplacement;
    // direction is right or down
    } else {
        to = from + resultingDisplacement;
    }

    return {
        from,
        to,
        duration
    }
}

export const callRaf = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) { return setTimeout(callback, 1); };
})();

export const cancelRaf = (function () {
    return window.cancelRequestAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout;
})();

export function easeOutQuint (t, b, c, d) {
    return c * ( (t = t / d - 1) * t * t * t * t + 1 ) + b;
}

export function easeOutExpo (t, b, c, d) {
    return (t == d) ? b + c : c * ( -Math.pow(2, -10 * t / d) + 1 ) + b;
}

export function easeOutSine (t, b, c, d) {
    return c * Math.sin( t / d * (Math.PI / 2) ) + b;
}
