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

    //set the dev donate id, used when a place id is not specified.
    fetch("https://enderspearl184.github.io/RoSave/values.json").then(async(res)=>{
        extension.storage.local.set({devDonateId:(await res.json()).devDonateId})
    })
})


const savings = {
    "layeredClothing": 0.4,
    "classicClothing": 0.1,
    "accessories": 0.4,
    "passes": 0.1,
    "plugins": 0.1,
    "bundles": 0.4,
    "classicHeads":0.4,
    "classicFaces":0.4,
    "emotes":0.4
}


async function assetTypes(req){
    const json=await req.json()
    if (json.reason=="Success") {
        switch (json.assetType) {
            case "Bundle":
                window.postMessage({ from: 'rosave_inject', data:{type:"bundles",amount:json.price}})
                break;
            case "Game Pass":
                window.postMessage({ from: 'rosave_inject', data:{type:"passes",amount:json.price}})
                break;
            case "Shirt":
                window.postMessage({ from: 'rosave_inject', data:{type:"classicClothing",amount:json.price}})
                break;
            case "T-Shirt":
                window.postMessage({ from: 'rosave_inject', data:{type:"classicClothing",amount:json.price}})
                break;
            case "Pants":
                window.postMessage({ from: 'rosave_inject', data:{type:"classicClothing",amount:json.price}})
                break;
            case "T-Shirt Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:json.price}})
                break;
            case "Shirt Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:json.price}})
                break;
            case "Sweater Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:json.price}})
                break;
            case "Jacket Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:json.price}})
                break;
            case "Pants Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:json.price}})
                break;
            case "Shorts Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:json.price}})
                break;
            case "Dress Skirt Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:json.price}})
                break;
            case "Hat":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:json.price}})
                break;
            case "Face Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:json.price}})
                break;
            case "Neck Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:json.price}})
                break;
            case "Shoulder Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:json.price}})
                break;
            case "Front Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:json.price}})
                break;
            case "Back Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:json.price}})
                break;
            case "Waist Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:json.price}})
                break;
            case "Gear":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:json.price}})
                break;
            case "Hair Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:json.price}})
                break;
            case "Head":
                window.postMessage({ from: 'rosave_inject', data:{type:"classicHeads",amount:json.price}})
                break;
            case "Face":
                window.postMessage({ from: 'rosave_inject', data:{type:"classicFaces",amount:json.price}})
                break;
            case "Emote Animation":
                window.postMessage({ from: 'rosave_inject', data:{type:"emotes",amount:json.price}})
                break;
            case "Emote Animation":
                window.postMessage({ from: 'rosave_inject', data:{type:"plugins",amount:json.price}})
                break;
            default:
                console.info("RoSave: Unknown AssetType " + json.assetType)
                break;
        }
    }
}

/*
const handleFromWeb = async (event) => {
    if (event.data.from=="rosave_inject") {
        const data = event.data.data;
        if (isNaN(data.amount)) {data.amount=0}
        if (!window.devDonate) {
            extension.storage.sync.get("amounts",function(val){
                val=val.amounts
		        if (val[data.type]==undefined) {return}
                val[data.type]+=Math.floor(data.amount*savings[data.type])
                val.total+=Math.floor(data.amount*savings[data.type])
		        extension.storage.sync.set({amounts:val})
            })
        }
    } else if (event.data.from=="rosave_inject_gamejoin") {
        const data = event.data.data
        if (data.response==undefined || data.response==null) {
            let response = await gameJoinMethod()
            data.response = response
            event.source.postMessage(event.data)
        }
    }
};

window.addEventListener('message', handleFromWeb);
*/

async function onBeforePurchaseRequest(details) {
    alert(JSON.stringify(details))
    console.log(details)
    let id;
    try {
        id = details.url.match(/\d+/).shift()
    } catch (err) {
        console.error(err)
    }
    return {redirectUrl:`https://apis.roblox.com/cloud/v2/avatar-marketplace-orders?idempotencyKey.key=${crypto.randomUUID()}`}
}

browser.webRequest.onBeforeRequest.addListener(onBeforePurchaseRequest, {urls:["https://economy.roblox.com/v1/purchases/products/*"]},["blocking","requestBody"])

async function onBeforePurchaseSendHeaders(details) {

}

browser.webRequest.onBeforeSendHeaders()