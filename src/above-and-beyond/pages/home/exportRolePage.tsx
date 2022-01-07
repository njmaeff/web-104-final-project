import {Role} from "../lib/orm/validate";
import {NextPage} from "next";
import {utcToZonedTime} from "date-fns-tz";
import {formatCurrency} from "../lib/util/currency";
import {ensureDate, getTimezone} from "../lib/util/date";
import React from "react"
import {Descriptions} from "antd";
import {TextHeading, TextSection} from "../lib/text";
import {HorizontalRule} from "../lib/layout/divider";
import {Report} from "../lib/layout/report";

export type ServerProps = { record: Role, tz?: string };
export const ExportRolePage: NextPage<ServerProps> = ({
                                                          record,
                                                          tz = getTimezone()
                                                      }) => {

    const time = utcToZonedTime(ensureDate(record.startDate), tz).toDateString();
    return <Report>
        <Descriptions title={
            <>
                <TextHeading>{`Role`}</TextHeading>
                <HorizontalRule/>
            </>
        }
                      layout="vertical" bordered>
            <Descriptions.Item label={
                <TextSection>{"Start Date"}</TextSection>
            }>{time}</Descriptions.Item>
            <Descriptions.Item
                label={
                    <TextSection>{"Salary"}</TextSection>
                }>{formatCurrency(record.salary)}</Descriptions.Item>
            <Descriptions.Item
                label={
                    <TextSection>{"Salary Target"}</TextSection>
                }>{formatCurrency(record.salaryTarget)}</Descriptions.Item>
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
    </Report>
};
