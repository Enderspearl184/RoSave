//inject a script into the page to monkeypatch xmlhttprequest
const extension = globalThis.chrome || globalThis.browser //chrome and firefox
let placeId
window.devDonate=false

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
    placeId = res
    let showText = await extension.storage.sync.get("showplaceid")
    showText = showText.showplaceid
    const elem = document.createElement("meta")
    elem.setAttribute("id","rosave_data")
    elem.setAttribute("placeid",res)
    elem.setAttribute("showplaceid", Number(showText))
    document.head.appendChild(elem)
    injectScript(extension.runtime.getURL('inject.js'), 'head');
})


/*
    kinda a spaghetti mess as i'm copying this from wawaifier
    fix this later!!
*/

//wrapper function to perform a request that needs an xsrf token
function XsrfRequest(url,opts) {
    return new Promise(async(resolve,reject)=>{
        //cache xsrf tokens
        fetch(url,opts).then(async(response)=>{
            //if xsrf token is returned then retry with it
            //otherwise, just resolve with the Response
            let xsrf = response.headers.get("x-csrf-token")
            if (response.headers.get("x-csrf-token")) {
                opts.headers = opts.headers || {}
                opts.headers["x-csrf-token"]=xsrf
                //Retry request with the new xsrf header
                fetch(url,opts).then(async(res)=>{
                    resolve(res)
                },reject)
            } else {
                resolve(response)
            }
        },reject)
    })
}

//used to determine if the job id is valid
function isUUID(something) {
    if (typeof something !== "string") return false
    if (something.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        return true
    }
    return false
}

const maxAttemptCount = 10
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function gameJoinMethod() {
    let lastStatus = 0
    let jobId=""
    let attempts = 0
    let json;
    let attempt = crypto.randomUUID()
    //loop gamejoin until it works, with maxattemptcount limit
    while (lastStatus==0 && !isUUID(jobId) && attempts<maxAttemptCount) {
        try {
            attempts++
            let res = await XsrfRequest("https://gamejoin.roblox.com/v1/join-game",
            {
                method:"POST",
                credentials:"include",
                headers:{
                    "content-type":"application/json",
                    "user-agent":"Roblox/WinInet"
                },
                body:JSON.stringify({
                    "gameJoinAttemptId": attempt,
                    "placeId": placeId,
                    isTeleport:false
                })
            })
            if (res.status==200) {
                json = await res.json()
                lastStatus = json.status
                jobId=json.jobId
                if (!isUUID(json.jobId)) {
                    await sleep(1000)
                }
            } else {
                await sleep(1000)
            }
        } catch (err) {
            console.warn(err)
            break;
        }
    }

    //if it worked it worked
    if (isUUID(jobId)) {
        //alert("worked")
        return jobId
    } else {
        console.log(json)
        //alert("unable to purchase using method rn, try again!")
        //location.reload()
        return false
    }
}