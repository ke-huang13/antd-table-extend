import { Component } from "react";
import React from "react";
import { Resizable } from "react-resizable";
import { Input, Form, Row, Col, Icon } from "antd";
import { FormComponentProps, WrappedFormUtils } from "antd/lib/form/Form";
import { EditableCellProps, EditableCellState } from "./interface";
import {
    Droppable,
    Draggable,
    DroppableProvided,
    DroppableStateSnapshot,
    DraggableProvided,
    DraggableStateSnapshot,
} from "react-beautiful-dnd";

const EditableContext = React.createContext({});

export const EditableRow = ({ form, index, ...props }) => (
    <Droppable droppableId="droppable" direction="horizontal">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <EditableContext.Provider value={{ form, snapshot }}>
                <tr
                    {...props}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                />
            </EditableContext.Provider>
        )}
    </Droppable>
);

const ResizeableTitle = (props) => {
    const {
        onResize,
        width,
        minConstraints,
        maxConstraints,
        provided,
        draggableSnapshot,
        ...restProps
    } = props;

    //width应为整数类型
    if (
        !width ||
        !Number.isFinite(width) ||
        (Number.isFinite(width) && !Number.isInteger(width))
    ) {
        return (
            <th
                {...restProps}
                ref={provided.innerRef}
                {...provided.draggableProps}
                style={
                    draggableSnapshot.isDragging
                        ? {
                              ...provided.draggableProps.style,
                          }
                        : {}
                }
            />
        );
    }

    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            minConstraints={minConstraints}
            maxConstraints={maxConstraints}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th
                {...restProps}
                ref={provided.innerRef}
                {...provided.draggableProps}
                style={
                    draggableSnapshot.isDragging
                        ? {
                              ...provided.draggableProps.style,
                          }
                        : {}
                }
            />
        </Resizable>
    );
};

export class EditableCell extends Component<
    EditableCellProps<Object> & FormComponentProps,
    EditableCellState
> {
    private form = this.props.form as WrappedFormUtils;
    private input: any;
    constructor(props: EditableCellProps<Object> & FormComponentProps) {
        super(props);
        this.state = {
            editing: false,
        };
    }

    save = (e) => {
        const {
            record,
            record: { headerSave },
            index,
        } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            headerSave && headerSave({ ...record, ...values, index });
        });
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    renderCell = ({form}) => {
        this.form = form;
        debugger
        const { children, dataIndex, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }} className="cell-value-input">
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `Column title is required.`,
                        },
                    ],
                    initialValue: title,
                })(
                    <Input
                        ref={(node) => (this.input = node)}
                        onPressEnter={this.save}
                        onBlur={this.save}
                    />
                )}
            </Form.Item>
        ) : (
            <div
                className={"editable-cell-value-wrap"}
                onClick={this.toggleEdit}
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
            headerSave,
            children,
            editable,
            index,
            ...restProps
        } = this.props;
        return (
            <Draggable key={dataIndex} draggableId={dataIndex} index={index}>
                {(
                    provided: DraggableProvided,
                    snapshot: DraggableStateSnapshot
                ) => (
                    <ResizeableTitle
                        {...restProps}
                        provided={provided}
                        draggableSnapshot={snapshot}
                    >
                        <Row type="flex" align="middle">
                            <Col
                                className={
                                    editable
                                        ? "icon-move"
                                        : "icon-move icon-hidden"
                                }
                            >
                                <Icon
                                    type="hdd"
                                    {...provided.dragHandleProps}
                                />
                            </Col>
                            <Col className="cell-content">
                                {editable ? (
                                    <EditableContext.Consumer>
                                        {this.renderCell}
                                    </EditableContext.Consumer>
                                ) : (
                                    children
                                )}
                            </Col>
                        </Row>
                    </ResizeableTitle>
                )}
            </Draggable>
        );
    }
}
