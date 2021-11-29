// Client-side cache, shared for the whole session of the user in the browser.
import createCache from "@emotion/cache";

export const createEmotionCache = () => createCache({key: 'css'});
