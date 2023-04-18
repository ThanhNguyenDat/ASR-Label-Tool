import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { testJinja2 } from "@services/api";

const TestJinja2 = props => {
    const [html, setHtml] = React.useState('');
    
    // check call api
    React.useEffect(() => {
        const fetchApi = async () => {
            try {
                // const res = await testJinja2();
                const res = await axios.get("http://0.0.0.0:5000/flask_to_react")
                .then(response=>{
                    setHtml(response.data)
                })
                
            } catch (error) {
                throw error
            }
        }
        fetchApi()
    }, [])

    return (
        <>
            <div className='row'>
                <div className='col'>
                    <h1>Test Jinja 2</h1>
                </div>
                <div className='col'>
                    <div dangerouslySetInnerHTML={{__html: html||""}} />
                </div>
            </div>
        </>
    )
};

TestJinja2.propTypes = {
    
};

export default TestJinja2;