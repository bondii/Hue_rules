import React from 'react'
import { Row, Col } from 'antd'
import { RulesDisplayer } from './components/RulesDisplayer'

export function App() {
    return ( 
        <Row>
            <Col span={24}>
                <RulesDisplayer />
            </Col>
        </Row>
    )
}