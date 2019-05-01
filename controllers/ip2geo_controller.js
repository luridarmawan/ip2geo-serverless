const isIp = require('is-ip');
const fs = require('fs');
const ip2GeoReader = require('@maxmind/geoip2-node').Reader;

const ip2geoDataPath = './data/GeoLite2-City.mmdb';

function ip2geo(req,res){
    let IP = (typeof req.params.ip === 'undefined') ? '' : req.params.ip;
    var Result = {
        status: 500
    }

    if (!isIp(IP)){
        Result.status = 404;
        Result.msg = 'Invalid IP';
        return res.json(Result);
    }

    try {
        if (fs.existsSync(ip2geoDataPath)) {

            const dbBuffer = fs.readFileSync(ip2geoDataPath);
            const ip2GeoData = ip2GeoReader.openBuffer(dbBuffer);
            const response = ip2GeoData.city(IP);
        
            const ipData = {
                ip: IP,
                city: '',
                country: {
                    isoCode: response.country.isoCode,
                    name: response.country.names.en
                },
                continent: (response.continent.names.en !== undefined) ? response.continent.names.en : '',
                traits: response.traits
            }
            try{
                ipData.city = (response.city.names.en !== undefined) ? response.city.names.en : '';
                console.log('ada')
            }catch(err){
                console.log(response.city)
            }
        
            Result.status = 200;
            Result.data = ipData;
            
        }else{
            Result.msg = 'IP-GEO Data not found';
        }
    }catch(err){
        Result.msg = 'failed: IP-GEO Data not found';
    }
    
    return res.json(Result);
    
}

module.exports = {
    ip2geo
}

