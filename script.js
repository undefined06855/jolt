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
    let currentLvlGuid = window.location.pathname.replace("/", "") // dont convert to number - precision is lost

    log("Injecting javascript\nguid=" + currentLvlGuid + "\njs=" + js)

    let s = document.createElement("script")
    s.innerText = `
    console.log(window.level)
    `
    document.body.appendChild(s)
}


function jMain()
{
    setInterval(jPollJoltEditorUI, 500)
}

jMain()

