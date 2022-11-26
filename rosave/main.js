const extension = globalThis.chrome || globalThis.browser //chrome and firefox

extension.runtime.onInstalled.addListener(()=>{
    //extension.tabs.create({url:"https://www.roblox.com/home"})

    //create settings and amounts vars
    extension.storage.sync.get("amounts",function(val){
        val=val.amounts
        if (!val) {
            extension.storage.sync.set({"amounts":{
                total:0,
                classicClothing:0,
                layeredClothing:0,
                accessories:0,
                bundles:0,
                heads:0,
                faces:0,
                passes:0,
                plugins:0
            }})
        }
    })

    /*
    extension.storage.sync.get("placeid",function(val){
        val=val.placeid
        if (!val) {
            fetch("https://enderspearl184.github.io/RoSave/values.json").then(async(res)=>{
                extension.storage.sync.set({placeid:{id:(await res.json()).devDonateId}})
            })
        }
    })
    */

    //set the dev donate id, used when a place id is not specified.
    fetch("https://enderspearl184.github.io/RoSave/values.json").then(async(res)=>{
        extension.storage.local.set({devDonateId:(await res.json()).devDonateId})
    })
})
