// @flow
import * as React from 'react';
import { Outlet } from 'react-router-dom';

import { Col, Row } from 'reactstrap';
import style from './styles.module.scss';


function FaceIDLayout(props) {
    return (
        <Col>
            <Row className={style.controlPart}>
                <h1>FaceID</h1>
            </Row>
            <Row>
                <Outlet />
            </Row>
        </Col>
    )
}

export default FaceIDLayout