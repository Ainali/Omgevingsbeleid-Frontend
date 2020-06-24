import React from 'react'
import Select from 'react-select'

const SelectField = ({
    users,
    label,
    property,
    filter,
    setVerordeningsObjectFromGET,
    verordeningsObjectFromGET,
    selected,
}) => {
    const selectedUserUUID = verordeningsObjectFromGET[property]
    const selectedUserObj = users
        .filter((e) => e.Rol !== 'Geen')
        .find((e) => e.UUID === selectedUserUUID)
    const selectedUserUsername = selectedUserObj
        ? selectedUserObj.Gebruikersnaam
        : ''

    return (
        <div className="mb-4">
            <label
                htmlFor="Opdrachtgever"
                className="block text-sm font-medium leading-5 text-gray-700"
            >
                {label}
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
                <Select
                    id="Opdrachtgever"
                    className="border border-gray-400 rounded hover:border-gray-500 focus:border-gray-500"
                    name="Opdrachtgever"
                    value={
                        selectedUserUsername
                            ? {
                                  label: selectedUserUsername,
                                  value: selectedUserUUID,
                                  target: {
                                      value: selectedUserUUID,
                                      name: property,
                                  },
                              }
                            : null
                    }
                    selected={selectedUserUUID}
                    onChange={(e, actionMeta) =>
                        setVerordeningsObjectFromGET({
                            type: 'changeSelectValue',
                            e: e,
                            actionMeta: actionMeta,
                            property: property,
                        })
                    }
                    styles={customStyles}
                    isClearable={true}
                    options={users
                        .filter((user) => user.Rol === filter)
                        .map((user) => {
                            return {
                                label: user.Gebruikersnaam,
                                value: user.UUID,
                                target: {
                                    value: user.UUID,
                                    name: property,
                                },
                            }
                        })}
                    placeholder={`Selecteer...`}
                />
            </div>
        </div>
    )
}

const customStyles = {
    control: (base, state) => ({
        ...base,
        borderColor: 'none',
        borderWidth: '0px',
        '&:hover': {
            borderColor: 'none',
            borderWidth: '0px',
            boxShadow: 'none',
        },
        '&.is-focused': {
            borderColor: 'none',
            borderWidth: '0px',
            boxShadow: 'none',
        },
    }),
}

export default SelectField
