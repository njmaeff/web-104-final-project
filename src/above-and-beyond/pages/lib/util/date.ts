import {Timestamp} from "firebase/firestore";
import {DateLike, SerializedTimestamp} from "../orm/validate";

export const getTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone
export const isTimestampLike = (obj): obj is SerializedTimestamp => typeof obj === 'object' && '_seconds' in obj && '_nanoseconds' in obj
export const ensureDate = (date: DateLike): Date => {
    if (date instanceof Date) {
        return date
    } else if (date instanceof Timestamp) {
        return date.toDate();
    } else if (isTimestampLike(date)) {
        return new Timestamp(date._seconds, date._nanoseconds).toDate()
    } else {
        throw new Error('Unknown date type')
    }
};
export const isDateLike = (date: DateLike) => {
    return date instanceof Timestamp || date instanceof Date || isTimestampLike(date);
};
export {Timestamp}
