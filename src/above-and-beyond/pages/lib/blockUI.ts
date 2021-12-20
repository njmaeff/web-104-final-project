export const toggleBlock = async (fn) => {
    const element = document.createElement('div');
    Object.assign(element.style, {
        position: 'absolute',
        zIndex: '999999',
        width: '100%',
        height: '100%',
        opacity: '0.3',
        top: '0',
        bottom: '0',
        background: 'black'
    } as HTMLDivElement['style'])
    Object.assign(element, {
        tabIndex: 100,
    } as Partial<HTMLDivElement>)
    document.body.appendChild(element);
    element.focus();
    const rm = () => element.remove()
    try {
        const result = await fn()
        rm()
        return result
    } catch (e) {
        rm()
        throw e
    }
};
