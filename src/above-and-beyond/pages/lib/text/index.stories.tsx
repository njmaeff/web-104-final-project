import React from "react"
import {
    TextHeading,
    TextParagraph,
    TextSection,
    TextSubTitle,
    TextTitle
} from "./index";
import {Meta} from "@storybook/react";
import {WithCenter} from "../sb/withCenter";

export const Heading = () => <TextHeading>Heading</TextHeading>
export const Title = () => <TextTitle>Title</TextTitle>
export const SubTitle = () => <TextSubTitle>SubTitle</TextSubTitle>
export const Section = () => <TextSection>Section</TextSection>
export const Paragraph = () => <TextParagraph>Paragraph</TextParagraph>

export default {
    decorators: [WithCenter]
} as Meta
