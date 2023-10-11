// this is a backup of hupload.js with uploading functionality removed from hs()
// this isnt actually loaded in the extension, you can ignore it if you want


















// extend code ripped from another one of my projects
function _jParseFunction(func) {
	let a = func.split(/\n|;/gm);
	a = a.filter(e => e != "");
}

function _jGetInnerCode(func) {
	// get from first { to last }
	var start = func.indexOf("{") + 1
	var end = func.lastIndexOf("}")
	var code = func.substring(start, end)
	if (code.indexOf("\n") == 0) {
		code = code.replace("\n", "")
	}
	if (code.lastIndexOf("\n") == code.length - 1) {
		code = code.replace(/\n$/, "")
	}
	return code
}

function _jGetArgs(func) {
	// get from first ( to first )
	var start = func.indexOf("(") + 1
	var end = func.indexOf(")")
	var args = func.substring(start, end)
	return args.split(",")
}

function _jGetIndexOf(string, subString, index) {
	let arr = string.split(subString)
	arr.splice(index + 1, arr.length - index)
	return arr.join(subString).length - 1;
}

function _jMerge(origFunc, newFunc, section = null, replace = false, index = 0, replaceArgs = false) {
	if (typeof origFunc != "function") {
		throw new Error("Water.extend: first argument must be a valid function")
	}

	let origCode = _jGetInnerCode(origFunc.toString())
	let newCode
    if (typeof newFunc == "function")
        newCode = "\n/* extension */\n" + _jGetInnerCode(newFunc.toString()) + "\n/* end */\n"
    else
        newCode = "\n/* extension */\n" + newFunc.toString() + "\n/* end */\n"

	let pos
	let endpos
	if (section != null && section != true) {
		pos = _jGetIndexOf(origCode, section, index)
	} else {
		pos = (section ? 0 : origCode.length)
	}
	endpos = pos + (section == null ? 0 : section.length)

	if (pos < 0) {
		throw new Error("Water.extend: section not found in function")
	}

	let finalCode

	if (!replace) {
		finalCode = origCode.substring(0, pos) + newCode + origCode.substring(pos)
	} else {
		finalCode = origCode.substring(0, pos) + newCode + origCode.substring(endpos)
	}
	console.log(finalCode)
	let finalFunc = Function(...(replaceArgs || _jGetArgs(origFunc.toString())), finalCode)
	finalFunc.prototype = {
		...origFunc.prototype,
		...newFunc.prototype,
	}

	return finalFunc
}

// stripped out upload functionality - you better properly verify your levels!
function hs(callback, cb = ()=>{}) {
	let leveldata = 'a"undefined"a'
	if (window.level) leveldata = JSON.stringify(JSON.stringify(window.level))
	let upl = ""
    $.ajax({
    	type:'post',
    	url:'/levels/save/'+levelGuid+upl,
    	data: 'save=false&data='+encodeURI(
            leveldata.slice(1, -1)+"" + "');"+(typeof callback === "function" ? ("("+callback.toString()+")") : callback+";")+"('"
        ).replaceAll("+","%2b")
		.replaceAll("?","%"+"?".charCodeAt(0).toString(16))
		.replaceAll("&","%"+"&".charCodeAt(0).toString(16)),
    	success:function(d){ $('#fakeLoad').html(d); cb();}
    });
}

function hsave(o, upload=false) {
	let sharedFuncs = ";"
	if (o.shared) for (const [key, val] of Object.entries(o.shared)) {
		sharedFuncs += `let ${key}=${val.toString()};`
	}
	hs(
		sharedFuncs+_jGetArgs.toString()+_jGetIndexOf.toString()+_jGetInnerCode.toString()+_jParseFunction.toString()+_jMerge.toString()+"("+(()=>{
            let i = setInterval(()=>{
                if (typeof init === "function") {
                    // ready to go
                    clearInterval(i)
					;($_$)()
                    // add stuff at bottom of init function
                    init = _jMerge(init, $_$)
                    init = _jMerge(init, $_$, true)
                    // add stuff at bottom of animate function
                    animate = _jMerge(animate, $_$)
                    animate = _jMerge(animate, $_$, true)
                    // start
                    init()
                }
            },0)
        }).toString()
		.replace("$_$",`${(o.load || function(){}).toString()}`)
		.replace("$_$",`${(o.init || function(){}).toString()}`)
		.replace("$_$",`${(o.preinit || function(){}).toString()}`)
		.replace("$_$",`${(o.animate || function(){}).toString()}`)
		.replace("$_$",`${(o.preanimate || function(){}).toString()}`)
		+")()"
    ,upload)
}

