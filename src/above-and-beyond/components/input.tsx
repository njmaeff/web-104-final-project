import React from "react";
import DatePicker from "react-datepicker";
import { ensureDate } from "../orm/docs";
import { DropDown } from "./control";

interface FieldProps<Value = any> {
    heading: string;
    name?: string;
    onChange?;
    readonly?: boolean;
    error?: boolean;
    touched?: boolean;
    value: Value;
}

export const TextInput: React.FC<
    {
        width?: string;
        height?: string;
    } & FieldProps
> = ({ width, height, heading, value, readonly, onChange, name, error }) => {
    return (
        <div
            className={`input-text ${
                !readonly ? "input-text__write-mode" : ""
            }`}
            style={{ width, height }}
        >
            <h2>{heading}</h2>
            {readonly ? (
                <p>{value}</p>
            ) : (
                <textarea
                    className={error ? "border-highlight__primary" : ""}
                    name={name}
                    onChange={onChange}
                    value={value}
                />
            )}
        </div>
    );
};

export const FieldInputRowWrapper: React.FC<{ heading: string }> = ({
    heading,
    children,
}) => {
    return (
        <div className={"text-paragraph field-input-row"}>
            <h4>{heading}</h4>
            {children}
        </div>
    );
};

export const FieldInputRow: React.FC<FieldProps> = ({
    heading,
    readonly,
    onChange,
    value,
    name,
    error,
}) => {
    return (
        <FieldInputRowWrapper heading={heading}>
            {readonly ? (
                <p>{value}</p>
            ) : (
                <input
                    className={error ? "border-highlight__primary" : ""}
                    type="text"
                    name={name}
                    onChange={onChange}
                    value={value}
                />
            )}
        </FieldInputRowWrapper>
    );
};

export const FieldDatePickerRow: React.FC<FieldProps<Date>> = ({
    value,
    onChange,
    readonly,
    name,
    heading,
    error,
}) => {
    const date = ensureDate(value);
    return (
        <FieldInputRowWrapper heading={heading}>
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
        </FieldInputRowWrapper>
    );
};

export const FieldDateTimePickerRow: React.FC<FieldProps<Date>> = ({
    value,
    onChange,
    readonly,
    name,
    heading,
    error,
}) => {
    const date = ensureDate(value);
    return (
        <FieldInputRowWrapper heading={heading}>
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
        </FieldInputRowWrapper>
    );
};

export const FieldDropDownInput: React.FC<FieldProps> = ({
    value,
    onChange,
    readonly,
    name,
    heading,
    error,
    children,
}) => {
    return (
        <FieldInputRowWrapper heading={heading}>
            {readonly ? (
                <DropDown current={value}>{children}</DropDown>
            ) : (
                <input
                    className={error ? "border-highlight__primary" : ""}
                    type="text"
                    name={name}
                    onChange={onChange}
                    value={value}
                />
            )}
        </FieldInputRowWrapper>
    );
};

export const FieldTable: React.FC<{
    heading?: string;
}> = ({ heading, children }) => {
    return (
        <div className={"field-input"}>
            {heading && <h3 className={"text-section"}>{heading}</h3>}
            {children}
        </div>
    );
};
