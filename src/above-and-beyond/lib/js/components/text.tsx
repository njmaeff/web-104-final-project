import React from "react";

export const FieldDisplayTable: React.FC<{
    heading?: string;
    inputs: [string, string][];
}> = ({ heading, inputs }) => {
    return (
        <div className={"field-display"}>
            {heading && <h3 className={"text-section"}>{heading}</h3>}
            {inputs.map(([name, inputText]) => {
                return (
                    <div key={name} className={"text-paragraph"}>
                        <h4>{name}</h4>
                        <p>{inputText}</p>
                    </div>
                );
            })}
        </div>
    );
};
