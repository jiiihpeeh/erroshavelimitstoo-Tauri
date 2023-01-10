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
    NimCall = object 
        call, argument: string

    LaTeXPath = object 
        exists: bool 
        path: string

    LaTeXFile = object 
        content,target: string

    ImageFile = object 
        content,target: string 


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
        path.writeFile(uncompress(parseEquationModule))
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

proc runLaTeX(args: string):cstring=
    try:
        let latexBin = getLatexPath()
        if latexBin.exists:
            let 
                fileInfo = args.fromJson(LaTeXFile)
                curDir = getCurrentDir()
                tempDir = createTempDir("errorshavelimits", "_temp")
            setCurrentDir(tempDir)
            writeFile("temp.tex", fileInfo.content)
            let exitCode = execCmd(latexBin.path & " temp.tex")
            if exitCode == 0:
                moveFile("temp.pdf", fileInfo.target)
                setCurrentDir(curDir)
                removeDir(tempDir)
                return "true".cstring
            else:
                setCurrentDir(curDir)
                removeDir(tempDir)
        return "false".cstring
    except:
        return "false".cstring

proc writeFileToPath(args:string):cstring=
    try:
        let fileInfo = args.fromJson(LaTeXFile)
        writeFile(fileInfo.target, fileInfo.content)
        return "true".cstring
    except:
        return "false".cstring

proc parse(equation:string):cstring=
    try:
        return parseEquation.parse(equation).to(string).cstring
    except:
        return "false".cstring

proc calculate(equation:string):cstring=
    try:
        return parseEquation.calculate(equation).to(string).cstring
    except:
        return "false".cstring

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

proc getPngFromSvg(args:string):cstring=
    try:
        let fileInfo = args.fromJson(ImageFile)
        let png = svgToPng(fileInfo.content)
        result = encode(png).cstring
    except:
        result = "false".cstring

proc saveSvgAsPng(args:string):cstring=
    try:
        let fileInfo = args.fromJson(ImageFile)
        let png = svgToPng(fileInfo.content)
        writeFile(fileInfo.target,png)
        return "true".cstring
    except:
        return "false".cstring


proc callNim*(call: cstring):cstring{.exportc.}=
    #echo "CALLER"
    var calling : NimCall 
    try:
        #echo "NimPy: " & $call
        calling = ($call).fromJson(NimCall)
    except:
        discard

    echo calling
    case calling.call:
    of "runLaTex":
        return runLaTeX(calling.argument)
    of "hasLatex":
        return hasLatex()
    of "write":
        return writeFileToPath(calling.argument)
    of "init":
        echo "initializing Python"
        if not scriptLoaded:
            scriptLoaded = loadScript(calling.argument)
            if scriptLoaded:
                echo "Succesfully loaded SymPy"
                return "true".cstring
            else:
                echo "Failed to load Sympy"
                return "false".cstring
        else:
            echo "Succesfully loaded SymPy"
            return "true".cstring
    of "parse":
        return parse(calling.argument)
    of "calculate":
        return calculate(calling.argument)
    of "saveSVGasPNG":
        return saveSvgAsPng(calling.argument)
    of "getPngFromSvg":
        return getPngFromSvg(calling.argument)

    
    return "false".cstring

