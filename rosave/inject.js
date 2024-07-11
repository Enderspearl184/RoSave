//window.postMessage({ from: 'rosave_inject', data: STUFF })
const XHROpen=XMLHttpRequest.prototype.open
let placeId = parseInt(document.querySelector("#rosave_data").getAttribute("placeid"))

//using number instead of boolean because attributes are always strings
let showplaceid=Number(document.querySelector("#rosave_data").getAttribute("showplaceid"))

//www.roblox.com or web.roblox.com only code
if (window.location.hostname=="www.roblox.com" || window.location.hostname=="web.roblox.com") {
    if (showplaceid) {
        setInterval(()=>{
            let buttons = document.querySelectorAll("button.PurchaseButton") //find purchase button
            buttons.forEach((button)=>{
                if (button.modified) return
                console.log("modifying button")
                button.modified=true
                button.onclick = function() {
                    setTimeout(function() {
                        let modal=document.querySelector(".modal-buttons")
                        let child=document.createElement("div")
                        child.setAttribute("class","text-footer modal-footer-center")
                        child.innerText=`Some of the cost will go to the creator of place `
                        let atag=document.createElement("a")
                        atag.setAttribute("href",`/games/${placeId}`)
                        atag.textContent=placeId
                        child.appendChild(atag)
                        modal.appendChild(document.createElement("br"))
                        modal.appendChild(document.createElement("br"))
                        modal.appendChild(child)
                    }, 25)
                }
            })
        },100)
    }
} 


/*
//this doesnt work as the classes seem to randomly change >:(
//create.roblox.com only code
if (window.location.hostname=="create.roblox.com") {
    if (showplaceid) {
        setInterval(function(){
            let button = document.querySelector(".jss917")
            if (button && !button.edited) {
                button.edited=true
                button.onclick = function() {
                    setTimeout(function(){
                        let confirmbox = document.querySelector(".jss952")
                        if (confirmbox) {
                            confirmbox.appendChild(document.createElement("br"))
                            let child = document.createElement("span")
                            child.style='text-align: center;'
                            child.innerHTML=`Some of the cost will go to the creator of place <a href="https://roblox.com/games/${Number(placeId)}">${Number(placeId)}</a>`
                            confirmbox.appendChild(child)
                        }
                    },250)
                }
            }
        },25) //wait for buttons to exist
    }
}
*/