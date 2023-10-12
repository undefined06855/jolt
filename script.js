function log(...objects) { console.log(`Jolt: ${objects.join(" ")}`) }
log("Jolt loaded!")

// embed ui into editor
function jEmbedEditorUI()
{
    let topRightMenu = document.querySelector(".right-top-menu")
    if (topRightMenu)
    {
        log("In editor - appending UI")

        let transferElement = document.createElement("div")
        transferElement.style.display = "none"
        transferElement.id = "jTransferElement"
        document.body.appendChild(transferElement)


        let a = document.createElement("a")
        a.classList.add("button", "hover-zoom105", "brad5", "jolt-insert-js")

        a.innerText = "Insert javascript (Jolt)"

        let textarea = document.createElement("textarea")

        textarea.style.resize = "none"
        textarea.style.width = "240px"
        textarea.style.display = "block" // put on next line, easier than creating a <br/>

        textarea.addEventListener("keyup", event => event.stopImmediatePropagation()) // prevent keybinds happening
        
        a.appendChild(textarea)

        let button = document.createElement("button")
        button.innerText = "Inject"

        button.addEventListener("click", event => {
            event.stopPropagation()
            log("Clicked insert javascript btn")

            jInsertCustomJavascript(textarea.value)
        })

        // workaround for not being able to see window.level from chrome extension
        // add window.level data to DOM
        button.setAttribute("onclick", "document.querySelector('#jTransferElement').innerHTML = JSON.stringify(window.level)")

        a.appendChild(button)

        topRightMenu.appendChild(a)
    }
}

// tests if the ui is gone and if so add it to the dom again
function jPollJoltEditorUI()
{
    let joltEditorJSButton = document.querySelector(".jolt-insert-js")
    if (!joltEditorJSButton)
        jEmbedEditorUI()
}

// called when you press the "inject javascript" button
function jInsertCustomJavascript(js)
{
    let i = setInterval(() => {
        // poll if window.level is in DOM
        if (document.querySelector("#jTransferElement").innerHTML != "")
        {
            // ready to go
            clearInterval(i)

            let currentLvlGuid = window.location.pathname.replace("/", "") // dont convert to number - precision is lost

            log("Injecting javascript\nguid=" + currentLvlGuid + "\njs=" + js)

            let level = JSON.parse(document.querySelector("#jTransferElement").innerHTML)

            console.log(level)
        }
    }, 5) // shouldnt take too long
}


function jMain()
{
    setInterval(jPollJoltEditorUI, 500)
}

jMain()

