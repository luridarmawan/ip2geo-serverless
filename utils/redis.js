const redis = require('redis')
const Config = require('../config/Config.json');

const redisOptions = {
    url: 'redis://'+Config.redis.username+':'+Config.redis.password+'@' + Config.redis.host
}

module.exports = {
    SetKey: (key, expiredTime, value) => {
        try{
            console.log(redisOptions.url)
            const clientRedis = redis.createClient(redisOptions)
            clientRedis.setex(key, expiredTime, value)
            clientRedis.quit();    
        }catch(err){
            console.log(err)
        }
    },

    // async process
    GetKey: (key) => {
        return new Promise((resolve, reject) => {
            try{
                const clientRedis = redis.createClient(redisOptions)
                clientRedis.get(key, (err, result) => {
                    clientRedis.quit();
                    if (err) {
                        reject(null)
                    }
                    if (result) {
                        resolve(result)
                    } else {
                        resolve(null)
                    }
                })    
            }catch(err){
                console.log(err)             
            }
        })
    },
}
