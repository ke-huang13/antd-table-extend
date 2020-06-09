import { Component } from "react";
import React from "react";
import { Table, Form } from "antd";
import { EditableCell, EditableRow } from "./EditableCell";
import { TableProps, ColumnProps } from "antd/lib/table/interface";
import "./style/index.less";
import { EditableCellProps } from "./interface";

const EditableFormRow = Form.create()(EditableRow);

interface EditableTableState<T> {
  tableDataSource: T[];
  tableColumns: EditableCellProps<T>[];
}

export class EditableTable<T> extends Component<
  TableProps<T>,
  EditableTableState<T>
> {
  constructor(props: TableProps<T>) {
    super(props);
    const { dataSource, columns } = this.props;
    this.state = {
      tableDataSource: dataSource,
      tableColumns: columns,
    };
  }

  componentWillReceiveProps(nextProp) {
    this.setState({
      tableDataSource: nextProp.dataSource,
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
    const { tableDataSource } = this.state;
    const tableColumns = this.state.tableColumns.map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: this.handleResize(index),
        record: column,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        headerSave: column.headerSave,
      }),
    }));
    const components = {
      header: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const { columns, dataSource, ...restProps } = this.props;

    // const tableColumns = this.store.tableColumns.map((col, colIndex) => {
    //   return {
    //     ...col,
    //     onHeaderCell: (record) => ({
    //       record,
    //       width: record.width,
    //       editable: col.editable,
    //       dataIndex: col.dataIndex,
    //       title: col.title,
    //       titleName: col.titleName,
    //       handleSave: this.store.handleSave,
    //       onResize: this.store.handleResize(colIndex),
    //       handleHeaderCellClick: () => {
    //         this.store.handleCellClick(-1, colIndex);
    //       },
    //       showHeaderRight: col.showHeaderRight,
    //       headerRight: col.headerRight
    //         ? col.headerRight(record, colIndex)
    //         : undefined,
    //       handleInputEnter: () => {
    //         this.store.handleInputEnter(colIndex);
    //       },
    //       handleToggleEdit: () => {
    //         this.store.handleToggleEdit(colIndex);
    //       },
    //       editing: col.editing == undefined ? false : col.editing,
    //       enterFocus: col.enterFocus == undefined ? false : col.enterFocus,
    //     }),
    //   };
    // });

    return (
      <Table
        components={components}
        dataSource={tableDataSource}
        columns={tableColumns}
        {...restProps}
      />
    );
  }
}
