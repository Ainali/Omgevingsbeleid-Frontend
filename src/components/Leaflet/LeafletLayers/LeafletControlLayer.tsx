import { faLayerGroup, faAngleRight } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'
import { ReactNode, useState } from 'react'
import { TileLayer, LayersControl, useMap } from 'react-leaflet'
import { useUpdateEffect } from 'react-use'

import ToggleableSection from '@/components/ToggleableSection'
import { tileURL, tileURLSattelite } from '@/constants/leaflet'

import LeafletController from '../LeafletController'

interface LeafletLayerProps {
    fullscreen?: boolean
    children?: ReactNode
}

const LeafletControlLayer = ({ fullscreen, children }: LeafletLayerProps) => {
    const map = useMap()

    const [layerControlOpen, setLayerControlOpen] = useState(false)
    const [activeMapTiles, setActiveMapTiles] = useState('Map')

    useUpdateEffect(() => {
        if (layerControlOpen) {
            map.scrollWheelZoom.disable()
        } else {
            map.scrollWheelZoom.enable()
        }
    }, [layerControlOpen])

    return (
        <>
            <LeafletController position="topright">
                <div id="leaflet-layers-control">
                    <div className="flex">
                        <div
                            className={`absolute top-0 right-0 p-2 w-8 h-8 flex justify-center items-center shadow-xl bg-white rounded ${
                                layerControlOpen ? 'hidden' : ''
                            }`}
                            style={
                                layerControlOpen
                                    ? undefined
                                    : {
                                          marginTop: '10px',
                                          marginRight: '10px',
                                          boxShadow:
                                              '0 1px 5px rgba(0,0,0,0.65)',
                                      }
                            }
                            onClick={() =>
                                setLayerControlOpen(!layerControlOpen)
                            }>
                            <FontAwesomeIcon
                                className="text-lg text-gray-700"
                                icon={
                                    layerControlOpen
                                        ? faAngleRight
                                        : faLayerGroup
                                }
                            />
                        </div>
                        <Transition
                            show={layerControlOpen}
                            enter="ease-out duration-300"
                            enterFrom="transform translate-x-64 opacity-0"
                            enterTo="transform translate-x-0 opacity-100"
                            leave="ease-in duration-300"
                            leaveFrom="transform translate-x-0 opacity-100"
                            leaveTo="transform translate-x-64 opacity-0">
                            <>
                                <button
                                    className="absolute top-0 left-0 flex items-center justify-center w-8 h-8 p-2 mr-8 text-gray-700 transform -translate-x-8 bg-gray-100 rounded-l opacity-100 hover:text-gray-800"
                                    onClick={() =>
                                        setLayerControlOpen(!layerControlOpen)
                                    }>
                                    <FontAwesomeIcon
                                        className="text-lg"
                                        icon={faAngleRight}
                                    />
                                </button>
                                <div
                                    className={`relative z-10 bg-white rounded cursor-pointer overflow-y-auto`}
                                    style={{
                                        width: '375px',
                                        maxWidth: '100%',
                                        height: fullscreen ? '1000px' : '500px',
                                    }}>
                                    <div className="w-full">
                                        {children}
                                        <ToggleableSection
                                            title="Achtergrondlaag"
                                            positionTop>
                                            <ul className="p-2">
                                                <li className="px-2 py-1 text-gray-700 cursor-pointer hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50">
                                                    <div>
                                                        <input
                                                            className="mr-2"
                                                            type="radio"
                                                            id="Satelliet"
                                                            name="drone"
                                                            value="Satelliet"
                                                            onChange={() =>
                                                                setActiveMapTiles(
                                                                    'Satelliet'
                                                                )
                                                            }
                                                            checked={
                                                                activeMapTiles ===
                                                                'Satelliet'
                                                            }
                                                        />
                                                        <label htmlFor="Satelliet">
                                                            Satelliet
                                                        </label>
                                                    </div>
                                                </li>
                                                <li className="px-2 py-1 text-gray-700 cursor-pointer hover:text-gray-800 focus:text-gray-900 hover:bg-gray-50">
                                                    <div>
                                                        <input
                                                            className="mr-2"
                                                            type="radio"
                                                            id="Map"
                                                            name="drone"
                                                            value="Map"
                                                            onChange={() =>
                                                                setActiveMapTiles(
                                                                    'Map'
                                                                )
                                                            }
                                                            checked={
                                                                activeMapTiles ===
                                                                'Map'
                                                            }
                                                        />
                                                        <label htmlFor="Map">
                                                            Map
                                                        </label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </ToggleableSection>
                                    </div>
                                </div>
                            </>
                        </Transition>
                    </div>
                </div>
            </LeafletController>
            <LayersControl position="topright">
                <LayersControl.BaseLayer
                    checked={activeMapTiles === 'Map'}
                    name="Map">
                    <TileLayer
                        url={tileURL}
                        minZoom={3}
                        attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer
                    checked={activeMapTiles === 'Satelliet'}
                    name="Satelliet">
                    <TileLayer
                        url={tileURLSattelite}
                        minZoom={3}
                        attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
        </>
    )
}

export default LeafletControlLayer
