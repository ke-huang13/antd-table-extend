import { ColumnProps, TableProps } from "antd/es/table";

export interface EditableCellProps<Object> extends ColumnProps<Object> {
    record?: {},
    /**表头保存方法 */
    headerSave?: (row: any) => void,
    //设置表头是否可单击字段名编辑
    editable?: boolean,
}

// export class EditableTableProps implements TableProps<Object> {
//     /**字段名信息唯一标识 */
//     columns?: EditableCellProps<Object>[];
//     //表格数据源
//     dataSource?: Object[];
// }

// export class EditableTableStore {

//     tableColumns: EditableCellProps<Object>[] = [];

//     tableDataSource: Object[] = [];

//     handleResize = index => (e, { size }) => {
//         this.tableColumns[index].width = size.width;
//     }
// }