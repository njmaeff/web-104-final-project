import dynamic from "next/dynamic";

export const WithoutSSR: React.FC<{ component }> = ({component, children}) => {
    const Component = dynamic(component, {
        ssr: false
    })

    return <Component>{children}</Component>
}
