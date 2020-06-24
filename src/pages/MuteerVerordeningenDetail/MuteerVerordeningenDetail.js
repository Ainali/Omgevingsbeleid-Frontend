import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { faPlus, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import queryString from 'query-string'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import clonedeep from 'lodash.clonedeep'

// Import Components
import ButtonBackToPage from './../../components/ButtonBackToPage'
import EigenaarsDriehoek from '../../components/EigenaarsDriehoek'
import ContainerMain from './../../components/ContainerMain'
import ContainerDetailMain from '../../components/ContainerDetailMain'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

function getQueryStringValues(urlParams) {
    const queryStringValues = queryString.parse(urlParams)
    const hoofdstukIndex = queryStringValues.hoofdstuk
    const nest_1 = queryStringValues.nest_1
    const nest_2 = queryStringValues.nest_2
    const nest_3 = queryStringValues.nest_3
    return [hoofdstukIndex, nest_1, nest_2, nest_3]
}

// Generate Back Button for Detail or Version page
function GenerateBackToButton({ overzichtSlug, lineageID, urlParams }) {
    const [hoofdstukIndex, nest_1, nest_2, nest_3] = getQueryStringValues(
        urlParams
    )

    return (
        <ButtonBackToPage
            terugNaar={` verordening`}
            url={`/muteer/${overzichtSlug}/${lineageID}?actiefHoofdstuk=${hoofdstukIndex}`}
        />
    )
}

class PopUpDetailDropdown extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
        }

        this.innerContainer = React.createRef()
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick = (e) => {
        if (
            !this.innerContainer.current.contains(e.target) &&
            this.props.openState === true
        ) {
            this.props.toggleDropdown()
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false)
    }

    render() {
        return (
            <div
                className="absolute top-0 right-0 w-48 mt-2 mt-12 mr-2 text-gray-700 bg-white rounded shadow main-tooltip-container main-tooltip-container-muteer-detail tooltip-right"
                ref={this.innerContainer}
            >
                <div className="relative h-full">
                    <ul className="text-sm text-gray-800">
                        <li
                            className="px-4 py-2 text-sm cursor-pointer"
                            onClick={() => {
                                this.props.toggleDropdown()
                                this.props.deleteItem()
                            }}
                        >
                            Verwijder {this.props.type.toLowerCase()}
                        </li>
                        {/* <li>
                            <Link
                                id="navbar-popup-href-raadpleeg-omgeving"
                                to={`/`}
                                className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300"
                            >
                                Raadpleegomgeving
                            </Link>
                        </li> */}
                    </ul>
                </div>
            </div>
        )
    }
}

class MuteerVerordeningenDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataObject: {
                Titel: '',
            },
            dropdown: false,
            dataReceived: false,
        }

        this.getDataFromApi = this.getDataFromApi.bind(this)
        this.toggleDropdown = this.toggleDropdown.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.patchObjectMetNieuweEindGeldigheid = this.patchObjectMetNieuweEindGeldigheid.bind(
            this
        )
        this.patchNewStructuur = this.patchNewStructuur.bind(this)
    }

    generateApiEndpoint() {
        const baseDimensieConstants = this.props.dimensieConstants
        const ApiEndpointBase = baseDimensieConstants.API_ENDPOINT
        const verordeningsType = this.props.match.params.type
        const dimensieConstants = this.props.dimensieConstants[
            verordeningsType.toUpperCase()
        ]

        const detail_id = this.props.match.params.single
        return `${ApiEndpointBase}/version/${detail_id}`
    }

    // Method to create the API endpoint, based on the page type
    getDataFromApi() {
        const apiEndpoint = this.generateApiEndpoint()

        // Connect With the API
        axios
            .get(apiEndpoint)
            .then((res) => {
                const dataObject = res.data
                this.setState({ dataObject: dataObject, dataReceived: true })
            })
            .catch((error) => {
                if (error.response !== undefined) {
                    if (error.response.status === 404) {
                        this.props.history.push(
                            `/muteer/${this.props.overzichtSlug}`
                        )
                        toast(
                            `Deze ${this.props.dataModel.variables.Titel_Enkelvoud.toLowerCase()} kon niet gevonden worden`
                        )
                    }
                } else {
                    toast(`Er is iets misgegaan`)
                }
            })
    }

    toggleDropdown() {
        this.setState({
            dropdown: !this.state.dropdown,
        })
    }

    patchObjectMetNieuweEindGeldigheid() {
        let dataObject = this.state.dataObject
        const dataObjectID = dataObject.ID

        delete dataObject.ID
        delete dataObject.UUID
        delete dataObject.Modified_By
        delete dataObject.Modified_Date
        delete dataObject.Created_By
        delete dataObject.Created_Date

        dataObject.Eind_Geldigheid = new Date()
        dataObject.Status = 'Vervallen'

        axios
            .patch(`/verordeningen/${dataObjectID}`, JSON.stringify(dataObject))
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err))
    }

    deleteItem() {
        const confirmBool = window.confirm(
            `Wilt u dit object, inclusief alle onderliggende objecten, verwijderen?`
        )
        if (!confirmBool) return

        const urlParams = this.props.location.search
        const [hoofdstukIndex, nest_1, nest_2, nest_3] = getQueryStringValues(
            urlParams
        )

        this.patchObjectMetNieuweEindGeldigheid()

        const lineage = this.state.lineage
        if (nest_3 !== 'null') {
            const index_1 = parseInt(nest_1)
            const index_2 = parseInt(nest_2)
            const index_3 = parseInt(nest_3)

            let lineageChildren = clonedeep(
                lineage.Structuur.Children[hoofdstukIndex].Children[index_1]
                    .Children[index_2].Children
            )
            lineageChildren = [
                ...lineageChildren.slice(0, index_3),
                ...lineageChildren.slice(index_3 + 1),
            ]

            lineage.Structuur.Children[hoofdstukIndex].Children[
                index_1
            ].Children[index_2].Children = lineageChildren

            this.setState(
                {
                    lineage: lineage,
                },
                () => this.patchNewStructuur()
            )
        } else if (nest_2 !== 'null') {
            const index_1 = parseInt(nest_1)
            const index_2 = parseInt(nest_2)

            let lineageChildren = clonedeep(
                lineage.Structuur.Children[hoofdstukIndex].Children[index_1]
                    .Children
            )
            lineageChildren = [
                ...lineageChildren.slice(0, index_2),
                ...lineageChildren.slice(index_2 + 1),
            ]

            lineage.Structuur.Children[hoofdstukIndex].Children[
                index_1
            ].Children = lineageChildren

            this.setState(
                {
                    lineage: lineage,
                },
                () => this.patchNewStructuur()
            )
        } else if (nest_1 !== 'null') {
            const index_1 = parseInt(nest_1)
            let lineageChildren = clonedeep(
                lineage.Structuur.Children[hoofdstukIndex].Children
            )
            lineageChildren = [
                ...lineageChildren.slice(0, index_1),
                ...lineageChildren.slice(index_1 + 1),
            ]
            lineage.Structuur.Children[
                hoofdstukIndex
            ].Children = lineageChildren

            this.setState(
                {
                    lineage: lineage,
                },
                () => this.patchNewStructuur()
            )
        } else {
            let lineageChildren = clonedeep(lineage.Structuur.Children)
            lineageChildren = [
                ...lineageChildren.slice(0, parseInt(hoofdstukIndex)),
                ...lineageChildren.slice(parseInt(hoofdstukIndex) + 1),
            ]

            lineage.Structuur.Children = lineageChildren

            this.setState(
                {
                    lineage: lineage,
                },
                () => this.patchNewStructuur()
            )
        }
    }

    patchNewStructuur() {
        const verordeningsStructuurPostObject = {
            Structuur: this.state.lineage.Structuur,
        }

        const lineageID = this.props.match.params.lineageID

        axios
            .patch(
                `/verordeningstructuur/${lineageID}`,
                verordeningsStructuurPostObject
            )
            .then((res) =>
                this.props.history.push(`/muteer/verordeningen/${lineageID}`)
            )
            .catch((err) => console.log(err))
    }

    // On initial mount, set pagetype and get data from API
    componentDidMount() {
        this.getDataFromApi()

        // Get Lineage
        const ID = this.props.match.params.lineageID
        axios
            .get(`/verordeningstructuur/${ID}`)
            .then((res) => {
                // Get latest lineage
                const lineage = res.data[res.data.length - 1]
                this.setState({
                    lineage: lineage,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        // Variables to give as props
        const baseDimensieConstants = this.props.dimensieConstants
        const overzichtSlug = baseDimensieConstants.SLUG_OVERZICHT

        const verordeningsType = this.props.match.params.type
        const dimensieConstants = this.props.dimensieConstants[
            verordeningsType.toUpperCase()
        ]

        const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD

        // False if data is loading, true if a response is received
        let dataReceived = this.state.dataReceived

        // If the page is a detail page the dataObject will be an array.
        // We always want the first item from this array
        // Else the dataObject will be a single Object
        let dataObject = this.state.dataObject

        return (
            <ContainerMain>
                {dataObject && dataObject.Titel ? (
                    <Helmet>
                        <title>Omgevingsbeleid - {dataObject.Titel}</title>
                    </Helmet>
                ) : null}

                {/* Dimensie Container */}
                <div className="inline-block w-full">
                    <GenerateBackToButton
                        hash={this.props.location.hash}
                        lineageID={this.props.match.params.lineageID}
                        dataObject={dataObject}
                        overzichtSlug={overzichtSlug}
                        urlParams={this.props.location.search}
                    />

                    <div className="flex">
                        <div className="w-full">
                            <div className="h-10 mt-5 ">
                                <Link
                                    className="flex items-center w-1/2 mt-5"
                                    to={`/muteer/verordeningen/${this.props.match.params.lineageID}/bewerk/${dataObject.Type}/${dataObject.UUID}/${dataObject.ID}${this.props.location.search}`}
                                    id={`href-ontwerp-maken`}
                                >
                                    <span className="relative flex items-center justify-end w-24 h-10 pb-5 mr-2 border-r-2 border-gray-300">
                                        <div className="absolute w-8 h-8 pt-1 text-center bg-gray-300 rounded-full -right-4">
                                            <FontAwesomeIcon
                                                className="relative text-gray-600"
                                                icon={faPlus}
                                            />
                                        </div>
                                    </span>
                                    <span className="inline pl-5 -mt-5 text-sm text-gray-700 cursor-pointer hover:underline">
                                        Bewerken
                                    </span>
                                </Link>
                            </div>
                            <ContainerDetailMain
                                dataObject={dataObject}
                                lineageID={this.props.match.params.lineageID}
                                urlParams={this.props.location.search}
                                overzichtSlug={overzichtSlug}
                                titelEnkelvoud={dataObject.Type}
                                dataReceived={dataReceived}
                            >
                                <div
                                    onClick={this.toggleDropdown}
                                    className="absolute top-0 right-0 p-5 text-gray-600 cursor-pointer hover:text-gray-800"
                                >
                                    <FontAwesomeIcon
                                        className="mr-2"
                                        icon={faEllipsisV}
                                    />
                                </div>
                                {this.state.dropdown ? (
                                    <PopUpDetailDropdown
                                        type={this.state.dataObject.Type}
                                        toggleDropdown={this.toggleDropdown}
                                        deleteItem={this.deleteItem}
                                    />
                                ) : null}
                            </ContainerDetailMain>
                        </div>

                        {dataReceived &&
                        this.state.dataObject[0] &&
                        (this.state.dataObject[0].Opdrachtgever !== undefined ||
                            this.state.dataObject[0].Eigenaar_1 !== undefined ||
                            this.state.dataObject[0].Eigenaar_2 !== undefined ||
                            this.state.dataObject[0].Portefeuillehouder_1 !==
                                undefined ||
                            this.state.dataObject[0].Portefeuillehouder_2 !==
                                undefined) ? (
                            <EigenaarsDriehoek
                                dataObject={this.state.dataObject[0]}
                            />
                        ) : null}
                    </div>
                </div>
            </ContainerMain>
        )
    }
}

export default withRouter(MuteerVerordeningenDetail)
