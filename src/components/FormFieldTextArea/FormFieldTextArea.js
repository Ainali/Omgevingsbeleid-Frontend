import React from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

class FormFieldTextArea extends React.Component {
    render() {
        return (
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <FormFieldTitelEnBeschrijving
                        dataObjectProperty={this.props.dataObjectProperty}
                        fieldLabel={this.props.fieldLabel}
                        pValue={this.props.pValue}
                        addObjectLabel={this.props.addObjectLabel}
                        titelEnkelvoud={this.props.titelEnkelvoud}
                    />
                    <textarea
                        id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        maxLength="15000"
                        value={this.props.fieldValue}
                        // required
                        onChange={this.props.handleChange}
                        name={this.props.dataObjectProperty}
                        className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white hover:border-gray-500 focus:border-gray-500 h-24"
                        type="text"
                        placeholder={
                            this.props.placeholderTekst
                                ? this.props.placeholderTekst
                                : `Typ hier uw ${this.props.fieldLabel.toLowerCase()}`
                        }
                    />
                </div>
            </div>
        )
    }
}

export default FormFieldTextArea
