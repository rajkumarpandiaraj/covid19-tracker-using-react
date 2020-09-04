import React from 'react';
import NumberFormat from 'react-number-format';

function Card(props) {
    const {title, count} = props;
    return (
        <div className='card'>
            <h3>{title}</h3>
            <NumberFormat value={count} displayType={'text'} thousandSeparator={true} />
        </div>
    )
}

export default Card
