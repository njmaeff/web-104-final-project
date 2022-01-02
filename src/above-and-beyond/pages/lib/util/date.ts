import {DateLike, SerializedTimestamp} from "../orm/validate";
import firebase from "firebase/compat";

export const getTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone
export const Timestamp = firebase.firestore.Timestamp;
export const isTimestampLike = (obj): obj is SerializedTimestamp => '_seconds' in obj && '_nanoseconds' in obj
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
