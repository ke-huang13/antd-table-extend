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

const EditableContext = React.createContext({
    form: {},
    snapshot: {},
    destinationIndex: -1,
});

export const EditableRow = ({ form, destinationIndex, ...props }) => (
    <Droppable droppableId="droppable" direction="horizontal">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <EditableContext.Provider
                value={{ form, snapshot, destinationIndex }}
            >
                <tr
                    {...props}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    {props.children}
                    {provided.placeholder}
                </tr>
            </EditableContext.Provider>
        )}
    </Droppable>
);

const getItemStyle = (
    draggableSnapshot,
    provided,
    start,
    end,
    index
): React.CSSProperties => {
    if (draggableSnapshot.isDragging) {
        return { ...provided.draggableProps.style };
    } else if (index == end) {
        if (start < end) {
            return { borderRight: "2px dashed #025BDE" };
        } else if (start > end) {
            return { borderLeft: "2px dashed #025BDE" };
        }
        return {};
    }
    return {};
};

const ResizeableTitle = (props) => {
    const {
        onResize,
        width,
        minConstraints,
        maxConstraints,
        provided,
        draggableSnapshot,
        index,
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
        <EditableContext.Consumer>
            {({ snapshot, destinationIndex }) => {
                const start = parseInt(
                    (snapshot as DroppableStateSnapshot).draggingFromThisWith
                );
                const end =
                    destinationIndex == undefined ? start : destinationIndex;
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
                            style={getItemStyle(
                                draggableSnapshot,
                                provided,
                                start,
                                end,
                                index
                            )}
                        />
                    </Resizable>
                );
            }}
        </EditableContext.Consumer>
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

    renderCell = ({ form }) => {
        this.form = form;
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
            <Draggable key={dataIndex} draggableId={index + ""} index={index}>
                {(
                    provided: DraggableProvided,
                    snapshot: DraggableStateSnapshot
                ) => (
                    <ResizeableTitle
                        {...restProps}
                        provided={provided}
                        draggableSnapshot={snapshot}
                        index={index}
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
