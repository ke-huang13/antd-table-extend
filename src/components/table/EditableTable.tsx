import './EditableTable.less'
import { Component } from "react";
import React from "react";
import { Table, Form } from "antd";
import { EditableCell, EditableRow } from './EditableCell';
import { EditableTableProps, EditableTableStore } from './interface';

const EditableFormRow = Form.create()(EditableRow);

export default class EditableTable extends Component<EditableTableProps>{
    store: EditableTableStore
    constructor(props: EditableTableProps) {
        super(props)

        this.store = new EditableTableStore()
        this.store.handleCellSelected = this.props.handleCellSelected;
        this.store.handleHeaderSave = this.props.handleHeaderSave;
    }

    componentWillReceiveProps(nextProp) {
        this.store.tableDataSource = nextProp.dataSource;
        this.store.tableColumns = nextProp.columns;
    }

    render() {
        const { tableDataSource, curRowIndex, curColIndex } = this.store;
        const { tableClassName } = this.props;
        const components = {
            header: {
                row: EditableFormRow,
                cell: EditableCell,
            }
        };

        const tableColumns = this.store.tableColumns.map((col, colIndex) => {
            return {
                ...col,
                render: (text, record, index) => (
                    <div className={curRowIndex == index && curColIndex == colIndex && col.showHighLight ? 'table-highlight tabel-cell-content' : ' tabel-cell-content'}
                        onClick={() => this.store.handleCellClick(index, colIndex)}>{col.render(text, record, index)}</div>
                ),
                className: curRowIndex == -1 && curColIndex == colIndex && col.showHighLight ? 'table-highlight' : '',
                onHeaderCell: record => ({
                    record,
                    width: record.width,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    titleName: col.titleName,
                    handleSave: this.store.handleSave,
                    onResize: this.store.handleResize(colIndex),
                    handleHeaderCellClick: () => { this.store.handleCellClick(-1, colIndex) },
                    showHeaderRight: col.showHeaderRight,
                    headerRight: col.headerRight ? col.headerRight(record, colIndex) : undefined,
                    handleInputEnter: () => { this.store.handleInputEnter(colIndex) },
                    handleToggleEdit: () => { this.store.handleToggleEdit(colIndex) },
                    editing: col.editing == undefined ? false : col.editing,
                    enterFocus: col.enterFocus == undefined ? false : col.enterFocus
                }),
            };
        });

        return (
            <div className={tableClassName} style={{ height: '100%' }}>
                <Table
                    size="small"
                    pagination={false}
                    components={components}
                    className={'common-editable-table editing'}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={tableDataSource}
                    columns={tableColumns}
                    scroll={{ x: 'max-content', y: true }}
                />
            </div>
        );
    }
}