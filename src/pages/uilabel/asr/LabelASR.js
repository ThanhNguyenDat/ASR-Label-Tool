import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getLoginInfo, testJinja2 } from "@services/api";
import * as APIUtils from '@utils/APIUtils';
import $ from 'jquery';
import axios from "axios";

const LabelASR = (props) => {
    
    const dispatch = useDispatch();
    const user = useSelector(state => {
        return state
    })

    
    useEffect(() => {
        console.log("user: ", user)
    })

    // check call api
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await getLoginInfo();
                console.log("getLoginInfo: ", res);
                
                // return res // khong choi return nhe vi dang bat dong bo
            } catch (error) {
                throw error
            }
        }
        fetchApi()
    }, [])

    return (
        <>
            <h1>Label ASR</h1>
            
        </>
    )
}

export default LabelASR;