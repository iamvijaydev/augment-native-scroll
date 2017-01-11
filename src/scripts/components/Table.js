import React, { PropTypes } from 'react'

function Table({ data }) {
    return (
        <div id="table" className='brand-scrollbar'>
            <table>
                <thead>
                    <tr className='head'>
                        {
                            data[0].map((cell, i) => <td key={i}>{Math.random().toString().substring(2,5)}</td>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((row, i) => {
                            if ( i % 10 === 0 ) {
                                return (
                                    <tr className='strong' key={i}>
                                        {
                                            row.map((cell, j) => <td key={j}>{cell}</td>)
                                        }
                                    </tr>
                                )
                            } else {
                                return (
                                    <tr className='normal' key={i}>
                                        {
                                            row.map((cell, j) => <td key={j}>{cell}</td>)
                                        }
                                    </tr>
                                )
                            }
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

Table.propTypes = {
    data: PropTypes.array
};

Table.defaultProps = {
    data: []
};

export default Table;
