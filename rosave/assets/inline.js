const extension = globalThis.chrome || globalThis.browser //chrome and firefox
const input = document.querySelector("#placeid")
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