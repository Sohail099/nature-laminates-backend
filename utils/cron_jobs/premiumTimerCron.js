const cron = require('node-cron');
const EventEmitter = require('events');
const event = new EventEmitter();
const listingModel= require("../../models/listingsModel")

//listing premium trial period cron job
module.exports.setPremiumTrialTimer= async (key)=>{
    const task = cron.schedule('5 * * * * *', async () => {
        // console.log('Running a task every minute');
        doSomething();
        event.emit('JOB COMPLETED');
    });
    event.on('JOB COMPLETED', () => {
        // console.log('Job done!');
        listingModel.deactivateListingPremiumTrial(key);
        task.stop();
    });
}