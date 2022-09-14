import { LightningElement, wire, track, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import fetchFiles from '@salesforce/apex/Fileuploadcttrl.fetchFiles';

export default class CommunityComplianceCard extends NavigationMixin(LightningElement) {
    @api candidateticket;
    @track lstAllFiles;
    @track error;
    @track docConfirmed;
    @track isPersonal;

    get acceptedFormats() {
        return ['.pdf','.png','.jpg'];
    }

    handleUploadFinished(event) {
        this.connectedCallback();
    }

    connectedCallback() {
        this.candidateticket.Onboarding_Requirement__r.Onboarding_Requirement_Type__c == 'Personalstammblatt' ? this.isPersonal = true : this.isPersonal = false;
        if(this.candidateticket.Onboarding_Requirement_Status__c == 'Accepted') {
            this.docConfirmed = true;
        }
        fetchFiles({recordId: this.candidateticket.Id})
        .then(result=>{
            this.lstAllFiles = result;
            if(result && result.length > 0) {
                this.docConfirmed = true;
            }
            this.error = undefined;
        }).catch(error=>{
            this.lstAllFiles = undefined; 
            this.error = error;
        })
    }

    submit() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'document_form__c'
            },
        });
    }
}