import * as Typesense from 'typesense'

export const createClient = ({
                                 host = process.env.NEXT_PUBLIC_SEARCH_HOST,
                                 port = parseInt(process.env.NEXT_PUBLIC_SEARCH_PORT),
                                 protocol = process.env.NEXT_PUBLIC_SEARCH_PORT,
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


