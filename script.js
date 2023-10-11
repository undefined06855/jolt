function log(...objects) { console.log(`Jolt: ${objects.join(" ")}`) }
log("Jolt loaded!")

// embed ui into editor
function jEmbedEditorUI()
{
    let topRightMenu = document.querySelector(".right-top-menu")
    if (topRightMenu)
    {
        log("In editor - appending UI")

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

        a.appendChild(button)

        topRightMenu.appendChild(a)
    }
}

function jPollJoltEditorUI()
{
    let joltEditorJSButton = document.querySelector(".jolt-insert-js")
    if (!joltEditorJSButton)
        jEmbedEditorUI()
}

function jInsertCustomJavascript(js)
{
    // called when you press the "inject javascript" button
    
    let saveLvlPrefix = "https://www.supersparkmaker.com/levels/save/"
    let currentLvlGuid = window.location.pathname.replace("/", "") // dont convert to number - precision is lost

    log("Injecting javascript\nguid=" + currentLvlGuid + "\njs=" + js)


    ssm.injectJavascript(js)
}


function jMain()
{
    setInterval(jPollJoltEditorUI, 500)
}

jMain()

