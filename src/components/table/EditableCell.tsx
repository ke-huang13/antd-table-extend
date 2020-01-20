import './EditableTable.less'
import { Component } from "react";
import React from "react";
import { Resizable } from 'react-resizable';
import { Row, Input, Col, Form } from "antd";
import { FormComponentProps, WrappedFormUtils } from "antd/lib/form/Form";
import { EditableCellProps } from './interface';

const EditableContext = React.createContext("No Data");

export const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            minConstraints={[100, 0]}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} >{props.children}</th>
        </Resizable>
    );
};

export class EditableCell extends Component<EditableCellProps<Object> & FormComponentProps> {
    private form = this.props.form as WrappedFormUtils;
    private input: any;
    constructor(props: EditableCellProps<Object> & FormComponentProps) {
        super(props);
        // this.handleClick.bind(this)
    }

    state = {
        editing: this.props.editing,
    };

    componentWillReceiveProps(nextProps) {
        const { editing } = nextProps;
        if (editing) {
            this.setState({ editing }, () => {
                if (this.input) {
                    this.input.focus();
                    this.input.select();
                }
            });
        } else {
            this.setState({ editing: editing })
        }
    }

    //input保存事件
    //由回车或失去焦点触发，做非空判断，如果为空弹出提示，不继续往上触发保存方法，并不会将字段值置空
    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            handleSave({ ...record, ...values });
        });
    };

    //cell 整个容器的点击事件，暴露出去可在table内控制表格高亮效果，以及业务层可做表头点击事件
    //封装的此方法仅仅控制高亮，其余涉及表格状态不建议在此处
    handleHeaderCellClick() {
        const { record, handleHeaderCellClick } = this.props;
        handleHeaderCellClick(record)
    }

    renderCell = form => {
        this.form = form;
        const { editable, children, dataIndex, record, titleName, handleInputEnter, handleToggleEdit } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    initialValue: titleName,
                })(<Input ref={node => (this.input = node)} onPressEnter={e => { this.save(e); handleInputEnter() }} onBlur={this.save} />)}
            </Form.Item>
        ) : (
                <div
                    className={editable ? "editable-cell-value-wrap" : ""}
                    onClick={() => {editable && handleToggleEdit()}}
                >
                    {children}
                </div>
            );
    };

    render() {
        const {
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            headerRight,
            showHeaderRight,
            handleHeaderCellClick,
            titleName,
            handleInputEnter,
            handleToggleEdit,
            editing,
            editable,
            enterFocus,
            ...restProps
        } = this.props;
        return (
            <ResizeableTitle {...restProps}>
                <Row className="table-thead-title" type="flex" align='middle' justify='space-between' onClick={() => this.handleHeaderCellClick()}>
                    <Col style={{ flex: 1 }}>
                        {
                            enterFocus ?
                            <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer> :
                            children
                        }
                    </Col>
                    {showHeaderRight && !editing &&
                        <Col>
                            {headerRight}
                        </Col>
                    }
                </Row>
            </ResizeableTitle >
        );
    }
}