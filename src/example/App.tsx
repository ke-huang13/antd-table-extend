import React, { Component } from "react";
import EditableTable from "../components/table";

const DataSource = [
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
];

export default class App extends Component<{}, { column: object[] }> {
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
          render: (text, record) => <span>delete</span>,
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

  render() {
    const { column } = this.state;
    return (
      <div className="App">
        <EditableTable
          columns={column}
          dataSource={DataSource}
          bordered
          pagination={false}
        ></EditableTable>
      </div>
    );
  }
}
