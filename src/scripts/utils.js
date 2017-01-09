export function findMatchingTarget(target = {}, nodes = []) {
    if ( ! node.length || target.tagName === 'BODY' ) {
        return 'BODY';
    }

    let found = nodes.find(node => {
        return node.id === target.id
    });

    if ( found ) {
        return target.id;
    } else {
        return this.findTarget(target.parentElement);
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
