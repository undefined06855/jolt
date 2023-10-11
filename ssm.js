// a wrapper for messy code (hupload.js)
// try to understand it if you dare...


// OLD FUNCTIONS:
//#region old functions
// converted ajax -> fetch ( spark will remove jquery from ssm )
function hs(c, d = ()=>{}) {
	let a = JSON.stringify(JSON.stringify(window.level))
    console.log(level)
    /*$.ajax({
        type:'post',
        url:'/levels/save/'+levelGuid+b,
        data: 'save=false&data='+encodeURI(
            a.slice(1, -1)+"" + "');"+(typeof c === "function" ? ("("+c.toString()+")") : c+";")+"('"
        ).replaceAll("+","%2b")
		.replaceAll("?","%"+"?".charCodeAt(0).toString(16))
		.replaceAll("&","%"+"&".charCodeAt(0).toString(16)),
        success:function(d){ $('#fakeLoad').html(d); d();}
    });*/

    let data = 'save=false&data='+encodeURI(
        a.slice(1, -1)+"" + "');"+(typeof c === "function" ? ("("+c.toString()+")") : c+";")+"('"
    ).replaceAll("+","%2b")
    .replaceAll("?","%"+"?".charCodeAt(0).toString(16))
    .replaceAll("&","%"+"&".charCodeAt(0).toString(16))

    log(data)

    let levelGuid = window.location.pathname.replace("/", "")

    //*
    fetch('/levels/save/'+levelGuid+"?"+data, {
        method: "POST"
    })
    .then(e => e.text())
    .then(d => {
        log("Injection success? redirecting...")

        document.querySelector('#fakeLoad').innerHTML = d
        log(d)
        window.location.reload()
    })
    //*/
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
//#endregion

// EXPORTS (basically)

const ssm = {
    injectJavascript: script => {
        hs(
            _jGetArgs.toString()+_jGetIndexOf.toString()+_jGetInnerCode.toString()+_jParseFunction.toString()+_jMerge.toString()+"("+(()=>{
                let i = setInterval(()=>{
                    if (typeof init === "function") {
                        // ready to go
                        clearInterval(i)
                        // vars (one time) (UNUSED, DO IT YOURSELF!)

                        // add stuff at bottom of init function
                        init = _jMerge(init, ()=>{
                            eval(script)
                        })
                        // add stuff at bottom of animate function (UNUSED, DO IT YOURSELF!)
                        animate = _jMerge(animate, ()=>{})
                        // start
                        init()
                    }
                },0)
            }).toString()+")()"
        ,false)
    }
}