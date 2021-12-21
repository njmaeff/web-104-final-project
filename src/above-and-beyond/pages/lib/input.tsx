import React from "react";
import DatePicker from "react-datepicker"
import {Form, Input} from "antd";
import {css} from "@emotion/react";
import {ScrollBar} from "./styles/mixins";
import {ParagraphSize, SectionSize, SubTitleSize} from "./styles/size";

interface FieldProps<Value = any> {
    label: string;
    name?: string;
    onChange?;
    onBlur?
    readonly?: boolean;
    error?: boolean;
    touched?: boolean;
    value: Value;
}

export const FormTextArea: React.FC<{ error, name, onChange, onBlur, value }> = ({
                                                                                     name,
                                                                                     onChange,
                                                                                     onBlur,
                                                                                     value
                                                                                 }) => {

    return <Input.TextArea
        name={name}
        onBlur={onBlur}
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
                       touched,
                       readonly,
                       onChange,
                       onBlur,
                       name,
                       error
                   }) => {
    return (
        <FieldRowWrapper
            label={label} error={error} readonly={readonly}
            touched={touched}
            css={
                (theme) => css`
                    height: ${height};
                    position: relative;
                    width: 100%;

                    .ant-form-item-label {
                        position: static;
                    }

                    .ant-form-item-children-icon {
                        top: 90% !important;
                    }

                    label {
                        display: block;
                        ${SubTitleSize};
                        margin: 0.5rem;
                        padding: 0 0.5rem;
                        position: absolute;
                        top: -0.7rem;
                        z-index: 100;
                        left: 0.5rem;
                        background-color: ${theme.colors.light};
                    }

                    textarea, p {
                        font-family: inherit;
                        ${ParagraphSize};
                        border: 2px solid ${theme.colors.grayLight};
                        width: 100%;
                        min-height: 9rem;
                        max-height: 15rem;
                        padding: 1.5rem 1rem 2rem;
                        margin: 0;

                        resize: none;
                        outline: none;

                        line-height: 1.3rem;
                        background-color: ${theme.colors.light} !important;
                        color: ${theme.colors.dark} !important;

                    }

                `
            }
            className={`input-text ${
                !readonly ? "input-text__write-mode" : ""
            }`}
        >
            {readonly ? (
                <p>{value}</p>
            ) : (
                <FormTextArea
                    error={error}
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                />
            )}
        </FieldRowWrapper>
    );
};

export const FieldRowWrapper: React.FC<{ label: string, error?: boolean, readonly?: boolean, touched?: boolean, className? }> = ({
                                                                                                                                     label,
                                                                                                                                     error,
                                                                                                                                     readonly,
                                                                                                                                     touched,
                                                                                                                                     children,
                                                                                                                                     className,
                                                                                                                                 }) => {
    return (
        <Form.Item
            label={label}
            hasFeedback={!readonly && touched}
            validateStatus={touched && error ? 'error' : 'success'}
            className={className}
            css={theme => css`

                label {
                    color: ${theme.colors.gray};
                }

                p {
                    background-color: transparent;
                }

                .react-datepicker-popper {
                    position: relative;
                    z-index: 1000;
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

export const FormInput: React.FC<{ name: string, onChange: any, value: any, error, onBlur }> = ({
                                                                                                    name,
                                                                                                    onChange,
                                                                                                    onBlur,
                                                                                                    value,
                                                                                                    error,
                                                                                                }) => {
    return <Input
        css={theme => css`
            background-color: ${theme.colors.light} !important;
            color: ${theme.colors.dark};
        `}
        type="text"
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
    />
}

export const FieldInputRow: React.FC<FieldProps> = ({
                                                        label,
                                                        readonly,
                                                        onChange,
                                                        onBlur,
                                                        value,
                                                        touched,
                                                        name,
                                                        error,
                                                    }) => {
    return (
        <FieldRowWrapper label={label} error={error} readonly={readonly}
                         touched={touched}>
            {readonly ? (
                <p>{value}</p>
            ) : (
                <FormInput name={name} onChange={onChange} value={value}
                           error={error} onBlur={onBlur}/>
            )}
        </FieldRowWrapper>
    );
};

export const FieldDatePickerRow: React.FC<FieldProps<Date>> = ({
                                                                   value,
                                                                   onChange,
                                                                   onBlur,
                                                                   touched,
                                                                   readonly,
                                                                   name,
                                                                   label,
                                                                   error,
                                                               }) => {
    return (
        <FieldRowWrapper label={label} error={error} readonly={readonly}
                         touched={touched}>
            {readonly ? (
                <p>
                    {value.toLocaleString("en", {
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
                    selected={value}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            )}
        </FieldRowWrapper>
    );
};

export const FieldDateTimePickerRow: React.FC<FieldProps<Date>> = ({
                                                                       value,
                                                                       onChange,
                                                                       onBlur,
                                                                       readonly,
                                                                       name,
                                                                       label,
                                                                       error,
                                                                       touched,
                                                                   }) => {
    return (
        <FieldRowWrapper label={label} error={error} readonly={readonly}
                         touched={touched}>
            {readonly ? (
                <p>{value.toLocaleString()}</p>
            ) : (
                <DatePicker
                    className={error ? "border-highlight__primary" : ""}
                    name={name}
                    readOnly={readonly}
                    selected={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
            )}
        </FieldRowWrapper>
    );
};

export const FieldDropDownInput: React.FC<FieldProps & { DropDown }> = ({
                                                                            value,
                                                                            onChange,
                                                                            onBlur,
                                                                            readonly,
                                                                            name,
                                                                            label,
                                                                            error,
                                                                            touched,
                                                                            children,
                                                                            DropDown,
                                                                        }) => {

    return (
        <FieldRowWrapper label={label} error={error} readonly={readonly}
                         touched={touched}>
            {readonly ? (
                <DropDown/>
            ) : (
                <FormInput
                    name={name}
                    error={error}
                    onChange={onChange}
                    onBlur={onBlur}
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
        <Form css={css`
            display: flex;
            flex-direction: column;
            width: 100%;
            padding-bottom: 1rem;
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
