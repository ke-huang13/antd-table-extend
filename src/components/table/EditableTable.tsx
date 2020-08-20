import { Component } from "react";
import React from "react";
import { Table, Form } from "antd";
import { EditableCell, EditableRow } from "./EditableCell";
import { TableProps } from "antd/lib/table/interface";
import "./style/index.less";
import { EditableTableState, EditableCellProps } from "./interface";

const EditableFormRow = Form.create()(EditableRow);

export class EditableTable<T> extends Component<
  TableProps<T>,
  EditableTableState<T>
> {
  constructor(props: TableProps<T>) {
    super(props);
    const { columns } = this.props;
    this.state = {
      tableColumns: columns,
    };
  }

  componentWillReceiveProps(nextProp) {
    this.setState({
      tableColumns: nextProp.columns,
    });
  }

  handleResize = (index) => (e, { size }) => {
    this.setState(({ tableColumns }) => {
      const nextColumns = [...tableColumns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { tableColumns: nextColumns };
    });
  };

  render() {
    const tableColumns = this.state.tableColumns.map((col, index) => ({
      ...col,
      onHeaderCell: (column: EditableCellProps<T>) => ({
        width: column.width,
        onResize: this.handleResize(index),
        record: column,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        headerSave: column.headerSave,
        minConstraints: column.minConstraints,
        maxConstraints: column.maxConstraints,
        index
      }),
    }));
    const components = {
      header: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const { columns, ...restProps } = this.props;

    return (
      <Table components={components} columns={tableColumns} {...restProps} />
    );
  }
}
