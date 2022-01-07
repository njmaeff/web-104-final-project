import {Review} from "../lib/orm/validate";
import {NextPage} from "next";
import {utcToZonedTime} from "date-fns-tz";
import {formatCurrency} from "../lib/util/currency";
import {ensureDate, getTimezone} from "../lib/util/date";
import React from "react"
import {Descriptions} from "antd";
import {TextHeading, TextSection} from "../lib/text";
import {HorizontalRule} from "../lib/layout/divider";
import {Report} from "../lib/layout/report";

export type ServerProps = { record: Review, tz?: string };

export const ExportReviewPage: NextPage<ServerProps> = ({
                                                      record,
                                                      tz = getTimezone()
                                                  }) => {

    const time = utcToZonedTime(ensureDate(record.date), tz).toDateString();
    return <Report>
        <Descriptions title={
            <>
                <TextHeading>{`Review`}</TextHeading>
                <HorizontalRule/>
            </>
        }
                      layout="vertical" bordered>
            <Descriptions.Item label={
                <TextSection>{"Date"}</TextSection>
            }>{time}</Descriptions.Item>
            <Descriptions.Item
                label={
                    <TextSection>{"Manager"}</TextSection>
                }>{record.manager}</Descriptions.Item>
            <Descriptions.Item
                label={
                    <TextSection>{"Adjusted Salary"}</TextSection>
                }>{formatCurrency(record.adjustedSalary)}</Descriptions.Item>
            <Descriptions.Item
                label={
                    <TextSection>{"Outcome"}</TextSection>}>{record.outcome}</Descriptions.Item>
        </Descriptions>
    </Report>
};
