import { LatLng, Map, Point } from 'leaflet'
import Proj from 'proj4leaflet'
import ReactDOMServer from 'react-dom/server'
import { toast } from 'react-toastify'

import { getWerkingsGebiedenByArea } from '@/api/axiosGeoJSON'
import { getAddressData } from '@/api/axiosLocatieserver'
import { RDProj4, leafletBounds, MAP_SEARCH_PAGE } from '@/constants/leaflet'

// @ts-ignore
const RDProjection = new Proj.Projection('EPSG:28992', RDProj4, leafletBounds)

/**
 * Function that creates a custom popup with the parameters lat, lng and layer.
 */
const createCustomPopup = async (
    map: Map,
    history: any,
    lat: number,
    lng: number,
    layer: any,
    type: 'marker' | 'polygon',
    callback?: (callback: any) => void
) => {
    const isAdvancedSearch = window.location.pathname === MAP_SEARCH_PAGE
    const path = isAdvancedSearch ? MAP_SEARCH_PAGE : '/zoekresultaten'

    const point = RDProjection.project({ lat, lng })
    const searchParams = new URLSearchParams(window.location.search)
    const searchOpen = searchParams.get('searchOpen')

    const popup = layer.bindPopup(
        `${type === 'marker' ? 'Adres' : 'Gebied'} aan het laden...`,
        {
            minWidth: 320,
        }
    )

    if (searchOpen !== 'true') {
        popup.openPopup()
    }

    if (type === 'marker') {
        await getAddressData(lat.toString(), lng.toString())
            .then(data => {
                const customPopupHTML = `<div>${ReactDOMServer.renderToString(
                    <CreateCustomPopup
                        type="marker"
                        weergavenaam={data.weergavenaam}
                        lat={lat}
                        lng={lng}
                        geoQuery={`${point.x.toFixed(2)}+${point.y.toFixed(2)}`}
                    />
                )}</div>`
                layer._popup.setContent(customPopupHTML)

                if (isAdvancedSearch) {
                    searchParams.set(
                        'geoQuery',
                        `${point.x.toFixed(2)}+${point.y.toFixed(2)}`
                    )
                    history.push(`${MAP_SEARCH_PAGE}?${searchParams}`)
                }

                callback?.({
                    ...data,
                    point: { x: point.x.toFixed(2), y: point.y.toFixed(2) },
                })
            })
            .catch(function (err) {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                callback?.(err)
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
                    history.push(`${MAP_SEARCH_PAGE}?${searchParams}`)
                }

                callback?.(data)
            })
            .catch(function (err) {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                callback?.(err)
            })
    }

    if (searchOpen !== 'true') {
        const popupContainer = layer.getPopup().getElement()

        popupContainer
            .querySelector('.leaflet-close-popup')
            ?.addEventListener('click', () => {
                map.removeLayer(layer)
                history.push(path)
            })

        popupContainer
            .querySelector('.advanced-search-button')
            ?.addEventListener('click', () => {
                searchParams.append('searchOpen', 'true')
                history.push(`${path}?${searchParams}`)
            })
    }
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
        <div className="text-sm custom-popup">
            <span className="block font-bold">Locatie</span>
            <ul className="mt-1 mb-4 text-xs">
                {weergavenaam && (
                    <>
                        <li>{weergavenaam.split(',')[0]}</li>
                        <li>{weergavenaam.split(',')[1]}</li>
                    </>
                )}
                {type === 'marker' && lat && lng && (
                    <li>
                        GPS Locatie: {lat.toFixed(7)}, {lng.toFixed(7)}
                    </li>
                )}
                {type === 'polygon' && (
                    <li>{areaName || 'Getekend gebied.'}</li>
                )}
            </ul>
            <div className="flex justify-between">
                {isAdvancedSearch ? (
                    <button className="advanced-search-button inline-block py-2 px-4 text-white rounded cursor-pointer bg-pzh-blue hover:bg-blue-600 focus:outline-none focus:ring">
                        Bekijk beleid
                    </button>
                ) : (
                    <a
                        href={`/zoekresultaten?${searchParams}`}
                        className="inline-block py-2 px-4 text-white rounded cursor-pointer bg-pzh-blue hover:bg-blue-600 focus:outline-none focus:ring">
                        Bekijk beleid
                    </a>
                )}
                <button className="leaflet-close-popup underline text-pzh-red text-sm">
                    {type === 'marker' ? 'Pin' : 'Gebied'} verwijderen
                </button>
            </div>
        </div>
    )
}

export default createCustomPopup