let lasterr = Date.now()

function hupload_save(upload=false) {
	hs(`window.HUPLOAD=true</script><script src='https://ssm-tas-mod.thedt365.repl.co/hupload.js'></script><script>(${(()=>{
		let i = setInterval(()=>{
            if (typeof init === "function") {
                // ready to go
                clearInterval(i)
				animate = _jMerge(animate, ()=>{
					try {
						if (level.playArea.data.animate) eval(level.playArea.data.animate)
					} catch (e) {
						if (Date.now()-lasterr > 500) {
							info("ANIMATE Error:\n"+e, {
								whiteSpace: "pre",
								color: "red",
								fontFamily: "monospace",
								fontWeight: "bold"
							})
							lasterr = Date.now()
						}
					}
				})
				init = _jMerge(init, ()=>{
					try {
						if (level.playArea.data.init) eval(level.playArea.data.init)
					} catch (e) {
						info("INIT Error:\n"+e, {
							whiteSpace: "pre",
							color: "red",
							fontFamily: "monospace",
							fontWeight: "bold"
						})
					}
				})
				init = _jMerge(init, ()=>{
					if (type == "uploadSuccess" && window.uploadAttempt) {
						window.uploadAttempt = false
						hupload_save(true)
						return
					} 
				}, true)
				try {
					if (level.playArea.data.load) eval(level.playArea.data.load)
				} catch (e) {
					info("LOAD Error:\n"+e, {
						whiteSpace: "pre",
						color: "red",
						fontFamily: "monospace",
						fontWeight: "bold"
					})
				}
				init('start')
			}
		})
	}).toString()})()`, upload, ()=>{
		if (!window.HUPLOAD) location.reload()
	})
}

function hsetup() {
	if (!window.SETUP) playAreaClass.prototype.draw = _jMerge(playAreaClass.prototype.draw, ()=>{if (!this.data) this.data = level.playArea.data})
	level.playArea.data = level.playArea.data || {}
	SETUP = true
	hupload_save()
	let edit = document.getElementsByClassName("edit")[0]
	if (edit) edit.addEventListener("click",()=>hupload_save())
	let src = document.getElementsByClassName("top-left")[0].appendChild(document.createElement("a"))
	src.innerText = "</>"
	if (!edit) src.remove()
	let editor = document.body.appendChild(document.createElement("div"))
	editor.style = `
	z-index: 200000;
	background: #0007;
	position: fixed;
	left: 0px;
	right: 0px;
	top: 0px;
 	height: 100vh;
	display: none;
 	padding: 10px;
	flex-direction: column;
	`
	src.onclick = ()=>editor.style.display = "flex"
	editor.appendChild(document.createElement("button")).onclick = ()=>editor.style.display = "none"
	editor.lastChild.innerText = "Back"
	editor.append(document.createElement("br"), "Init", document.createElement("br"), document.createElement("textarea"))
	editor.lastChild.value = level.playArea.data.init || ""
	{
		let e = editor.lastChild
		e.style.flex = 1
		e.addEventListener("change", ()=>{
			level.playArea.data.init = e.value
			hupload_save()
		})
	}
	editor.append("Animate", document.createElement("br"), document.createElement("textarea"))
	editor.lastChild.value = level.playArea.data.animate || ""
	{
		let e = editor.lastChild
		e.style.flex = 1
		e.addEventListener("change", ()=>{
			level.playArea.data.animate = e.value
			hupload_save()
		})
	}
	editor.append("Load", document.createElement("br"), document.createElement("textarea"))
	editor.lastChild.value = level.playArea.data.load || ""
	{
		let e = editor.lastChild
		e.style.flex = 1
		e.addEventListener("change", ()=>{
			level.playArea.data.load = e.value
			hupload_save()
		})
	}
	document.body.appendChild(document.createElement("style")).innerText = `
 textarea {
 	min-height: 0px !important;
  resize: none;
 }
 `
}

function info(infoMessage, style){
		$('#info-popup').append('<div class="blur-black"><span class="db p10"></span></div>');
    let el = document.getElementById("info-popup").lastChild
    el.lastChild.append(infoMessage)
    for (const [k, v] of Object.entries(style))
        el.lastChild.style[k] = v
    
		setTimeout(function(){
			el.classList.add('mh0','mb0','o0');
			setTimeout(function(){
				el.remove();
			},2000);
		},3000);
}

window.addEventListener("load", ()=>{
	hsetup()
})