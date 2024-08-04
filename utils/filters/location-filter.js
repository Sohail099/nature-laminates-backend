const logger = require('../other/logger');
const fileName = 'locationFilter.js';
const dbUtil= require("../db_related/dbUtil");


// SELECT *, point((a.map->>'longitude')::float, (a.map->>'latitude')::float) <@>  (point(75.823688, 22.710273)::point) as distance
// FROM "Addresses" as a
// -- WHERE (point(75.820416, 22.705631) <@> point(75.823688, 22.710273)) < 3
// ORDER BY distance
// LIMIT 5;

// select *, point((a.map->>'longitude')::float, (a.map->>'latitude')::float) as point from "Addresses" as a



// SELECT ad."key" as address_key, b."name" as block_name, b.name_arabic as block_name_ar, area."name" as area_name, area.name_arabic as area_arabic,
// street."name" as street_name, street.name_arabic as street_name_ar, lane."name" as lane_name, lane.name_arabic as lane_name_ar, country."name" as Country, country.name_arabic as Country_ar,
// ad.listing_id as listing_id_address, l."key" as listing_id, l."name" as listing_name, l.name_ar as listing_name_ar, point((ad.map->>'longitude')::float, (ad.map->>'latitude')::float) <@>  (point(75.823688, 22.710273)::point) as distance
// FROM "Addresses" as ad, "Listings" as l, "Blocks" as b, "Areas" as area, "Streets" as street,
// "Lanes" as lane, "Countries" as country
// WHERE ad.listing_id = l."key" AND ad.block_id= b."key" AND ad."area_id"= area."key" AND ad.street_id= street."key" AND ad.lane_id= lane."key" OR ad.country_id= country."key"
// -- WHERE (point(75.820416, 22.705631) <@> point(75.823688, 22.710273)) < 3
// ORDER BY distance
// LIMIT 10;
module.exports.locationFilter= async(req, res)=>{
    logger.info(`${fileName} locationFilter() called...`);
    try{
        // let long= 75.823688;
        // let lat= 22.710273;
        let sql= `select ad.listing_id, ad.key, 
            json_agg(DISTINCT jsonb_build_object('listing Name',l.key)) as Listings,
            json_agg(DISTINCT jsonb_build_object('area_name', area.name, 'id', area."key")) as Area,
            json_agg(DISTINCT jsonb_build_object('block_name', block."name"))as Block,
            json_agg(DISTINCT jsonb_build_object('street name', street."name"))as Street,
            json_agg(DISTINCT jsonb_build_object('Country', country."name")) as Country,
            json_agg(DISTINCT jsonb_build_object('key', m."key")) as Menu,
            json_agg(DISTINCT jsonb_build_object('dish_id', d."key",'dish Name',d."name", 'key', d.menu_id)) as Dishes,
            json_agg(Distinct jsonb_build_object('gallery_dId', g.dish_id, 'image', g.url))as Galleries `;
        if(req.body.long!=null && req.body.long== " " && req.body.lat==" " && req.body.lat!=null){
            sql+=`,json_agg(DISTINCT jsonb_build_object('Points', point((ad.map->>'longitude')::float, (ad.map->>'latitude')::float) <@>  (point(${req.body.long}, ${req.body.lat})::point))) as distance `;
        }
        sql+=`from "Addresses" as ad
            left join "Listings" as l ON ad.listing_id= l."key"  
            left join "Areas" as area ON ad.area_id= area."key"
            left join "Blocks" as block ON ad.block_id= block."key"
            left join "Streets" as street ON ad.street_id= street."key"
            left join "Countries" as country ON ad.country_id= country."key"
            left join "Menus" as m ON m.listing_id= l."key"
            left join "Items" as d ON d.menu_id= m."key"
            left join "Gallery" as g ON d."key"= g.dish_id
            GROUP by ad.listing_id, ad.key
            LIMIT 10;`
        let values= [];
        let result = await dbUtil.sqlToDB(sql,values);
        // console.log(result.rows);
        return res.status(200).json({
            result: result.rows
        })

    }catch(error){
        logger.error(`${fileName} locationFilter() ${error.message}`);
        throw new Error(error.message);    
    }
}