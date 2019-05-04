const isIp = require('is-ip');
const fs = require('fs');
const ip2GeoReader = require('@maxmind/geoip2-node').Reader;

const ip2geoDataPath = './data/GeoLite2-City.mmdb';
const Config = require('../config/Config.json');

async function ip2geo(req,res){
    res.header("Content-type", "application/json");
    var redis = null;
    let IP = (typeof req.params.ip === 'undefined') ? '' : req.params.ip;
    var Result = {
        status: 500
    }

    if (!isIp(IP)){
        Result.status = 404;
        Result.msg = 'Invalid IP';
        return res.json(Result);
    }

    // check from redis cache
    if (Config.redis.enable){
        redis = require('../utils/redis');

        var ipDataCache = await redis.GetKey('ip2geo/'+IP);
        if (ipDataCache !== null){
            ipDataCache = JSON.parse(ipDataCache);
            ipDataCache.cached = true;

            Result.status = 200;
            Result.data = ipDataCache;
            return res.json(Result);
        }
    }

    // Check IP
    var ipData = {
        ip: IP,
        city: '',
        country: {
            isoCode: '',
            name: ''
        },
        continent: '',
    }

    try {
        if (fs.existsSync(ip2geoDataPath)) {

            const dbBuffer = fs.readFileSync(ip2geoDataPath);
            const ip2GeoData = ip2GeoReader.openBuffer(dbBuffer);
            const response = ip2GeoData.city(IP);
        
            ipData = {
                ip: IP,
                city: '',
                country: {
                    isoCode: response.country.isoCode,
                    name: (response.country.names !== undefined) ? response.country.names.en : ''
                },
                continent: (response.continent.names.en !== undefined) ? response.continent.names.en : '',
                traits: response.traits
            }
            try{
                ipData.city = (response.city.names.en !== undefined) ? response.city.names.en : '';
            }catch(err){
            }

            if (Config.redis.enable){
                try{
                    redis.SetKey('ip2geo/'+IP, 3600*24, JSON.stringify(ipData));
                    ipData.save = true;
                }catch(err){
                }
            }
        
            Result.status = 200;
            Result.data = ipData;
            
        }else{
            Result.msg = 'IP-GEO Data not found';
        }
    }catch(err){
        Result.msg = 'IP-GEO failed: ' + err;
        Result.data = ipData;
    }
    
    return res.json(Result);
    
}

module.exports = {
    ip2geo
}

