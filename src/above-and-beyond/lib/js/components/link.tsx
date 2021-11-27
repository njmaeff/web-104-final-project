import React from "react";
import { useRouter } from "../../hooks/useRouter";

export const Link: React.FC<
    JSX.IntrinsicElements["a"] & { params?; disabled?: boolean }
> = ({ children, onClick, params, disabled, className = "", ...props }) => {
    const { navigate } = useRouter();

    return (
        <a
            {...props}
            className={`${className} ${disabled ? "link-disabled" : ""}`}
            onClick={(e) => {
                e.preventDefault();
                if (!disabled) {
                    navigate({ to: props.href, params: params });
                    onClick?.(e);
                }
            }}
        >
            {children}
        </a>
    );
};
