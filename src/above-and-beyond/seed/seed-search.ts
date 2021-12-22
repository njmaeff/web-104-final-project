require("dotenv").config();

import {createClient} from "./search";


export const makeCollections = () => {
    const client = createClient();

    return Promise.all(
        [
            client.collections().create({
                name: 'rate',
                fields: [
                    {'name': 'id', 'type': 'string'},
                    {'name': 'userID', 'type': 'string'},
                    {'name': 'roleID', 'type': 'string'},
                    {'name': 'value', 'type': 'int32'},
                    {'name': 'date', 'type': 'int32'},
                    {'name': 'type', 'type': 'string', facet: true},
                    {'name': 'result', 'type': 'string'},
                ],
                default_sorting_field: 'date'
            }),
            client.collections().create({
                name: 'review',
                fields: [
                    {'name': 'id', 'type': 'string'},
                    {'name': 'userID', 'type': 'string'},
                    {'name': 'roleID', 'type': 'string'},
                    {'name': 'date', 'type': 'int32'},
                    {'name': 'adjustedSalary', 'type': 'int32'},
                    {'name': 'outcome', 'type': 'string'},
                ],
                default_sorting_field: 'date'
            }),
        ]
    )
};


if (require.main) {
    makeCollections().catch((e) => console.error(e));
}
