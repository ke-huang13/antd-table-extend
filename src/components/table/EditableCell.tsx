import { Component } from "react";
import React from "react";
import { Resizable } from "react-resizable";
import { Input, Form } from "antd";
import { FormComponentProps, WrappedFormUtils } from "antd/lib/form/Form";
import { EditableCellProps, EditableCellState } from "./interface";

const EditableContext = React.createContext({});

export const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const ResizeableTitle = (props) => {
  const {
    onResize,
    width,
    minConstraints,
    maxConstraints,
    ...restProps
  } = props;

  //width应为整数类型
  if (
    !width ||
    !Number.isFinite(width) ||
    (Number.isFinite(width) && !Number.isInteger(width))
  ) {
    return <th {...restProps} />;
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
      <th {...restProps} />
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
    console.log("props", this.props);
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

  renderCell = (form) => {
    this.form = form;
    const { children, dataIndex, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
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
      <div className={"editable-cell-value-wrap"} onClick={this.toggleEdit}>
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
      ...restProps
    } = this.props;
    return (
      <ResizeableTitle {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </ResizeableTitle>
    );
  }
}
