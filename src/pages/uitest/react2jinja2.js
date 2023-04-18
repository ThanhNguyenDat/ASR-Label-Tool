import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { testJinja2 } from "@services/api";

const React2Jinja2 = props => {
    const [html, setHtml] = React.useState('');

    return (
        <>
        <div className='row'>
            <div className='col'>
                <h1>React - Jinja 2</h1>
            </div>
        </div>
        </>
    )
};

React2Jinja2.propTypes = {
    
};

export default React2Jinja2;