export const getTime = Date.now || function getTime () { return new Date().getTime(); };

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

export function generateData () {
    let list = [];
    let table = [];
    let row;

    for( let i = 0; i < 100; i++ ) {
        list.push( Math.random().toString(36).substring(7) );

        row = [];
        for( let j = 0; j < 100; j++ ){
            row.push( Math.floor(Math.random() * 16) + 5 );
        }

        table.push(row);
    }

    return {
        list,
        table,
        enableKinetic: true
    }
}
