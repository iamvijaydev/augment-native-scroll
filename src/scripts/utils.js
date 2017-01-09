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
    };

    return point;
}

export const LEFT = 'LEFT'
export const RIGHT = 'RIGHT'
export const UP = 'UP'
export const DOWN = 'DOWN'
export function computeSwipe(options) {
    let deltaX     = options.startX - options.curX;
    let deltaY     = options.curY - options.startY;
    let radius     = Math.atan2( deltaY, deltaX );
    let swipeAngle = Math.round( radius * 180 / Math.PI );

    if ( swipeAngle < 0 ) {
        swipeAngle = 360 - Math.abs(swipeAngle);
    };

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
    };

    return {
        deltaX,
        deltaY,
        direction
    }
}
