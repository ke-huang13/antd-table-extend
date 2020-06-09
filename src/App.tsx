import React, { Component } from "react";
import "./App.less";
import EditableTable from "./components/table";

const Columns = [
  {
    title: "name",
    dataIndex: "name",
    width: 200,
    editable: true,
  },
  {
    title: "age",
    dataIndex: "age",
    width: 200,
  },
  {
    title: "address",
    dataIndex: "address",
    width: 200,
  },
  {
    title: "operation",
    dataIndex: "operation",
    render: (text, record) => <span>delete</span>,
  },
];

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

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <EditableTable
          columns={Columns}
          dataSource={DataSource}
          bordered
          pagination={false}
        ></EditableTable>
      </div>
    );
  }
}
