import { Component } from "react";
import React from "react";
import { Table, Form } from "antd";
import { EditableCell, EditableRow } from "./EditableCell";
import { TableProps } from "antd/lib/table/interface";
import "./style/index.less";
import {
    EditableTableState,
    EditableCellProps,
    EditableTableProps,
} from "./interface";
import { DragDropContext } from "react-beautiful-dnd";

const EditableFormRow = Form.create()(EditableRow);

export class EditableTable<T> extends Component<
    EditableTableProps<T>,
    EditableTableState<T>
> {
    constructor(props: TableProps<T>) {
        super(props);
        this.state = {
            destinationIndex: -1,
        };
    }

    /**
     * 拖拽结束
     */
    onDragEnd = (result) => {
        this.setState({ destinationIndex: -1 });
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const { handleDragEnd } = this.props;
        handleDragEnd &&
            handleDragEnd(result.source.index, result.destination.index);
    };

    /**
     * 拖拽更新
     */
    onDragUpdate = (initial) => {
        if (!initial.destination) return;
        this.setState({ destinationIndex: initial.destination.index });
    };

    render() {
        const { destinationIndex } = this.state;
        const tableColumns = this.props.columns.map((col, index) => ({
            ...col,
            onHeaderCell: (column: EditableCellProps<T>) => ({
                width: column.width,
                onResize: column.handleResize ? column.handleResize(index) :undefined,
                record: column,
                editable: column.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                headerSave: column.headerSave,
                minConstraints: column.minConstraints,
                maxConstraints: column.maxConstraints,
                index,
                isDragDisabled:column.isDragDisabled
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
            <DragDropContext
                onDragEnd={this.onDragEnd}
                onDragUpdate={this.onDragUpdate}
            >
                <Table
                    components={components}
                    columns={tableColumns}
                    onHeaderRow={() => ({ destinationIndex })}
                    {...restProps}
                />
            </DragDropContext>
        );
    }
}
