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
        return findMatchingTarget(target.parentElement, nodes);
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

export function computeKinetics (from, direction, distance, time) {
    var deceleration = 0.0009;

    var correctedTime = Math.max(time, 200);
    var speed = distance / correctedTime;

    var resultingDisplacement = (speed * speed) / (2 * deceleration);
    var duration = Math.abs(speed / deceleration);

    var to = 0;

    // direction is left or up
    if(direction === LEFT || direction === UP ) {
        to = from + resultingDisplacement;
    // direction is right or down
    } else {
        to = from - resultingDisplacement;
    }

    return {
        from,
        to,
        duration
    }
}

export function easeOutQuint (t, b, c, d) {
    return c * ( (t = t / d - 1) * t * t * t * t + 1 ) + b;
}

export function easeOutExpo (t, b, c, d) {
    return (t == d) ? b + c : c * ( -Math.pow(2, -10 * t / d) + 1 ) + b;
}

export function easeOutSine (t, b, c, d) {
    return c * Math.sin( t / d * (Math.PI / 2) ) + b;
}

export function generateData () {
    let list = [];
    let table = [];
    let row;

    for( let i = 0; i < 70; i++ ) {
        list.push( Math.random().toString(36).substring(7) );

        row = [];
        for( let j = 0; j < 100; j++ ){
            row.push( Math.floor(Math.random() * 16) + 5 );
        }

        table.push(row);
    }

    return {
        list,
        table
    }
}
