import * as Typesense from 'typesense'

export const createClient = ({
                                 host = process.env.SEARCH_HOST,
                                 port = parseInt(process.env.SEARCH_PORT),
                                 protocol = process.env.SEARCH_PORT,
                                 apiKey = process.env.SEARCH_API_KEY
                             } = {}) => {

    return new Typesense.Client({
        'nodes': [{
            host,
            port,
            protocol,
        }],
        apiKey,
        'connectionTimeoutSeconds': 2
    })
}


