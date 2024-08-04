const logger = require("../other/logger")
const listingModel = require("../../models/listingsModel");
const cronScheduler = require("node-cron");

const deactivateListingPremium = ()=>{
    logger.info("deactivateListingPremium() Called");
    cronScheduler.schedule('*/15 * * * *',()=>{
        let details = listingModel.deactivateListingPremium();
        if(details.rowCount>0)
        {
            for(let i=0;i<details.rowCount;i++)
            {
                let name = details.rows[i]["name"];
                let user_id = details.rows[i]["user_id"];
                let listing_id = details.rows[i]['key'];
                let message= `Premium period of your ${name} listing is over. Please subscribe again to have premium features.`;
                activityInformationController.storeActivityInformation(user_id, message, "Midlal Admin", listing_id, true);
            }
        }
    })
}

const deactivateListingPremiumTrial = ()=>{
    logger.info("deactivateListingPremiumTrial() Called");
    cronScheduler.schedule('*/20 * * * *',()=>{
        let details = listingModel.deactivateListingPremiumTrial()
        if(details.rowCount>0)
        {
            for(let i=0;i<details.rowCount;i++)
            {
                let name = details.rows[i]["name"];
                let user_id = details.rows[i]["user_id"];
                let listing_id = details.rows[i]['key'];
                let message= `One time premium trial period of your ${name} listing is over. Please subscribe to have premium features.`;
                activityInformationController.storeActivityInformation(user_id, message, "Midlal Admin", listing_id, true);
            }
        }
    })
}

module.exports = {
    deactivateListingPremium,
    deactivateListingPremiumTrial
}