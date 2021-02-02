import React from 'react'
import Select from 'react-select'

// Import Components
import LoaderSelect from './../LoaderSelect'

/**
 * Function to filter through the objectenArray and return the options.
 *
 * @function
 *
 * @param {array} objectenArray - Array of the user.
 * @param {string} dataObjectProperty - Parameter used for the name variable used for the options target.
 */
function makeSelection(objectenArray, dataObjectProperty) {
    if (objectenArray.length === 0) {
        return []
    } else {
        let options = []
        objectenArray.forEach((arrayItem) => {
            options.push({
                label: arrayItem.Gebruikersnaam,
                value: arrayItem.UUID,
                target: {
                    type: 'relatie',
                    value: arrayItem.UUID,
                    name: dataObjectProperty,
                },
            })
        })
        return options
    }
}

/**
 * Class that renders the FormFieldSelectUser.
 *
 * @class
 * @extends React.Component
 */
class FormFieldSelectUser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectionArray: [],
            selected: null,
            dataLoaded: false,
        }
    }
    /**
     * Function to update the prevProps and set the state variables.
     *
     * @function
     *
     * @param {props} prevProps - Parameter that is used to show the previous property value.
     * @param {props} prevState - Parameter that is used to show the previous state value.
     * @param {jest} snapshot - Jest parameter that is used for testing.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.fieldValue !== prevProps.fieldValue) {
            const selected = this.state.selectionArray.find(
                (arrayItem) => arrayItem.value === this.props.fieldValue
            )
            this.setState({
                selected: selected,
                dataLoaded: true,
            })
        }
    }

    /**
     * Function to set the state based on certain variables.
     *
     * @function
     */
    componentDidMount() {
        const objecten = this.props.gebruikersLijst
            .sort((a, b) => (a.Gebruikersnaam > b.Gebruikersnaam ? 1 : -1))
            .filter((e) => e.Rol === this.props.filter)

        const selectionArray = makeSelection(
            objecten,
            this.props.dataObjectProperty
        )

        if (
            this.props.editStatus === true ||
            (this.props.titleSingular === 'Beleidskeuze' &&
                this.props.dataObjectProperty === 'Eigenaar_1' &&
                selectionArray)
        ) {
            const selected = selectionArray.find(
                (arrayItem) => arrayItem.value === this.props.fieldValue
            )

            this.setState({
                selectionArray: selectionArray,
                selected: selected,
                dataLoaded: true,
            })
        } else {
            this.setState({ selectionArray: selectionArray, dataLoaded: true })
        }
    }

    render() {
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

        return (
            <div
                className={`mb-6 ${this.props.marginRight ? 'mr-8' : null} ${
                    this.props.halfWidth ? 'w-full mr-4' : 'w-1/2'
                }`}
            >
                <p className="form-field-description">{`${this.props.pValue}`}</p>
                {this.state.dataLoaded ? (
                    <Select
                        isDisabled={this.props.disabled}
                        id={`form-field-${this.props.titleSingular.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        className="border border-gray-400 rounded hover:border-gray-500 focus:border-gray-500"
                        name={this.props.dataObjectProperty}
                        value={this.state.selected}
                        onChange={(e, metaInfo) =>
                            this.props.handleChange(
                                e,
                                metaInfo,
                                this.props.dataObjectProperty
                            )
                        }
                        styles={customStyles}
                        isClearable={true}
                        options={
                            this.props.filterOtherProperty
                                ? this.state.selectionArray.filter(
                                      (e) =>
                                          e.value !==
                                          this.props.filterOtherProperty
                                  )
                                : this.state.selectionArray
                        }
                        placeholder={`Selecteer...`}
                    ></Select>
                ) : (
                    <LoaderSelect />
                )}
            </div>
        )
    }
}
export default FormFieldSelectUser
