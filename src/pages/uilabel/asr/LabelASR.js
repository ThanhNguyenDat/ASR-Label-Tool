import React from "react";
import { useSelector, useDispatch } from 'react-redux';

const LabelASR = ({history}) => {
    checkpersion
    const dispatch = useDispatch();
    const user = useSelector(state => {
        console.log("app: ", state.authReducer)
        return state
    })
    return (
        <>
            <h1>Label ASR</h1>
        </>
    )
}

export default LabelASR;