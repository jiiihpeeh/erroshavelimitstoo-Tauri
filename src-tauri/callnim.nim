import std/[os,osproc,strutils, tempfiles, base64], jsony, supersnappy,nimpy, pixie/fileformats/[svg, png], pixie

const fileName = "parse_equation.py"

proc getModule():string{.compileTime.} =
    return compress(readFile(fileName))

const parseEquationModule = getModule()
var 
    parseEquation : PyObject
    sys : PyObject
    scriptLoaded = false

type 
    LaTeXPath = object 
        exists: bool
        path : string

    PngEncode = object 
        result: bool 
        base64: string

    Call = enum 
        runLatex = 0
        hasLatex = 1
        write = 2
        init = 3
        parse = 4
        calculate = 5
        saveSvgAsPng = 6
        getPngFromSvg = 7

    CallObject = object 
        case call : Call
        of runLatex, saveSVGasPNG, write:
            content,target: string
        of hasLatex:
            discard
        of init:
            folder: string
        of parse, calculate:
            argument: string
        of getPngFromSvg:
            svgString: string


when defined windows:
    const lateXBins = ["xelatex.exe", "pdflatex.exe"]
else:
    const lateXBins = ["xelatex", "pdflatex"]


#let None = pyBuiltins().None

# template with_py(context: typed, name: untyped, body: untyped) =
#   try:
#     # Can't use the `.` template
#     let name = callMethod(context, "__enter__")  # context.__enter__()
#     body
#   finally:
#     discard callMethod(context, "__exit__", None, None, None)

template withExecptions(actions: untyped): cstring =
    var output : cstring
    try:
        actions
        output = "true".cstring
    except:
        output = "false".cstring
    output

template withOutputExecption(action: untyped): cstring =
    var output : cstring
    try:
        output = action
    except:
        output = "false".cstring
    output


proc loadScript(folder:string): bool=
    try:
        #check PYTHONHOME to solve problems with AppImage
        echo "loading sys"
        let pyEnv = getEnv("PYTHONHOME")
        if pyEnv.startsWith("/tmp/.mount"):
            let newPath = "/" & pyEnv.split("/")[3..^1].join("/")
            putEnv("PYTHONHOME", newPath)
        echo "PYTHONHOME " & getEnv("PYTHONHOME")
        sys = pyImport("sys")
        echo "imported sys"
        let path = joinPath(folder, fileName)
        if fileExists(path):
            removeFile(path)
        let pychacheDir = joinPath(folder,"__pycache__")
        if dirExists(pychacheDir):
            removeDir(pychacheDir)
        path.writeFile parseEquationModule.uncompress
        discard sys.path.append(folder.cstring)
        let moduleName = fileName[0..^4].cstring
        parseEquation = pyImport(moduleName)
        return true
    except:
        return false

proc getLateXPath():LaTeXPath=
    let paths = getEnv("PATH").split(":")
    for d in paths:
        for l in lateXBins:
            let path = joinPath(d, l)
            if fileExists(path):
                result = LaTeXPath(exists: true, path : path)
                break

proc hasLatex():cstring=
    return toJson(getLatexPath()).cstring

proc runLaTeX(content: string, target: string)=
    let latexBin = getLatexPath()
    if latexBin.exists:
        let 
            curDir = getCurrentDir()
            tempDir = createTempDir("errorshavelimits", "_temp")
        tempDir.setCurrentDir
        "temp.tex".writeFile content
        let exitCode = execCmd(latexBin.path & " temp.tex")
        if exitCode == 0:
            "temp.pdf".moveFile target
            curDir.setCurrentDir
            tempDir.removeDir
        else:
            curDir.setCurrentDir
            tempDir.removeDir

proc writeFileToPath(content: string, target: string)=
    target.writeFile content


proc parse(equation:string):cstring=
    return parseEquation.parse(equation).to(string).cstring


proc calculate(equation:string):cstring=
    return parseEquation.calculate(equation).to(string).cstring


proc svgToPng(svg:string):string =
    let 
        img =  newImage(parseSvg(svg))
        wt = img.width.float32
        ht = img.height.float32
        scaleF = 0.02
        x = wt * scaleF
        y = ht * scaleF
        image = newImage(x.int, y.int)
    image.fill(rgba(255, 255, 255, 255))

    image.draw(img,scale(vec2(scaleF, scaleF)))
    result = encodePng(image)

proc getPngFromSvg(svg:string):cstring=
    try:
        let png = svgToPng(svg)
        result = PngEncode( result: true, base64: encode(png)).toJson.cstring
    except:
        result = PngEncode( result: false, base64: "").toJson.cstring

proc saveSvgAsPng(content: string, target: string)=
    let png = svgToPng(content)
    target.writeFile png


proc callNim*(call: cstring):cstring{.exportc.}=
    #echo "CALLER"
    var calling : CallObject 
    try:
        #echo "NimPy: " & $call
        calling = ($call).fromJson(CallObject)
    except:
        discard

    echo calling
    case calling.call:
    of runLaTex:
        result = withExecptions: 
            runLaTeX(calling.content, calling.target)
    of hasLatex:
        return hasLatex()
    of write:
        result = withExecptions: 
            writeFileToPath(calling.content, calling.target)
    of init:
        echo "initializing Python"
        if not scriptLoaded:
            scriptLoaded = loadScript(calling.folder)
            if scriptLoaded:
                echo "Succesfully loaded SymPy"
                return "true".cstring
            else:
                echo "Failed to load Sympy"
                return "false".cstring
        else:
            echo "Succesfully loaded SymPy"
            return "true".cstring
    of parse:
        result = withOutputExecption:
            parse(calling.argument)
            
    of calculate:
        result = withOutputExecption:
            calculate(calling.argument)
        
    of saveSVGasPNG:
        result = withExecptions: 
            saveSvgAsPng(calling.content, calling.target)
    of getPngFromSvg:
        return getPngFromSvg(calling.svgString)
