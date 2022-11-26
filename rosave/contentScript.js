//inject a script into the page to monkeypatch xmlhttprequest
const extension = globalThis.chrome || globalThis.browser //chrome and firefox

var devDonate=false

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

function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}

extension.storage.sync.get("placeid").then(async(res)=>{
    res=res.placeid
    if (!res) {
        let val = await extension.storage.local.get("devDonateId")
        res=val.devDonateId
        devDonate=true
    }
    const elem = document.createElement("meta")
    elem.setAttribute("id","rosave_placeid")
    elem.setAttribute("placeid",res)
    document.head.appendChild(elem)
    injectScript(extension.runtime.getURL('inject.js'), 'head');
}).catch((err)=>console.error)

const handleFromWeb = async (event) => {
    if (event.data.from=="rosave_inject") {
        const data = event.data.data;
        if (!devDonate) {
            extension.storage.sync.get("amounts",function(val){
                val=val.amounts
                val[data.type]+=data.amount*savings[data.type]
                val.total+=data.amount*savings[data.type]
                extension.storage.sync.set({amounts:val})
            })
        }
    }
};
window.addEventListener('message', handleFromWeb);