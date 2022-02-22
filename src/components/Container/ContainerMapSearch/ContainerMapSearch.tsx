import { FC, useMemo } from 'react'
import { useMedia } from 'react-use'

interface ContainerMapSearchProps {
    id?: string
    className?: string
    reference?: string
}

const ContainerMapSearch: FC<ContainerMapSearchProps> = ({
    children,
    id = undefined,
    className = '',
    reference,
}) => {
    const isMobile = useMedia('(max-width: 640px)')

    const containerHeightStyle = useMemo(
        () => ({
            height: isMobile
                ? 'inherit'
                : `calc(100vh - ${
                      document.getElementById('navigation-main')?.offsetHeight +
                      'px'
                  })`,
        }),
        [isMobile]
    )

    return (
        <div
            id={id}
            ref={reference}
            className={`flex flex-col md:flex-row mx-auto ${className}`}
            style={containerHeightStyle}>
            {children}
        </div>
    )
}

export default ContainerMapSearch
