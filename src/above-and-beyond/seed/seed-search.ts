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
                    {'name': 'date', 'type': 'int32'},
                    {'name': 'type', 'type': 'string'},
                    {'name': 'result', 'type': 'string'},
                ],
                default_sorting_field: 'date'
            }),
            client.collections().create({
                name: 'review',
                fields: [
                    {'name': 'id', 'type': 'string'},
                    {'name': 'date', 'type': 'int32'},
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
