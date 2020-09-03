import React, { Component } from "react";
import EditableTable from "../components/table";
import { Button } from "antd";
/**
 * 示例代码
 * state可根据情况完善类型
 */
export default class App extends Component<
    {},
    { column: object[]; dataSource: object[] }
> {
    constructor(props) {
        super(props);
        this.state = {
            column: [
                {
                    title: "name",
                    dataIndex: "name",
                    width: 200,
                    editable: true,
                    headerSave: this.headerSave,
                    minConstraints: [100, 0],
                },
                {
                    title: "age",
                    dataIndex: "age",
                    width: 200,
                    editable: true,
                    headerSave: this.headerSave,
                },
                {
                    title: "address",
                    dataIndex: "address",
                    width: 200,
                    editable: true,
                    headerSave: this.headerSave,
                },
                {
                    title: "operation",
                    dataIndex: "operation",
                    render: (text, record) => (
                        <Button
                            type="primary"
                            onClick={() => {
                                this.handleDelete(record.key);
                            }}
                        >
                            Delete
                        </Button>
                    ),
                },
            ],
            dataSource: [
                {
                    key: "0",
                    name: "Edward King 0",
                    age: "32",
                    address: "London, Park Lane no. 0",
                },
                {
                    key: "1",
                    name: "Edward King 1",
                    age: "32",
                    address: "London, Park Lane no. 1",
                },
            ],
        };
    }

    headerSave = (row: any) => {
        const { dataIndex, index } = row;
        // const { column } = this.state;
        this.setState(({ column }) => {
            const nextColumns = [...column];
            nextColumns[index] = {
                ...nextColumns[index],
                title: row[dataIndex],
            };
            return { column: nextColumns };
        });
    };

    handleDragEnd = (startIndex: number, endIndex: number) => {
        const { column } = this.state;
        const result = Array.from(column);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        this.setState({ column: result });
    };

    handleDelete(key) {
        const { dataSource } = this.state;
        const result = Array.from(dataSource);
        result.splice(key, 1);
        this.setState({ dataSource: result });
    }

    render() {
        const { column, dataSource } = this.state;
        return (
            <div className="App">
                <EditableTable
                    columns={column}
                    dataSource={dataSource}
                    bordered
                    pagination={false}
                    handleDragEnd={this.handleDragEnd}
                ></EditableTable>
            </div>
        );
    }
}
