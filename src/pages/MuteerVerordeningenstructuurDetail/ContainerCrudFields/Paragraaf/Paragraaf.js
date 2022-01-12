/* istanbul ignore file */
import { useContext } from 'react'

// Import Context
import ButtonSubmitFixed from './../../../../components/ButtonSubmitFixed'
import ContainerFormSection from './../../../../components/ContainerFormSection'
import ContainerMain from './../../../../components/ContainerMain'
import {
    FormFieldTextInput,
    FormFieldGeldigheid,
} from './../../../../components/FormFieldsExport'
import APIcontext from './../../../MuteerBeleidsrelatiesCRUD/APIContext'

// Import Components

// Import Form Fields

function Paragraaf() {
    const context = useContext(APIcontext)

    const crudObject = context.crudObject
    const titleSingular = context.titleSingular

    return (
        <>
            <ContainerMain>
                <div className="flex-grow inline-block w-full">
                    <form className="mt-12" onSubmit={context.handleSubmit}>
                        <ContainerFormSection
                            titel="Algemene informatie"
                            beschrijving="De algemene informatie bevat een paragraafnummer en een duidelijke titel"
                        >
                            <FormFieldTextInput
                                handleChange={context.handleChange}
                                fieldValue={crudObject['Volgnummer']}
                                fieldLabel="Paragraaf"
                                dataObjectProperty="Volgnummer"
                                pValue="Nummer"
                                titleSingular={titleSingular}
                            />
                            <FormFieldTextInput
                                handleChange={context.handleChange}
                                fieldValue={crudObject['Titel']}
                                fieldLabel="Titel"
                                dataObjectProperty="Titel"
                                pValue="Beschrijf in een aantal woorden de titel van deze paragraaf"
                                titleSingular={titleSingular}
                            />
                        </ContainerFormSection>

                        <ContainerFormSection
                            titel="Aanvullende informatie"
                            beschrijving="Aanvullende informatie."
                        >
                            {/* Geldigheid */}
                            <div className="flex flex-wrap -mx-3">
                                {/* Begin Geldigheid */}
                                <FormFieldGeldigheid
                                    handleChange={context.handleChange}
                                    fieldValue={crudObject['Begin_Geldigheid']}
                                    fieldLabel="Datum inwerkingtreding"
                                    notRequired={true}
                                    dataObjectProperty="Begin_Geldigheid"
                                    pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                    titleSingular={titleSingular}
                                />

                                {/* Eind Geldigheid */}

                                <FormFieldGeldigheid
                                    handleChange={context.handleChange}
                                    notRequired={true}
                                    fieldValue={crudObject['Eind_Geldigheid']}
                                    fieldLabel="Datum uitwerkingtreding"
                                    dataObjectProperty="Eind_Geldigheid"
                                    pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                    titleSingular={titleSingular}
                                />
                            </div>
                        </ContainerFormSection>

                        {/* Submit */}
                        <ButtonSubmitFixed saving={context.saving} />
                    </form>
                </div>
            </ContainerMain>
        </>
    )
}

Paragraaf.contextType = APIcontext

export default Paragraaf
