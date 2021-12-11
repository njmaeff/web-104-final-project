export const makeAbsolutePath = (...paths) => `/` + paths.filter((p) => !!p).join(`/`)
// export const makeRoute = (name, defaultPath = 'index') => ({
//     use: (url ?: string) => [makeAbsolutePath(name, url),
// makeAbsolutePath(name, url ?? defaultPath)] as const, link: (url ?: string)
// => ({ as: makeAbsolutePath(name, url), href: makeAbsolutePath(name, url ??
// defaultPath) } as const), })

export const makeRoute = (name) => (url?: string) => makeAbsolutePath(name, url)

export const routes = {
    home: makeRoute('home'),
    profile: makeRoute('profile'),
    rate: makeRoute('rate'),
    review: makeRoute('review'),
    index: makeRoute('index'),
    login: makeRoute('login'),
    gettingStarted: makeRoute('getting-started'),
}


export const actions = {
    view: 'view',
    edit: 'edit',
    new: 'new'
}
