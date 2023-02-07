//inject a script into the page to monkeypatch xmlhttprequest
const extension = globalThis.chrome || globalThis.browser //chrome and firefox

window.devDonate=false

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
    console.log(res)
    res=res.placeid
    if (!res) {
        let val = await extension.storage.local.get("devDonateId")
        res=val.devDonateId
        window.devDonate=true
    }
    let showText = await extension.storage.sync.get("showplaceid")
    showText = showText.showplaceid
    const elem = document.createElement("meta")
    elem.setAttribute("id","rosave_data")
    elem.setAttribute("placeid",res)
    elem.setAttribute("showplaceid", Number(showText))
    document.head.appendChild(elem)
    injectScript(extension.runtime.getURL('inject.js'), 'head');
})

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
    }
};
window.addEventListener('message', handleFromWeb);