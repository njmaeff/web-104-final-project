import {NextPage} from "next";
import {Rate} from "../lib/orm/validate";
import {ensureDate} from "../lib/orm/docs";
import {utcToZonedTime} from 'date-fns-tz'
import {withServerSideProps} from "../lib/util/next";

type ServerProps = { record: Rate, tz: string };
export const ExportPage: NextPage<ServerProps> = ({record, tz}) => {
    const time = utcToZonedTime(ensureDate(record.date), tz).toDateString();
    return <div>
        <h1>Type: {record.type}</h1>
        <p>Time: {time}</p>
        <p>Value: {record.value}</p>
        <p>Situation: {record.situation}</p>
        <p>Result: {record.result}</p>
        {record.type === 'issue' ?
            <p>Correction: {record.correction}</p> : null}
    </div>
};

export const getServerSideProps = withServerSideProps(() => import("./getRecordFromPath"));

export default ExportPage
