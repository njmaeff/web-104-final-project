import {NextPage} from "next";
import {Rate} from "../lib/orm/validate";
import {ensureDate} from "../lib/orm/docs";
import {utcToZonedTime} from 'date-fns-tz'
import {withServerSideProps} from "../lib/util/next";
import {css, Global,} from "@emotion/react";
import {formatCurrency} from "../lib/util/currency";

type ServerProps = { record: Rate, tz: string };

export const Report: React.FC = ({children}) => <>
    <Global styles={css`
        body {
            display: block !important;
        }
    `}/>
    {children}
</>

export const ExportPage: NextPage<ServerProps> = ({record, tz}) => {
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

export const getServerSideProps = withServerSideProps(() => import("./getRecordFromPath"));

export default ExportPage
