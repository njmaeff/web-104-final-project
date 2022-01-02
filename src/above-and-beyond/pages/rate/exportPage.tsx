import {Rate} from "../lib/orm/validate";
import {NextPage} from "next";
import {utcToZonedTime} from "date-fns-tz";
import {formatCurrency} from "../lib/util/currency";
import {css, Global} from "@emotion/react";
import {ensureDate, getTimezone} from "../lib/util/date";
import React from "react"
import capitalize from "lodash/capitalize";
import {Descriptions} from "antd";
import {TextHeading, TextSection} from "../lib/text";
import {HorizontalRule} from "../lib/layout/divider";

export type ServerProps = { record: Rate, tz?: string };
export const Report: React.FC = ({children}) => <>
    <Global styles={css`
        body {
            display: block !important;
            height: auto;
            background-color: white;
        }
    `}/>
    {children}
</>
export const ExportPage: NextPage<ServerProps> = ({
                                                      record,
                                                      tz = getTimezone()
                                                  }) => {

    const time = utcToZonedTime(ensureDate(record.date), tz).toDateString();
    return <Report>
        <div css={
            theme => css`
                padding: 1rem 0;

                h1 {
                    padding-left: 1rem;
                }

                .ant-descriptions-view {
                    width: 100%;
                }

                .ant-descriptions-item {
                    margin: 0 1rem;
                }

                .ant-descriptions-item-label {
                    background-color: ${theme.colors.light};
                }
            `
        }>
            <Descriptions title={
                <>
                    <TextHeading>{`Rate - ${capitalize(record.type)}`}</TextHeading>
                    <HorizontalRule/>
                </>
            }
                          layout="vertical" bordered>
                <Descriptions.Item label={
                    <TextSection>{"Date"}</TextSection>
                }>{time}</Descriptions.Item>
                <Descriptions.Item
                    label={
                        <TextSection>{"Value"}</TextSection>
                    }>{formatCurrency(record.value)}</Descriptions.Item>
                <Descriptions.Item
                    label={
                        <TextSection>{"Situation"}</TextSection>}>{record.situation}</Descriptions.Item>
                <Descriptions.Item
                    label={
                        <TextSection>{"Result"}</TextSection>
                    }>{record.result}</Descriptions.Item>
                {record.type === 'issue' ?
                    <Descriptions.Item
                        label={
                            <TextSection>{'Correction'}</TextSection>
                        }>{record.correction}</Descriptions.Item> : null}
            </Descriptions>
        </div>
    </Report>
};
