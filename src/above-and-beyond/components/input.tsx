import React from "react";
import {ensureDate} from "../orm/docs";
import DatePicker from "react-datepicker"
import {Button, Dropdown, Form, Input, Menu} from "antd";
import {css} from "@emotion/react";
import {Highlight, ScrollBar} from "../styles/mixins";
import {ParagraphSize, SectionSize} from "../styles/size";
import {DownOutlined} from "@ant-design/icons";

interface FieldProps<Value = any> {
    label: string;
    name?: string;
    onChange?;
    readonly?: boolean;
    error?: boolean;
    touched?: boolean;
    value: Value;
}

export const FormTextArea: React.FC<{ error, name, onChange, value }> = ({
                                                                             error,
                                                                             name,
                                                                             onChange,
                                                                             value
                                                                         }) => {

    return <Input.TextArea
        css={theme => css`
            ${Highlight(error ? theme.colors.primary : 'inherit')}
        `}
        name={name}
        onChange={onChange}
        value={value}
    />
};

export const TextInput: React.FC<{
    width?: string;
    height?: string;
} & FieldProps> = ({
                       width,
                       height,
                       label,
                       value,
                       readonly,
                       onChange,
                       name,
                       error
                   }) => {
    return (
        <div
            css={
                theme => css`
                    height: ${height};
                    position: relative;
                    width: 100%;

                    h2 {
                        margin: 0.5rem;
                        padding: 0 0.5rem;
                        position: absolute;
                        top: -1.4rem;
                        z-index: 100;
                        left: 0;
                        background-color: ${theme.colors.light};
                    }

                    textarea, p {
                        font-family: inherit;
                        font-size: 0.8rem;
                        border: thin solid ${theme.colors.light};
                        width: 100%;
                        min-height: 9rem;
                        max-height: 15rem;
                        padding: 1.5rem 1rem 2rem;
                        margin: 0;

                        overflow-y: scroll;
                        resize: none;
                        outline: none;

                        line-height: 1.3rem;
                        background-color: ${theme.colors.light};
                        color: ${theme.colors.dark};

                        ${!readonly && css`
                            &:active, &:focus {
                                outline: none !important;
                                ${Highlight(theme.colors.primary)}
                            }
                        `
                        }

                    }

                `
            }
            className={`input-text ${
                !readonly ? "input-text__write-mode" : ""
            }`}
        >
            <h2>{label}</h2>
            {readonly ? (
                <p>{value}</p>
            ) : (
                <FormTextArea
                    error={error}
                    name={name}
                    onChange={onChange}
                    value={value}
                />
            )}
        </div>
    );
};

export const FieldRowWrapper: React.FC<{ label: string, error?: boolean, readonly?: boolean }> = ({
                                                                                                      label,
                                                                                                      error,
                                                                                                      readonly,
                                                                                                      children,
                                                                                                  }) => {
    return (
        <Form.Item
            label={label}
            hasFeedback={!readonly}
            validateStatus={error ? 'error' : 'success'}
            css={theme => css`

                label {
                    color: ${theme.colors.gray};
                }

                p {
                    background-color: transparent;
                }

                .react-datepicker-wrapper {
                    input {
                        margin-left: 0;
                    }
                }

                input, button.control-dropdown__toggle {

                    ${ScrollBar(theme)}
                    border: 2px solid ${theme.colors.grayLight};
                    background-color: ${theme.colors.light};
                    padding: 0.2rem 0.5rem;
                }

                ${ParagraphSize}
            `}>
            {children}
        </Form.Item>
    );
};

export const FormInput: React.FC<{ name: string, onChange: any, value: any, error }> = ({
                                                                                            name,
                                                                                            onChange,
                                                                                            value,
                                                                                            error,
                                                                                        }) => {
    return <Input
        css={theme => css`
            ${Highlight(error ? theme.colors.primary : 'inherit')}
        `}
        type="text"
        name={name}
        onChange={onChange}
        value={value}
    />
}

export const FieldInputRow: React.FC<FieldProps> = ({
                                                        label,
                                                        readonly,
                                                        onChange,
                                                        value,
                                                        name,
                                                        error,
                                                    }) => {
    return (
        <FieldRowWrapper label={label} error={error} readonly={readonly}>
            {readonly ? (
                <p>{value}</p>
            ) : (
                <FormInput name={name} onChange={onChange} value={value}
                           error={error}/>
            )}
        </FieldRowWrapper>
    );
};

export const FieldDatePickerRow: React.FC<FieldProps<Date>> = ({
                                                                   value,
                                                                   onChange,
                                                                   readonly,
                                                                   name,
                                                                   label,
                                                                   error,
                                                               }) => {
    const date = ensureDate(value);
    return (
        <FieldRowWrapper label={label} error={error} readonly={readonly}>
            {readonly ? (
                <p>
                    {date.toLocaleString("en", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })}
                </p>
            ) : (
                <DatePicker
                    className={error ? "border-highlight__primary" : ""}
                    name={name}
                    readOnly={readonly}
                    selected={date}
                    onChange={onChange}
                />
            )}
        </FieldRowWrapper>
    );
};

export const FieldDateTimePickerRow: React.FC<FieldProps<Date>> = ({
                                                                       value,
                                                                       onChange,
                                                                       readonly,
                                                                       name,
                                                                       label,
                                                                       error,
                                                                   }) => {
    const date = ensureDate(value);
    return (
        <FieldRowWrapper label={label} error={error} readonly={readonly}>
            {readonly ? (
                <p>{date.toLocaleString()}</p>
            ) : (
                <DatePicker
                    className={error ? "border-highlight__primary" : ""}
                    name={name}
                    readOnly={readonly}
                    selected={date}
                    onChange={onChange}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
            )}
        </FieldRowWrapper>
    );
};

export const FieldDropDownInput: React.FC<FieldProps> = ({
                                                             value,
                                                             onChange,
                                                             readonly,
                                                             name,
                                                             label,
                                                             error,
                                                             children,
                                                         }) => {

    return (
        <FieldRowWrapper label={label} error={error} readonly={readonly}>
            {readonly ? (
                <Dropdown css={theme => css`
                    background-color: ${theme.colors.light};

                `} overlay={
                    <Menu>{children}</Menu>
                }

                          trigger={['click']}>
                    <Button css={theme =>
                        css`
                            border: 2px solid ${theme.colors.grayLight};
                        `
                    }>{value}<DownOutlined/></Button>
                </Dropdown>
            ) : (
                <FormInput
                    name={name}
                    error={error}
                    onChange={onChange}
                    value={value}

                />
            )}
        </FieldRowWrapper>
    );
};

export const FieldTable: React.FC<{
    heading?: string;
}> = ({heading, children}) => {

    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 6},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 14},
        },
    };

    return (
        <Form css={(theme) => css`
            display: flex;
            flex-direction: column;
            width: 100%;
            padding-bottom: 1rem;
            border-bottom: thin solid ${theme.colors.grayLight};
            margin-bottom: 1rem;
            h3 {
                margin: 1rem 0 0.5rem;
                ${SectionSize}
            }


        `}
              {...formItemLayout}
        >
            {heading && <h3>{heading}</h3>}
            {children}
        </Form>
    );
};
