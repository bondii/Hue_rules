import React from 'react'
import { Collapse, Row, Col, Descriptions, Table } from 'antd'
import { REST } from '../utils/restController'

const { Panel } = Collapse
const { Item } = Descriptions

export class RulesDisplayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rules: []
        }
    }
/* 
    state = {
        rules: []
    }
 */
    componentDidMount() {
        this.load()
    }

    async load() {
        const res = await REST({ path: 'rules' })
        const data = res.data

        this.setState({ rules: Object.entries(data) })
    }
    
    render() {
        const { rules } = this.state

        const content = rules ? rules.map((rule, i) => (
                <Panel key={i} header={<RuleHeader rule={rule} />}>
                    <RuleContent rule={rule} />
                </Panel>
            )
        ) : <div>No data fetched</div>

        return (
            <Collapse>
                {content}
            </Collapse>
        )
    }
}

function RuleHeader(props) {
    const { rule } = props
    return (
        <Row>
            <Col span={12}>
                {<b>{`${rule[0]} - `}</b>}
                {`${rule[1].name}`}
            </Col>
        </Row>
    )
}

function RuleContent(props) {
    const { rule } = props
    // take away conditions actions and name
    const { name, conditions, actions, ...restOfRule } = rule[1]
    
    console.log(conditions)

    const items = Object.entries(restOfRule).map(e => (
        <Item key={e[0]} label={<b>{e[0]}</b>}>
            {e[1]}
        </Item>
    ))

    return (
        <Descriptions layout='vertical' bordered>
            {items}
            <Item label={<b>Conditions</b>}>
                <Table
                    dataSource={conditions.map(e => ({ ...e, key: e.address }))}
                    columns={[
                        { title: 'Address', dataIndex: 'address' },
                        { title: 'Operator', dataIndex: 'operator' },
                        { title: 'Value', dataIndex: 'value' }
                    ]}
                    pagination={false}
                />
            </Item>
        </Descriptions>
    )
}