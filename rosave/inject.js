//window.postMessage({ from: 'rosave_inject', data: STUFF })
const XHROpen=XMLHttpRequest.prototype.open
let placeId = parseInt(document.querySelector("#rosave_placeid").getAttribute("placeid")) //default

//tell the extension that a purchase happened and stuff
async function assetTypes(req){
    const json=await req.json()
    if (!json.errors && json.purchased) {
        //HELP
        switch (json.assetType) {
            case "Bundle":
                window.postMessage({ from: 'rosave_inject', data:{type:"bundles",amount:body.expectedPrice}})
                break;
            case "Game Pass":
                window.postMessage({ from: 'rosave_inject', data:{type:"passes",amount:body.expectedPrice}})
                break;
            case "Shirt":
                window.postMessage({ from: 'rosave_inject', data:{type:"classicClothing",amount:body.expectedPrice}})
                break;
            case "T-Shirt":
                window.postMessage({ from: 'rosave_inject', data:{type:"classicClothing",amount:body.expectedPrice}})
                break;
            case "Pants":
                window.postMessage({ from: 'rosave_inject', data:{type:"classicClothing",amount:body.expectedPrice}})
                break;
            case "T-Shirt Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:body.expectedPrice}})
                break;
            case "Shirt Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:body.expectedPrice}})
                break;
            case "Sweater Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:body.expectedPrice}})
                break;
            case "Jacket Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:body.expectedPrice}})
                break;
            case "Pants Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:body.expectedPrice}})
                break;
            case "Shorts Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:body.expectedPrice}})
                break;
            case "Dress Skirt Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"layeredClothing",amount:body.expectedPrice}})
                break;
            case "Hat":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:body.expectedPrice}})
                break;
            case "Face Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:body.expectedPrice}})
                break;
            case "Neck Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:body.expectedPrice}})
                break;
            case "Shoulder Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:body.expectedPrice}})
                break;
            case "Front Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:body.expectedPrice}})
                break;
            case "Back Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:body.expectedPrice}})
                break;
            case "Waist Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:body.expectedPrice}})
                break;
            case "Gear":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:body.expectedPrice}})
                break;
            case "Hair Accessory":
                window.postMessage({ from: 'rosave_inject', data:{type:"accessories",amount:body.expectedPrice}})
                break;
            case "Head":
                window.postMessage({ from: 'rosave_inject', data:{type:"classicHeads",amount:body.expectedPrice}})
                break;
            case "Face":
                window.postMessage({ from: 'rosave_inject', data:{type:"classicFaces",amount:body.expectedPrice}})
                break;
            case "Emote Animation":
                window.postMessage({ from: 'rosave_inject', data:{type:"emotes",amount:body.expectedPrice}})
                break;
            case "Emote Animation":
                window.postMessage({ from: 'rosave_inject', data:{type:"plugins",amount:body.expectedPrice}})
                break;
            default:
                console.info("RoSave: Unknown AssetType " + json.assetType)
                break;
        }
    }
}

//this is just unspaghettifying the xhr script
function method(xhr,args) {
    let body = JSON.parse(args[0])
    body.saleLocationId=placeId,
    body.saleLocationType="Game"
    args[0]=JSON.stringify(body)
    xhr.addEventListener("load",function(){
        let res = JSON.parse(xhr.responseText)
        if (!res.errors && res.purchased) {
            fetch(`https://economy.roblox.com/v1/products/${res.productId}`,{credentials:"include"}).then(assetTypes)
        }
    })
}

//monkeypatch XMLHttpRequest to edit the body and add the save stuff
XMLHttpRequest.prototype.open=function(){
    //TODO check for nextgen endpoints https://economy.roblox.com/v2/metadata/nextgen-purchase-status 
    if (arguments[0]=="POST" && arguments[1]?.startsWith("https://economy.roblox.com/v1/purchases/products/")) {
        //monkeypatch the xhr send and set onload
        const XHRSend=this.send
        this.send=function(){
            let args=[].concat(...arguments)
            if (location.pathname.startsWith("/catalog/")) {
                let id = parseInt(location.pathname.split("/catalog/")[1])
                fetch(`https://economy.roblox.com/v2/assets/${id}/details`).then(async(res)=>{
                    try {
                        let json = await res.json()
                        if (!json.SaleAvailabilityLocations || json.SaleAvailabilityLocations.includes("AllUniverses")) {
                            method(this,args)
                        }
                    } catch(err){console.error(err)}
                    XHRSend.apply(this,args)
                }).catch(()=>{XHRSend.apply(this,args)})
            } else {
                method(this,args)
                XHRSend.apply(this,args)
            }
        }
    }
    XHROpen.apply(this,arguments)
}

//create.roblox.com library uses fetch instead of xhr D:
//at least this takes significantly less code
//since i dont need to think about saleavailablitylocations
//as none of the assettypes you can buy on that subdomain allow saleavailablitylocations
const realfetch=window.fetch
window.fetch=async function(){
    const args=[].concat(...arguments)
    if (args[1]?.method?.toLowerCase()=="post" && args[0]?.startsWith("https://economy.roblox.com/v1/purchases/products/")) {
        let body = JSON.parse(args[1].body)
        body.saleLocationId=placeId,
        body.saleLocationType="Game"
        args[1].body=JSON.stringify(body)
        const res = realfetch(...args)
        const promise = new Promise((resolve,reject)=>{res.then((data)=>{
            assetTypes(data.clone()); //clone it so we can read it here and the page script can too
            resolve(data); //return the original response to the page script
        },reject)})
        return promise
    }
    return realfetch(...args) //ignore all that crap if its not a purchase request
}