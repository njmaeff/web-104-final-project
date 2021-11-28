import React from "react";
import {
    HeadingSize,
    ParagraphSize,
    SectionSize,
    SubTitleSize,
    TitleSize
} from "../styles/size";

export const Heading: React.FC = ({children}) => {

    return <h1 css={
        HeadingSize
    }>{children}</h1>
};
export const Title: React.FC = ({children}) => {

    return <h2 css={
        TitleSize
    }>{children}</h2>
};
export const SubTitle: React.FC = ({children}) => {

    return <h2 css={
        SubTitleSize
    }>{children}</h2>
};

export const Section: React.FC<{ tag?: 'h3' }> = ({children, tag = 'h3'}) => {

    return <h3 css={
        SectionSize
    }>{children}</h3>
};

export const Paragraph: React.FC = ({children}) => {

    return <p css={ParagraphSize}>{children}</p>
};
