import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import {
    faCaretDown,
    faSignInAlt,
    faClock,
    faAngleRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// function getToken() {
//     return localStorage.getItem('access_token')
// }

function logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('access_token')
}

class NavigationMenuPopUp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
        }

        this.innerContainer = React.createRef()

        this.toggleOpen = this.toggleOpen.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    toggleOpen() {
        this.setState({
            open: !this.state.open,
        })
    }

    handleClick = e => {
        if (
            !this.innerContainer.current.contains(e.target) &&
            this.state.open === true
        ) {
            this.setState({
                open: false,
            })
            return
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false)
    }

    getUserName() {
        let identifier = localStorage.getItem('identifier')
        let gebruikersNaam = ''
        if (identifier !== null) {
            gebruikersNaam = JSON.parse(identifier).Gebruikersnaam.split(' ')[0]
        } else {
            gebruikersNaam = null
        }
        return gebruikersNaam
    }

    render() {
        return (
            <span
                className="text-gray-600 text-sm mr-3 relative"
                ref={this.innerContainer}
            >
                <span
                    id="navbar-toggle-popup"
                    onClick={this.toggleOpen}
                    className="cursor-pointer select-none text-sm text-gray-800"
                >
                    <span>
                        {this.getUserName() !== null
                            ? `Ingelogd als ${this.getUserName()}`
                            : 'Ingelogd'}
                    </span>
                    <FontAwesomeIcon
                        className="ml-2 text-gray-700"
                        icon={faCaretDown}
                    />
                </span>
                {this.state.open ? (
                    <div
                        id="navigation-tooltip-container"
                        className="absolute bg-white rounded mt-2 w-48 -ml-12 text-gray-700"
                    >
                        <div className="h-full relative">
                            <ul className="text-sm text-gray-800">
                                <li className="py-2 px-4 text-sm cursor-not-allowed">
                                    Mijn Instellingen
                                </li>
                                <li>
                                    {this.props.currentScreenMuteerOmgeving ? (
                                        <Link
                                            id="navbar-popup-href-raadpleeg-omgeving"
                                            to={`/`}
                                            className="py-2 px-4 text-sm border-t border-gray-300 w-full inline-block"
                                            onClick={this.toggleOpen}
                                        >
                                            Raadpleegomgeving
                                        </Link>
                                    ) : (
                                        <Link
                                            id="navbar-popup-href-raadpleeg-omgeving"
                                            to={`/muteer/dashboard`}
                                            className="py-2 px-4 text-sm border-t border-gray-300 w-full inline-block"
                                            onClick={this.toggleOpen}
                                        >
                                            Muteeromgeving
                                        </Link>
                                    )}
                                </li>
                                <li>
                                    <Link
                                        id="navbar-popup-href-uitloggen"
                                        className="py-2 px-4 text-sm border-t border-gray-300 w-full inline-block"
                                        to={`/login`}
                                        onClick={() => {
                                            logout()
                                            this.props.setLoginState(false)
                                        }}
                                    >
                                        Uitloggen
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : null}
            </span>
        )
    }
}

// function LoggedIn() {
//     let identifier = localStorage.getItem('identifier')
//     let gebruikersNaam = ''
//     if (identifier !== null) {
//         gebruikersNaam = JSON.parse(identifier).Gebruikersnaam.split(' ')[0]
//     } else {
//         gebruikersNaam = null
//     }

//     return (
//         <Link to={`/login`} onClick={logout} className="text-sm text-gray-800">
//             <span>
//                 {gebruikersNaam !== null
//                     ? `Ingelogd als ${gebruikersNaam}`
//                     : 'Ingelogd'}
//             </span>
//             <FontAwesomeIcon
//                 className="ml-2 text-gray-700"
//                 icon={faCaretDown}
//             />
//         </Link>
//     )
// }

function LoginLogoutButton(props) {
    if (props.loggedIn) {
        return (
            <NavigationMenuPopUp
                currentScreenMuteerOmgeving={props.currentScreenMuteerOmgeving}
                setLoginState={props.setLoginState}
            />
        )
    } else {
        return (
            <Link className="text-sm" to="/login" id="href-naar-inloggen">
                <FontAwesomeIcon
                    className="mr-2 text-gray-700"
                    icon={faSignInAlt}
                />
                <span className="text-gray-800">Inloggen</span>
            </Link>
        )
    }
}

function Logo() {
    return (
        <React.Fragment>
            <div className="logo-beeldmerk" />
            <div className="logo-tekst" />
        </React.Fragment>
    )
}

class Navigation extends Component {
    render() {
        const currentScreenMuteerOmgeving = this.props.location.pathname.includes(
            'muteer'
        )
        return (
            <nav
                className="bg-white fixed w-full z-10 top-0"
                id="navigation-main"
            >
                <div className="lg:px-10 bg-white border-b border-gray-200 py-6 container mx-auto flex items-center justify-between flex-wrap bg-white">
                    <div className="flex items-center flex-no-shrink text-black mr-6 py-2">
                        {this.props.loggedIn ? (
                            <Link
                                id="href-naar-home"
                                to={`/muteer/dashboard`}
                                className="text-blue"
                            >
                                <Logo />
                            </Link>
                        ) : (
                            <Link
                                id="href-naar-home"
                                to={`/`}
                                className="text-blue"
                            >
                                <Logo />
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center justify-end">
                        <LoginLogoutButton
                            currentScreenMuteerOmgeving={
                                currentScreenMuteerOmgeving
                            }
                            setLoginState={this.props.setLoginState}
                            loggedIn={this.props.loggedIn}
                        />
                    </div>
                </div>
            </nav>
        )
    }
}

export default withRouter(Navigation)
