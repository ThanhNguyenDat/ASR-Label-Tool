// @flow
import * as React from 'react';
import { Outlet } from 'react-router-dom';

import { Col, Row } from 'reactstrap';
import style from './styles.module.scss';


function LabelUILayout(props) {
    return (
        <Row>
            <Col sm={2} className={style.controlPart}>
                <h1>LabelUI</h1>
            </Col>
            <Col sm={10}>
                <Outlet />
            </Col>
        </Row>
    )
}

export default LabelUILayout