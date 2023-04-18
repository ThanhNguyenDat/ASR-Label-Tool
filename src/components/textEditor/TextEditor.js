import React from 'react';
import PropTypes from 'prop-types';

import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import Context from '@ckeditor/ckeditor5-core/src/context';
// // import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import ClassicEditorConfig from './ClassicEditorConfig';
// import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';

function TextEditor(props) {
    return (
        <>
            <CKEditor
                editor={ ClassicEditor }
                data="<p>Hello from the first editor working with the context!</p>"
            
                // config={{
                //     ckfinder: {
                //         uploadUrl: 'http://0.0.0.0:8000/resources/upload/image',
                //         // uploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
                //         fieldName: 'file',
                //         type: ['jpeg', 'jpg', 'png', 'gif', 'bmp'],
                //         maxFileSize: 5000000,
                //     },
                //     extraPlugins: [CustomUploadAdapterPlugin],
                
                // }}

                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    console.log( { event, editor, data } );
                } }
                onBlur={ ( event, editor ) => {
                    console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    console.log( 'Focus.', editor );
                } }
            />
        
        </>
    );
};

TextEditor.propTypes = {
    
};

export default TextEditor;