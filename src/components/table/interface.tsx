import { ColumnProps, TableProps } from "antd/es/table";

export interface EditableCellProps<T> extends ColumnProps<T> {
    record?: EditableCellProps<T>;
    /**表头保存方法 */
    headerSave?: (row: any) => void;
    /**设置表头是否可单击字段名编辑 */
    editable?: boolean;
    /**可伸缩的最小距离 */
    minConstraints?: [number, number];
    /**可伸缩的最大距离 */
    maxConstraints?: [number, number];
    /**表格列索引 */
    index?: number;
}

export interface EditableCellState {
    editing: boolean;
}

export interface EditableTableState<T> {
    tableColumns: EditableCellProps<T>[];
}

export interface EditableTableProps<T> extends TableProps<T> {
    /** 拖拽完成后事件 */
    handleDragEnd?: (startIndex: number, endIndex: number) => void;
}
