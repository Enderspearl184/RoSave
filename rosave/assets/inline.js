const extension = globalThis.chrome || globalThis.browser //chrome and firefox
const placeidinput = document.querySelector("#placeid")
const showplaceidinput = document.querySelector("#showplaceid")
const saveButton = document.querySelector("#saveSettings")

const abbreviateNumber = (number, decPlaces=1) => {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces)

  // Enumerate number abbreviations
  var abbrev = ['K', 'M', 'B', 'T']

  // Go through the array backwards, so we do the largest first
  for (var i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10, (i + 1) * 3)

    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round((number * decPlaces) / size) / decPlaces

      // Handle special case where we round up to the next abbreviation
      if (number == 1000 && i < abbrev.length - 1) {
        number = 1
        i++
      }

      // Add the letter for the abbreviation
      number += abbrev[i] + "+"
      

      // We are done... stop
      break
    }
  }

  return number
}

//incase the values get fucked up, fix em!
function recalcAmounts(val){
  let didReset=false

  if (isNaN(val.total)) {val.total=0;didReset=true}
  if (isNaN(val.classicClothing)) {val.classicClothing=0;didReset=true}
  if (isNaN(val.layeredClothing)) {val.layeredClothing=0;didReset=true}
  if (isNaN(val.accessories)) {val.accessories=0;didReset=true}
  if (isNaN(val.bundles)) {val.bundles=0;didReset=true}
  if (isNaN(val.heads)) {val.heads=0;didReset=true}
  if (isNaN(val.faces)) {val.faces=0;didReset=true}
  if (isNaN(val.passes)) {val.passes=0;didReset=true}
  if (isNaN(val.plugins)) {val.plugins=0;didReset=true}
  console.log(didReset)
  if (didReset) {
    //alert("Some or all of the Saved Robux counters have been reset due to an error.")
    let total = 0
    for (let key of Object.keys(val)) {
      if (key!=="total") {
        total+=val[key]
      }
    }
    val.total=total
    //save the reset counts
    extension.storage.sync.set({amounts:val})
  }
  return val
}

extension.storage.sync.get("amounts",function(val){
    val=val.amounts
    //console.log(val)
    console.log(recalcAmounts)
    val = recalcAmounts(val)//won't do anything if the values are normal.

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
    placeidinput.value=val.placeid
})

extension.storage.sync.get("showplaceid",function(val){
  showplaceidinput.checked=val.showplaceid
})

saveButton.onclick=async function() {
    await extension.storage.sync.set({placeid:placeidinput.value})
    await extension.storage.sync.set({showplaceid:showplaceidinput.checked})

    //thank you manifest v3 for making me do this -_-
    if (extension.runtime.getManifest()["manifest_version"]==3) {
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
          }],
          removeRuleIds:[1]    
      })
    }

    await extension.tabs.query({url:"<all_urls>"},function(tabs){tabs.forEach((tab)=>{extension.tabs.reload(tab.id)})})
}