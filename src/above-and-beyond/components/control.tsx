import React, { useState } from "react";
import * as popper from "react-popper";
import { Link } from "./link";

export const DropDownWindow: React.FC<{
    referenceElement;
    referenceContainer;
    setReferenceContainer;
    close;
}> = ({
    referenceElement,
    referenceContainer,
    setReferenceContainer,
    close,
    children,
}) => {
    const { styles, attributes } = popper.usePopper(
        referenceElement,
        referenceContainer,
        {
            placement: "bottom",
            modifiers: [
                {
                    name: "hide",
                },
            ],
        }
    );

    return (
        <div
            className={"control-dropdown-container"}
            ref={setReferenceContainer}
            style={styles.popper}
            {...attributes.popper}
        >
            {children}
        </div>
    );
};

export const DropDown: React.FC<{
    current: string;
    headingType?: "h3" | "p";
}> = ({ current, children, headingType = "p" }) => {
    const [isToggled, toggle] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperContainer, setPopperContainer] =
        useState<HTMLDivElement>(null);

    return (
        <div
            className={"control-dropdown"}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as HTMLElement)) {
                    toggle(false);
                }
            }}
        >
            <button
                className={"control-dropdown__toggle"}
                ref={setReferenceElement}
                onClick={() => {
                    toggle(!isToggled);
                }}
            >
                {headingType === "h3" ? <h3>{current}</h3> : <p>{current}</p>}
                <span className={"icon-angle-down"} />
                {isToggled ? (
                    <DropDownWindow
                        referenceElement={referenceElement}
                        referenceContainer={popperContainer}
                        setReferenceContainer={setPopperContainer}
                        close={() => toggle(false)}
                    >
                        {children}
                    </DropDownWindow>
                ) : null}
            </button>
        </div>
    );
};
export const DropDownElement: React.FC<{
    href: string;
    onClick: () => any;
    params?;
}> = (props) => {
    return (
        <div>
            <Link
                href={props.href}
                onClick={props.onClick}
                params={props.params}
            >
                {props.children}
            </Link>
        </div>
    );
};
