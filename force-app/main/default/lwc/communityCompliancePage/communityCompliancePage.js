import { LightningElement, wire, track, api } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import TICKET_OBJECT from '@salesforce/schema/sirenum__Ticket__c';
import ONB_OBJECT from '@salesforce/schema/Candidate_Onboarding__c';
import STATUS_FIELD from '@salesforce/schema/sirenum__Ticket__c.SK_Status__c'
import ONB_STATUS_FIELD from '@salesforce/schema/Candidate_Onboarding__c.Onboarding_Requirement_Status__c';
// Apex Imports
import getCandidateData from '@salesforce/apex/getContactfieldsParam.getContacts';
import getCandidateTicketData from '@salesforce/apex/getCandidateTickets.getTickets';
import getCandidateOnboarding from '@salesforce/apex/getCandidateOnboardingCommunity.getONBDocs';
import getTasks from '@salesforce/apex/getCandidateTasks.getTasks';
import getEvents from '@salesforce/apex/getCandidateEvents.getEvents';

import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import CONTACT_ID from "@salesforce/schema/User.ContactId";
// this gets you the logged in user
import USER_ID from "@salesforce/user/Id";

export default class CommunityCompliancePage extends LightningElement {
    @api recordId;
    @api contactId;
    @api candidate;
    @api candidateId;
    @api candidateTickets;
    @api tasks;
    @api events;
    @api error;
    @api tasksAndEvents;
    @track docStatusValue = 'Initiated';
    @track statusPicklistValues;
    @track noDocData = false;

    @wire(getObjectInfo, { objectApiName: ONB_OBJECT })
    ticketMetadata;

    @wire(getRecord, { recordId: USER_ID, fields: [CONTACT_ID] })
    returnedUserData({data, error}) {
        if(data) {
            console.log(`Contact ID => `, data.fields.ContactId);
            this.contactId = data.fields.ContactId.value;
        }else if(error) {
            window.console.log(`Error ==> `, error);
        }
    }

    // get contactId() {
    //     return getFieldValue(this.user.data, CONTACT_ID);
    // }

    connectedCallback() {
        console.log(this.contactId);
    }

    @wire(getPicklistValues, {recordTypeId: '$ticketMetadata.data.defaultRecordTypeId', fieldApiName: ONB_STATUS_FIELD})
    returnedPicklistValues({data, error}) {
        if(data) {
            this.statusPicklistValues = data.values;
            console.log(`Picklist values returned: `, data);
        } else if (error) {
            console.log(`Picklist Errors ===> `, error);
        }
    };

    handleChange(event) {
        this.docStatusValue = event.detail.value;
    }

    @wire(getCandidateData, {recordId: '$recordId'})
    returnedCandidateData({data, error}) {
        if(data) {
            console.log(`Data returned from getCandidateData: `, data);
            let [_candidate] = data;
            this.candidate = _candidate;
            this.candidateId = this.candidate.Id
        } else if(error) {
            this.error = error;
            console.log(`getCandidateData Error ===> `, error);
        }
    }

    @wire(getCandidateOnboarding, {recordId: '$recordId', status: '$docStatusValue'})
    returnedCandidateTicketData({data, error}) {
        console.log(`I ran getCandidateOnboarding `, data);
        if(data && data.length > 0) {
            this.noDocData = false;
            console.log(`Data returned from getCandidateTicketData: `, data);
            this.candidateTickets = data;
        } else if(error) {
            console.log(`getCandidateTicketData Error ===> `, error);
        } else {
            this.noDocData = true;
            this.candidateTickets = false;
        }
    }

    @wire(getTasks, {recordId: '$recordId'})
    returnedTaskData({data, error}) {
        if(data) {
            console.log(`Data returned from getTasks: `, data);
            this.tasks = data;
            if(this.tasks && this.events) {
                this.doProcessing(this.events, this.tasks);
            }
        } else if(error) {
            console.log(`getCandidateTicketData Error ===> `, error);
        }
    }

    @wire(getEvents, {recordId: '$recordId'})
    returnedEventData({data, error}) {
        if(data) {
            console.log(`Data returned from getEvents: `, data);
            this.events = data;
            if(this.tasks && this.events) {
                this.doProcessing(this.events, this.tasks);
            }
        } else if(error) {
            console.log(`getCandidateTicketData Error ===> `, error);
        }
    }

    doProcessing(events, tasks) {
        if(events && tasks) {
            this.tasksAndEvents = events.concat(tasks)
            console.log(`Concatted result: `, events.concat(tasks));
        }
    }
}