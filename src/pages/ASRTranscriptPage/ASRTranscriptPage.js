import React from 'react';
import PropTypes from 'prop-types';
import DraggableElement from '../../components/DraggableElement/DraggableElement';

const ASRTranscriptPage = props => {
    const [value, setValue] = React.useState("");

    return (
        <div className='row'>
            <div className='col'>
                <p>Hello</p>
            </div>
            <div className='col'>
                {/* <DraggableElement
                    title={`Facebook`}
                    width={`400`}
                    height={`20`}
                    top={`150`}
                    left={`500`}
                    right={`500`}
                    >
                    <input value={value} onChange={(e)=>setValue(e.target.value)}/>
                        
                </DraggableElement> */}
            </div>
        </div>
    );
};

ASRTranscriptPage.propTypes = {
    
};

export default ASRTranscriptPage;