const extension = globalThis.chrome || globalThis.browser //chrome and firefox
const input = document.querySelector("#placeid")
const saveButton = document.querySelector("#saveSettings")

function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b","t"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}

extension.storage.sync.get("amounts",function(val){
    val=val.amounts
    console.log(val)

    let yeah = document.querySelector("#total")
    yeah.title=val.total
    yeah.innerText=`R$${abbreviateNumber(val.total)}`
   
    yeah = document.querySelector("#classicClothing")
    yeah.title=val.classicClothing
    yeah.innerText=`R$${abbreviateNumber(val.classicClothing)}`

    yeah = document.querySelector("#layeredClothing")
    yeah.title=val.layeredClothing
    yeah.innerText=`R$${abbreviateNumber(val.layeredClothing)}`
    
    yeah = document.querySelector("#accessories")
    yeah.title=val.accessories
    yeah.innerText=`R$${abbreviateNumber(val.accessories)}`
    
    yeah = document.querySelector("#bundles")
    yeah.title=val.bundles
    yeah.innerText=`R$${abbreviateNumber(val.bundles)}`
    
    yeah = document.querySelector("#heads")
    yeah.title=val.heads
    yeah.innerText=`R$${abbreviateNumber(val.heads)}`
    
    yeah = document.querySelector("#faces")
    yeah.title=val.faces
    yeah.innerText=`R$${abbreviateNumber(val.faces)}`
    
    yeah = document.querySelector("#passes")
    yeah.title=val.passes
    yeah.innerText=`R$${abbreviateNumber(val.passes)}`
   
    yeah = document.querySelector("#plugins")
    yeah.title=val.plugins
    yeah.innerText=`R$${abbreviateNumber(val.plugins)}`
})

extension.storage.sync.get("placeid",function(val){
    input.value=val.placeid
})

saveButton.onclick=function() {
    extension.storage.sync.set({placeid:input.value})
    extension.tabs.query({url:"<all_urls>"},function(tabs){tabs.forEach((tab)=>{extension.tabs.reload(tab.id)})})
}