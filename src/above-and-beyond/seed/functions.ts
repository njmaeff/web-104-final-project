import * as functions from "firebase-functions"

import {createClient} from "./search";
import {Rate, Review} from "../pages/lib/orm/validate";

const client = createClient({
    host: process.env.SEARCH_HOST_INTERNAL
})

const ratePath = `/users/{userID}/employers/{employerID}/roles/{roleID}/rate/{rateID}`;
const rateCollection = 'rate';

type RateData = Rate & { date: { _seconds } };

export const onRateCreate = functions.firestore.document(ratePath)
    .onCreate((snapshot, context) => {
        // Grab the document id as id value.

        const {userID, roleID,rateID} = context.params
        const {date, ...doc} = snapshot.data() as RateData
        // Index the document in Rates collection
        return client.collections(rateCollection).documents().create({
            id: rateID,
            userID,
            roleID,
            date: date._seconds, ...doc
        })
    })


export const onRateUpdate = functions.firestore.document(ratePath)
    .onUpdate((change, context) => {
        // Grab the changed value
        const {rateID} = context.params
        const {date, ...doc} = change.after.data() as RateData;
        return client.collections(rateCollection).documents(rateID).update({
            date: date._seconds,
            ...doc
        })
    });

export const onRateDelete = functions.firestore.document(ratePath)
    .onDelete((snap, context) => {
        return client.collections(rateCollection).documents(context.params.rateID).delete()
    })


const reviewPath = `/users/{userID}/employers/{employerID}/roles/{roleID}/review/{reviewID}`;
const reviewCollection = 'review';


export type ReviewData = Review & { date: { _seconds } }

export const onReviewCreate = functions.firestore.document(reviewPath)
    .onCreate((snapshot, context) => {
        // Grab the document id as id value.

        const {userID, roleID, reviewID} = context.params
        const {date, ...doc} = snapshot.data() as ReviewData
        // Index the document in Reviews collection
        return client.collections(reviewCollection).documents().create({
            id: reviewID,
            userID,
            roleID,
            date: date._seconds, ...doc
        })
    })


export const onReviewUpdate = functions.firestore.document(reviewPath)
    .onUpdate((change, context) => {
        // Grab the changed value
        const {reviewID} = context.params
        const {date, ...doc} = change.after.data() as ReviewData;
        return client.collections(reviewCollection).documents(reviewID).update({
            date: date._seconds,
            ...doc
        })
    });

export const onReviewDelete = functions.firestore.document(reviewPath)
    .onDelete((snap, context) => {
        return client.collections(reviewCollection).documents(context.params.reviewID).delete()
    })
