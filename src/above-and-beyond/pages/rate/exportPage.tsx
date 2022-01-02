import {Rate} from "../lib/orm/validate";
import {NextPage} from "next";
import {utcToZonedTime} from "date-fns-tz";
import {formatCurrency} from "../lib/util/currency";
import {css, Global} from "@emotion/react";
import {ensureDate, getTimezone} from "../lib/util/date";
import React from "react"

export type ServerProps = { record: Rate, tz?: string };
export const Report: React.FC = ({children}) => <>
    <Global styles={css`
        body {
            display: block !important;
            height: auto;
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
        <div>
            <h1>Type: {record.type}</h1>
            <p>Time: {time}</p>
            <p>Value: {formatCurrency(record.value)}</p>
            <p>Situation: {record.situation}</p>
            <p>Result: {record.result}</p>
            {record.type === 'issue' ?
                <p>Correction: {record.correction}</p> : null}
        </div>
    </Report>
};
