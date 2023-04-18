import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Label } from 'reactstrap';

import * as APIUtils from '@utils/APIUtils';

function FaceIDDetail (props) {
    const [form] = Form.useForm();

    const location = useLocation();
    const [searchParams] = useSearchParams();
    const uid = searchParams.get("uid");

    React.useEffect(() => {
        const fetchAPI = async () => {
            await APIUtils.get(`http://127.0.0.1:8000/api/faceid/get-user-by-id/${uid}`)
            .then(response => {
                console.log("response: ", response)
                form.setFieldsValue({
                    ...response
                })
            })
        }
        fetchAPI();
    }, [])

    const handleSubmitForm = () => {
        const data = form.getFieldsValue()
        console.log('data: ', data)
    }

    return (
        <>
            <Form form={form} >    
                <div className='row'>
                    <Form.Item label='First name' name="first_name">   
                        <Input></Input>
                    </Form.Item>
                </div>
                <div className='row'>
                    <div className='col-sm-1'>Last Name</div>
                    <div className='col-sm-11'>
                        <Form.Item name="last_name">
                            <Input></Input>
                        </Form.Item>
                    </div>
                </div>
                <Button onClick={handleSubmitForm}>Submit</Button>
            </Form>
        </>
    )

}


FaceIDDetail.propTypes = {

};

export default FaceIDDetail;