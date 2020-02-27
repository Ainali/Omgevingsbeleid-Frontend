import React from 'react'

// Import Context
import APIcontext from './../../APIContext'

// Import Components
import ContainerMain from './../../../../components/ContainerMain'
import ContainerFormSection from './../../../../components/ContainerFormSection'

// Import Form Fields
import FormFieldTextInput from './../../../../components/FormFieldTextInput'
import FormFieldTextArea from './../../../../components/FormFieldTextArea'
import FormFieldNumberInput from './../../../../components/FormFieldNumberInput'
import FormFieldSelectUserGroup from './../../../../components/FormFieldSelectUserGroup'
import FormFieldWerkingsgebiedKoppeling from './../../../../components/FormFieldWerkingsgebiedKoppeling'
import FormFieldDate from './../../../../components/FormFieldDate'
import FormFieldWeblink from './../../../../components/FormFieldWeblink'

class Artikel extends React.Component {
    render() {
        const crudObject = this.context.crudObject
        const titelEnkelvoud = this.context.titelEnkelvoud

        return (
            <React.Fragment>
                <ContainerMain>
                    <div className="w-full inline-block flex-grow">
                        <form
                            className="mt-12"
                            onSubmit={this.context.handleSubmit}
                        >
                            <ContainerFormSection
                                titel="Algemene informatie"
                                beschrijving="De algemene informatie bevat een artikelnummer, een duidelijke titel en de betrokken personen"
                            >
                                <FormFieldTextInput
                                    handleChange={this.context.handleChange}
                                    fieldValue={crudObject['Volgnummer']}
                                    fieldLabel="Artikelnummer"
                                    dataObjectProperty="Volgnummer"
                                    pValue="Artikelnummer"
                                    titelEnkelvoud={titelEnkelvoud}
                                />
                                <FormFieldTextInput
                                    handleChange={this.context.handleChange}
                                    fieldValue={crudObject['Titel']}
                                    fieldLabel="Titel"
                                    dataObjectProperty="Titel"
                                    pValue="Vul hier uw titel in"
                                    titelEnkelvoud={titelEnkelvoud}
                                />
                                <FormFieldSelectUserGroup
                                    handleChange={this.context.handleChange}
                                    crudObject={crudObject}
                                    marginRight={true}
                                    fieldLabel="Personen"
                                    titelEnkelvoud={titelEnkelvoud}
                                    editStatus={this.context.editStatus}
                                />
                            </ContainerFormSection>

                            <ContainerFormSection
                                titel="Inhoud artikel"
                                beschrijving="De inhoud van het artikel moet zelfstandig leesbaar zijn"
                            >
                                <FormFieldTextArea
                                    handleChange={this.context.handleChange}
                                    fieldValue={crudObject['Inhoud']}
                                    fieldLabel="Artikel"
                                    pValue={false}
                                    dataObjectProperty="Inhoud"
                                    titelEnkelvoud={titelEnkelvoud}
                                />
                            </ContainerFormSection>

                            <ContainerFormSection
                                titel="Werkingsgebied"
                                beschrijving="Het werkingsgebied geeft het gebied weer waarin dit artikel werking heeft.
                                
                                Heeft jouw artikel nog geen geschikt werkingsgebied, ontwikkel er dan een met iemand van team GEO (teamgeo@pzh.nl)."
                            >
                                <FormFieldWerkingsgebiedKoppeling
                                    handleChange={this.context.handleChange}
                                    titelEnkelvoud={titelEnkelvoud}
                                    fieldValue={crudObject['Werkingsgebied']}
                                    fieldLabel="Selecteer werkingsgebied"
                                    dataObjectProperty="Werkingsgebied"
                                    pValue="Selecteer hier het werkingsgebied wat bij deze beleidsbeslissing past."
                                />
                            </ContainerFormSection>

                            <ContainerFormSection
                                titel="Aanvullende informatie"
                                beschrijving="Het werkingsgebied geeft het gebied weer waarin dit artikel werking heeft. /n Heeft jouw artikel nog geen geschikt werkingsgebied, ontwikkel er dan een met iemand van team GEO (teamgeo@pzh.nl)."
                            >
                                <FormFieldWeblink
                                    handleChange={this.context.handleChange}
                                    fieldValue={crudObject['Weblink']}
                                    dataObjectProperty="Weblink"
                                    fieldLabel="IDMS"
                                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                    titelEnkelvoud={titelEnkelvoud}
                                />

                                {/* Geldigheid */}
                                <div className="flex flex-wrap -mx-3">
                                    {/* Begin Geldigheid */}
                                    <FormFieldDate
                                        handleChange={this.context.handleChange}
                                        fieldValue={
                                            crudObject['Begin_Geldigheid']
                                        }
                                        fieldLabel="Datum inwerkingtreding"
                                        notRequired={true}
                                        dataObjectProperty="Begin_Geldigheid"
                                        pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                        titelEnkelvoud={titelEnkelvoud}
                                    />

                                    {/* Eind Geldigheid */}

                                    <FormFieldDate
                                        handleChange={this.context.handleChange}
                                        notRequired={true}
                                        fieldValue={
                                            crudObject['Eind_Geldigheid']
                                        }
                                        fieldLabel="Datum uitwerkingtreding"
                                        dataObjectProperty="Eind_Geldigheid"
                                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                        titelEnkelvoud={titelEnkelvoud}
                                    />
                                </div>
                            </ContainerFormSection>

                            {/* Submit */}
                            <div className="fixed bottom-0 right-0 px-6">
                                <div className="bg-white shadow px-4 py-4 inline-block rounded-t">
                                    <input
                                        id="form-submit"
                                        className="font-bold py-2 px-4 leading-tight text-sm rounded mbg-color text-white hover:underline"
                                        type="submit"
                                        value="Opslaan"
                                    ></input>
                                </div>
                            </div>
                        </form>
                    </div>
                </ContainerMain>
            </React.Fragment>
        )
    }
}

Artikel.contextType = APIcontext

export default Artikel
