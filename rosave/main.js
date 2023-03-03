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

async function init() {
    //add Roblox-Place-Id header, for Manifest V2 installations
    if (extension.runtime.getManifest()["manifest_version"]==2) {
        const filter = "https://economy.roblox.com/*" //webRequest url filter

        async function modifyHeaders(details) {
            let headers = details.requestHeaders
            if (details.method=="POST" && details.url.startsWith("https://economy.roblox.com/v1/purchases/products/")) {
                //get place id to use
                let placeid = await extension.storage.sync.get("placeid")
                //console.log(res)
                placeid=placeid.placeid
                if (!placeid) {
                    let val = await extension.storage.local.get("devDonateId")
                    placeid=val.devDonateId
                }
                headers.push({name:"Roblox-Place-Id",value:placeid.toString()})
            }
            return details
        }

        extension.webRequest.onBeforeSendHeaders.addListener(modifyHeaders, { urls: [filter] }, ['requestHeaders','blocking']);
    } else {
        //Manifest V3 specific code
        let placeid = await extension.storage.sync.get("placeid")
        //console.log(res)
        placeid=placeid.placeid
        if (!placeid) {
            let val = await extension.storage.local.get("devDonateId")
            placeid=val.devDonateId
        }

        extension.declarativeNetRequest.updateDynamicRules({
            addRules:[{
                action:{
                    type:"modifyHeaders",
                    requestHeaders:[
                        {
                            header:"Roblox-Place-Id",
                            operation:"set",
                            value:placeid.toString()
                        }
                    ]
                },
                condition:{
                    urlFilter:"|https://economy.roblox.com/v1/purchases/products/"
                },
                id:1,
                priority:1
            },{
                action:{
                    type:"modifyHeaders",
                    requestHeaders:[
                        {
                            header:"user-agent",
                            operation:"set",
                            value:"Roblox/WinUWP ROBLOX UWP App 1.0.0RobloxApp/2.564.444 (GlobalDist; RobloxDirectDownload)"
                        }
                    ]
                },
                condition:{
                    urlFilter:"|https://economy.roblox.com/v1/purchases/products/"
                },
                id:2,
                priority:2
            },{
                action:{
                    type:"modifyHeaders",
                    requestHeaders:[
                        {
                            header:"Requester",
                            operation:"set",
                            value:"Client"
                        }
                    ]
                },
                condition:{
                    urlFilter:"|https://economy.roblox.com/v1/purchases/products/"
                },
                id:3,
                priority:3
            },{
                action:{
                    type:"modifyHeaders",
                    requestHeaders:[
                        {
                            header:"PlayerCount",
                            operation:"set",
                            value:"1"
                        }
                    ]
                },
                condition:{
                    urlFilter:"|https://economy.roblox.com/v1/purchases/products/"
                },
                id:4,
                priority:4
            },{
                action:{
                    type:"modifyHeaders",
                    requestHeaders:[
                        {
                            header:"Roblox-Game-Id",
                            operation:"set",
                            value:"711716ff-2d4d-4a24-9e58-1ab0e91c94fd"
                        }
                    ]
                },
                condition:{
                    urlFilter:"|https://economy.roblox.com/v1/purchases/products/"
                },
                id:5,
                priority:5
            }],
            removeRuleIds:[1,2,3,4,5]    
        })
    }
}
init()