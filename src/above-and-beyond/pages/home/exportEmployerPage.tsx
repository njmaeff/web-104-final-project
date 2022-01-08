import {Employer} from "../lib/orm/validate";
import {NextPage} from "next";
import React from "react"
import {Descriptions} from "antd";
import {TextHeading, TextSection} from "../lib/text";
import {HorizontalRule} from "../lib/layout/divider";
import {Report} from "../lib/layout/report";

export type ServerProps = { record: Employer, tz?: string };
export const ExportEmployerPage: NextPage<ServerProps> = ({
                                                              record,
                                                          }) => {

    return <Report>
        <Descriptions title={
            <>
                <TextHeading>{`Employer - ${record.name}`}</TextHeading>
                <HorizontalRule/>
            </>
        }
                      layout="vertical" bordered>
            <Descriptions.Item
                label={
                    <TextSection>{"Location"}</TextSection>
                }>{record.location}</Descriptions.Item>

        </Descriptions>
    </Report>
};
