import {
    faPlusSquare,
    faMinusSquare,
    faBars,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useLockBodyScroll, useWindowSize } from 'react-use'

import BackButton from '../../../components/BackButton'
import { LoaderCard } from '../../../components/Loader'
import Text from '../../../components/Text'

function RaadpleegVerordeningSidebar({ verordening }) {
    const windowSize = useWindowSize()

    const sidebarContainer = useRef(null)
    const [isOpen, setIsOpen] = useState(() => windowSize.width > 1028)
    useLockBodyScroll(isOpen && windowSize.width < 1028)

    const [sidebarStyle, setSidebarStyle] = useState({})
    const [buttonStyle, setButtonStyle] = useState({})

    /** Effect for sidebarStyle */
    useEffect(() => {
        const nav = document.getElementById('navigation-main')
        const navBottom = nav.getBoundingClientRect().bottom
        setButtonStyle({
            top: navBottom,
        })
    }, [windowSize])

    /** Effect for sidebarStyle */
    useEffect(() => {
        if (windowSize.width && windowSize.width < 1028) {
            setSidebarStyle({
                left: 0,
                top: 150,
                width: '100vw',
                height: 'calc(100vh - 150px)',
            })
        } else if (windowSize.width) {
            if (!isOpen) {
                setIsOpen(true)
            }

            const container = sidebarContainer.current
            const containerOffsetTop = container.offsetTop
            const containerOffsetLeft = container.offsetLeft
            const containerWidth = container.offsetWidth
            const screenHeight = windowSize.height
            const offsetYAxis = 155

            const sidebarHeight =
                screenHeight - containerOffsetTop - offsetYAxis * 1.5

            setSidebarStyle({
                top: containerOffsetTop + offsetYAxis,
                height: sidebarHeight ? sidebarHeight : '50vh',
                width: containerWidth,
                left: containerOffsetLeft,
            })
        }
    }, [windowSize, isOpen])

    return (
        <div
            className="relative col-span-6 lg:col-span-2"
            ref={sidebarContainer}>
            <BackButton />
            <div
                style={buttonStyle}
                id="small-screen-verordening-nav"
                onClick={() => setIsOpen(!isOpen)}
                className="fixed left-0 z-50 flex items-center justify-center w-full py-2 text-lg transition-colors duration-150 ease-in bg-white border-t border-b cursor-pointer lg:hidden hover:bg-gray-50">
                <FontAwesomeIcon icon={faBars} className="mr-2 text-pzh-blue" />
                <span className="mt-1 font-bold text-pzh-blue">Inhoud</span>
            </div>
            <div
                style={sidebarStyle}
                className={`${
                    isOpen ? 'fixed' : 'hidden'
                } z-10 p-4 overflow-y-auto pb-16 bg-white text-pzh-blue-dark`}>
                <Text type="span" className="hidden font-bold lg:block">
                    Inhoud
                </Text>
                <Text type="body" className="block text-sm font-bold lg:mt-6">
                    Omgevingsverordening
                </Text>
                {verordening ? (
                    <ul className="pl-2 mt-4">
                        {verordening?.Structuur?.Children.map(chapter => (
                            <RaadpleegVerordeningSidebarItem
                                setNavMenuOpen={setIsOpen}
                                key={chapter.UUID}
                                item={chapter}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="py-4">
                        <LoaderCard mb="mb-2" height="20" />
                        <LoaderCard mb="mb-2" height="20" />
                        <LoaderCard mb="mb-2" height="20" />
                    </div>
                )}
            </div>
        </div>
    )
}

const RaadpleegVerordeningSidebarItem = ({ item, setNavMenuOpen }) => {
    const [isOpen, setIsOpen] = useState(false)
    const history = useHistory()
    const location = useLocation()
    const windowSize = useWindowSize()

    if (
        item.Type === 'Hoofdstuk' ||
        item.Type === 'Paragraaf' ||
        item.Type === 'Afdeling'
    ) {
        const hasChildren = item?.Children.length > 0
        return (
            <li className="my-2">
                <div className="">
                    <button
                        onClick={() => hasChildren && setIsOpen(!isOpen)}
                        className="cursor-pointer">
                        <FontAwesomeIcon
                            className={`mr-2 ${
                                hasChildren ? 'inline-block' : 'opacity-0'
                            }`}
                            icon={isOpen ? faMinusSquare : faPlusSquare}
                        />
                        <span className="font-bold">
                            {item.Type} {item.Volgnummer}
                        </span>
                    </button>
                    <span
                        onClick={() => {
                            history.push(
                                `${location.pathname}?actief=${item.UUID}`
                            )
                            if (windowSize.width < 1028) {
                                setNavMenuOpen(false)
                            }
                        }}
                        className="block pl-5 cursor-pointer">
                        {item.Titel}
                    </span>
                </div>
                {hasChildren > 0 ? (
                    <ul className={`pl-4 my-1 ${isOpen ? 'block' : 'hidden'}`}>
                        {item.Children.map(child => (
                            <RaadpleegVerordeningSidebarItem
                                setNavMenuOpen={setNavMenuOpen}
                                key={child.UUID}
                                item={child}
                            />
                        ))}
                    </ul>
                ) : null}
            </li>
        )
    } else if (item.Type === 'Lid' || item.Type === 'Artikel') {
        return (
            <li>
                <button
                    className="pl-5 my-1 text-left cursor-pointer"
                    onClick={() => {
                        history.push(`${location.pathname}?actief=${item.UUID}`)
                        if (windowSize.width < 1028) {
                            setNavMenuOpen(false)
                        }
                    }}>
                    <span className="font-bold">
                        {item.Type} {item.Volgnummer}
                    </span>
                    <span className="block">{item.Titel}</span>
                </button>
            </li>
        )
    } else {
        return null
    }
}

export default RaadpleegVerordeningSidebar
