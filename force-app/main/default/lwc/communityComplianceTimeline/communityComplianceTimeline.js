import { LightningElement, wire, track, api } from 'lwc';
import moment from '@salesforce/resourceUrl/Moment';
import { loadScript } from 'lightning/platformResourceLoader';

export default class CommunityComplianceTimeline extends LightningElement {
    @api taskAndEvent;


    renderedCallback(){
        Promise.all([
            loadScript(this, moment + '/moment.js')
        ]).then(() => {
            //Hey this works!
            //moment() prints out stuff here in the render callback!
            if(this.taskAndEvent) {
                console.log(`Formatted Date: `, moment(this.taskAndEvent.CompletedDateTime, "DD/MM/YYYY"));
            }
            debugger;
        })
        .catch(error => {
            debugger;
        });
    }

    connectedCallback() {

    }

}