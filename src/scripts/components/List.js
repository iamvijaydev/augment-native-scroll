import React, { PropTypes } from 'react'

function List({ data }) {
    return (
        <div id='list' className='brand-scrollbar'>
            <ul>
                <li className='head'>Rates & Types</li>
                {
                    data.map((item, i) => {
                        if ( i % 10 === 0 ) {
                            return <li className='strong' key={i}>{item}</li>
                        } else {
                            return <li className='normal' key={i}>{item}</li>
                        }
                    })
                }
            </ul>
        </div>
    )
}

List.propTypes = {
    data: PropTypes.array
};

List.defaultProps = {
    data: []
};

export default List;
