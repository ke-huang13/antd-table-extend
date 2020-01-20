import { ColumnProps, TableProps } from "antd/es/table";
import { SyntheticEvent } from "react";
import { message } from "antd";

export interface EditableCellProps<Object> extends ColumnProps<Object> {
    record?: {},
    /**表头保存方法 */
    handleSave?: (row: any) => void,
    /**表头点击方法 */
    handleHeaderCellClick?: (record: {}) => void,
    /**表格伸缩方法，由表格内部实现 */
    onResize?: (e: SyntheticEvent<Element, Event>, data: any) => any,
    /**表格列索引 */
    index?: number,
    //设置是否显示右侧下拉按钮
    showHeaderRight?: boolean,
    //当showRight为true时，必须传入
    headerRight?: (record: any, index: number) => React.ReactNode,
    //表头title
    titleName?: string,
    //设置是否显示高亮效果
    showHighLight?: boolean;
    //设置表头是否可单击字段名编辑
    editable?: boolean,
    //表格处于编辑状态
    editing?: boolean;
    //是否支持回车后聚焦
    enterFocus?: boolean;
    //暴露回车事件
    handleInputEnter?: Function;
    //切换编辑状态
    handleToggleEdit?: Function;
}

export class EditableTableProps implements TableProps<Object> {
    /**字段名信息唯一标识 */
    columns?: EditableCellProps<Object>[];
    //表格数据源
    dataSource?: Object[];
    //单元格选中事件
    handleCellSelected?: (row: number, col: number) => void;
    //表头保存方法
    handleHeaderSave?: (index: any, field: any) => void;
    //css样式
    tableClassName?: string;
}

export class EditableTableStore {
    handleCellSelected?: (row: number, col: number) => void;
    handleHeaderSave?: (index: any, field: any) => void;;

    constructor() {
        // // super();
        // this.tableColumns = columns;
        // this.tableDataSource = dataSource;
    }

    tableColumns: EditableCellProps<Object>[] = [];

    curRowIndex: number = -1;

    curColIndex: number = -1;

    tableDataSource: Object[] = [];

    handleSave = row => {
        const { dataIndex } = row;
        const temporaryFieldName = row[dataIndex];
        this.tableColumns[dataIndex].editing = false;
        if (temporaryFieldName == '') {
            message.warn("字段不能为空");
            return
        }
        // const repeatFeild = this.tableColumns.filter(item => item.titleName === temporaryFieldName)
        let repeatSelf: boolean = false;
        let repeatOther: boolean = false;
        // //字段重复且不是原字段
        this.tableColumns.forEach((item, index) => {
            if (item.titleName == temporaryFieldName && index != parseInt(dataIndex))
                repeatOther = true;
            else if (item.titleName == temporaryFieldName && index == parseInt(dataIndex))
                repeatSelf = true;
        })
        if (repeatOther) {
            message.warn('字段名已存在');
            return;
        }
        if (this.handleHeaderSave && !repeatSelf) {
            this.handleHeaderSave(dataIndex, temporaryFieldName);
            this.tableColumns[dataIndex].title = temporaryFieldName;
            this.tableColumns[dataIndex].titleName = temporaryFieldName;

        }
    }

    handleResize = index => (e, { size }) => {
        this.tableColumns[index].width = size.width;
    }

    handleCellClick = (row: number = -1, col: number = -1) => {
        if (this.curColIndex == col && this.curRowIndex == row) {
            this.curRowIndex = -1;
            this.curColIndex = -1;
        } else {
            this.curRowIndex = row;
            this.curColIndex = col;
        }
        if (this.handleCellSelected)
            this.handleCellSelected(row, col)
    }

    handleInputEnter = (colIndex: number) => {
        const columnLength = this.tableColumns.length;
        if (colIndex + 1 < columnLength) {
            this.curColIndex = colIndex + 1;
            this.tableColumns[this.curColIndex].editing = true;
            if (this.handleCellSelected)
                this.handleCellSelected(-1, this.curColIndex)
        }
    }

    handleToggleEdit = (colIndex: number) => {
        this.tableColumns[colIndex].editing = !this.tableColumns[colIndex].editing;
    }
}