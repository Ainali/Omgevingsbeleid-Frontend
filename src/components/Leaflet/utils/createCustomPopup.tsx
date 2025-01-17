import { Button } from '@pzh-ui/components'
import { LatLng, Map, Point } from 'leaflet'
import Proj from 'proj4leaflet'
import ReactDOMServer from 'react-dom/server'
import { toast } from 'react-toastify'

import { getWerkingsGebiedenByArea } from '@/api/axiosGeoJSON'
import { LoaderSpinner } from '@/components/Loader'
import { RDProj4, leafletBounds, MAP_SEARCH_PAGE } from '@/constants/leaflet'

// @ts-ignore
const RDProjection = new Proj.Projection('EPSG:28992', RDProj4, leafletBounds)

/**
 * Function that creates a custom popup with the parameters lat, lng and layer.
 */
const createCustomPopup = async (
    map: Map,
    navigate: any,
    lat: number,
    lng: number,
    layer: any,
    type: 'marker' | 'polygon',
    callback?: (callback: any) => void,
    locationName?: string
) => {
    const isAdvancedSearch = window.location.pathname === MAP_SEARCH_PAGE
    const path = isAdvancedSearch ? MAP_SEARCH_PAGE : '/zoekresultaten'

    const point = RDProjection.project({ lat, lng })
    const searchParams = new URLSearchParams(window.location.search)
    const searchOpen = searchParams.get('searchOpen')

    const popupLoading = `
        <div class="flex">
            ${ReactDOMServer.renderToString(<LoaderSpinner />)}
            <span class="ml-2">${
                type === 'marker' ? 'Adres' : 'Gebied'
            } aan het laden...</span>
        </div>
    `

    const popup = layer.bindPopup(popupLoading, {
        minWidth: 320,
    })

    if (searchOpen !== 'true') {
        popup.openPopup()
    }

    if (type === 'marker') {
        const customPopupHTML = `<div>${ReactDOMServer.renderToString(
            <CreateCustomPopup
                type="marker"
                lat={lat}
                lng={lng}
                geoQuery={`${point.x.toFixed(2)}+${point.y.toFixed(2)}`}
                weergavenaam={locationName}
            />
        )}</div>`
        layer._popup.setContent(customPopupHTML)

        if (isAdvancedSearch) {
            searchParams.set(
                'geoQuery',
                `${point.x.toFixed(2)}+${point.y.toFixed(2)}`
            )
            navigate(`${MAP_SEARCH_PAGE}?${searchParams}`, { replace: true })
        }

        callback?.({
            point: { x: point.x.toFixed(2), y: point.y.toFixed(2) },
            type: 'marker',
        })
    } else if (type === 'polygon') {
        const points = layer._latlngs
            .flat(2)
            .map(({ lat, lng }: LatLng) => RDProjection.project({ lat, lng }))
        const pointsArray = [...points, points[0]]

        const geoQuery = pointsArray
            .map((part: Point) =>
                [part.x.toFixed(2), part.y.toFixed(2)].join('+')
            )
            .join(',')

        await getWerkingsGebiedenByArea(pointsArray)
            .then(data => {
                const customPopupHTML = `<div>${ReactDOMServer.renderToString(
                    <CreateCustomPopup
                        type="polygon"
                        lat={lat}
                        lng={lng}
                        geoQuery={geoQuery}
                    />
                )}</div>`
                layer._popup.setContent(customPopupHTML)

                if (isAdvancedSearch) {
                    searchParams.set('geoQuery', geoQuery)
                    navigate(`${MAP_SEARCH_PAGE}?${searchParams}`, {
                        replace: true,
                    })
                }

                callback?.({
                    ...data,
                    type: 'polygon',
                })
            })
            .catch(function (err) {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                callback?.(err)
            })
    }

    if (searchOpen !== 'true') {
        handlePopupEvents(
            map,
            layer,
            navigate,
            searchParams,
            isAdvancedSearch ? path : undefined
        )

        map.on('popupopen', () =>
            handlePopupEvents(
                map,
                layer,
                navigate,
                searchParams,
                isAdvancedSearch ? path : undefined
            )
        )
    }
}

const handlePopupEvents = (
    map: Map,
    layer: any,
    navigate: any,
    searchParams: URLSearchParams,
    path?: string
) => {
    const popupContainer = layer.getPopup().getElement()

    popupContainer
        .querySelector('.leaflet-close-popup')
        ?.addEventListener('click', () => {
            map.fireEvent('draw:deleted')
            map.removeLayer(layer)
            path && navigate(path, { replace: true })
        })

    popupContainer
        .querySelector('.advanced-search-button')
        ?.addEventListener('click', () => {
            searchParams.append('searchOpen', 'true')
            navigate(`${path}?${searchParams}`, { replace: true })
        })
}

interface CreateCustomPopupProps {
    type: 'marker' | 'polygon'
    weergavenaam?: string
    areaName?: string
    lat?: number
    lng?: number
    geoQuery?: string
}

export const CreateCustomPopup = ({
    type,
    weergavenaam,
    areaName,
    lat,
    lng,
    geoQuery = '',
}: CreateCustomPopupProps) => {
    const isAdvancedSearch = window.location.pathname === MAP_SEARCH_PAGE

    const searchParams = new URLSearchParams({
        geoQuery,
    })

    return (
        <div className="text-base custom-popup">
            <span className="block bold">Locatie</span>
            <ul className="mt-2 mb-4">
                {weergavenaam && <li>{weergavenaam}</li>}
                {type === 'marker' && lat && lng && (
                    <li>
                        GPS Locatie:
                        <br />
                        {lat.toFixed(7)}, {lng.toFixed(7)}
                    </li>
                )}
                {type === 'polygon' && (
                    <li>{areaName || 'Getekend gebied.'}</li>
                )}
            </ul>
            <div className="flex justify-between">
                {isAdvancedSearch ? (
                    <Button className="advanced-search-button">
                        Bekijk beleid
                    </Button>
                ) : (
                    <a
                        href={`${MAP_SEARCH_PAGE}?${searchParams}&searchOpen=true`}>
                        <Button>Bekijk beleid</Button>
                    </a>
                )}
                <button className="text-xs underline leaflet-close-popup text-pzh-red">
                    {type === 'marker' ? 'Pin' : 'Gebied'} verwijderen
                </button>
            </div>
        </div>
    )
}

export default createCustomPopup
