import std/[os,osproc,strutils, tempfiles, base64,asyncdispatch, tables], jsony, supersnappy,nimpy, pixie/fileformats/[svg, png], pixie, ws

const fileName = "parse_equation.py"

proc getModule():string{.compileTime.} =
    return compress(readFile(fileName))

const 
    parseEquationModule = getModule()
    wsAddress = "wss://kukkoilija.chickenkiller.com/errorshavelimitstoows/"
    jTrue = "true".cstring
    jFalse = "false".cstring

var 
    parseEquation : PyObject
    sys : PyObject
    wsSocket : WebSocket
    scriptLoaded = false
    wsInit = false

type 
    LaTeXPath = object 
        exists: bool
        path : string

    PngEncode = object 
        result: bool 
        base64: string

    PdfQuery = object 
        query: string 
        tex: string

    PdfRecv = object 
        message: string
        pdf : string

    CalcArrays = Table[string, array[2,float]]
    ParseUsedSymbols  = Table[string, array[3,string]]

    CalcResult = object
        result: string
        error: string

    ParseResult = object 
        original_equation: string
        tex: string
        tex_eval: string
        tex_prefix: string
        diff_parts_tex : seq[string]
        error_term_tex: string
        error_term_simplified_tex: string
        error_equation: string
        error_str: string
        used_symbols : ParseUsedSymbols

    CalculateObject  = object 
        original_equation : string
        original_error: string
        values: CalcArrays
        used_symbols: ParseUsedSymbols

    Call = enum 
        RunLatex = 0
        HasLatex = 1
        Write = 2
        Init = 3
        Parse = 4
        Calculate = 5
        SaveSvgAsPng = 6
        GetPngFromSvg = 7

    CallObject = object 
        case call : Call
        of RunLatex, SaveSVGasPNG, Write:
            content,target: string
        of HasLatex:
            discard
        of Init:
            folder: string
        of Parse,Calculate:
            argument : string
        of GetPngFromSvg:
            svgString: string


when defined windows:
    const lateXBins = ["xelatex.exe", "pdflatex.exe"]
else:
    const lateXBins = ["xelatex", "pdflatex"]

template withExecptions(actions: untyped): cstring =
    var output : cstring
    try:
        actions
        output = jTrue
    except:
        output = jFalse
    output

template withOutputExecption(action: untyped): cstring =
    var output : cstring
    try:
        output = action
    except:
        output = jFalse
    output


proc getPdfWs(texData:string):string=
    result = ""
    var 
        pdfData : string
        query : string
    proc pdfQuery(){.async.} =
        try:
            if not wsInit:
                wsSocket = await newWebSocket(wsAddress)
                wsInit = true
            if wsSocket.readyState != Open:
                wsSocket = await newWebSocket(wsAddress)
            await wsSocket.send(query)
            pdfData = await wsSocket.receiveStrPacket()
        except:
            pdfData = ""
    query =  PdfQuery(query: "pdf", tex: texData).toJson
    waitFor pdfQuery()
    if pdfData.len > 0:
        let pdfContentJson = pdfData.fromJson(PdfRecv)
        echo "PDF received"
        result = pdfContentJson.pdf.decode 

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
        echo sys.version
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

proc hasLatexPath():cstring=
    return toJson(getLatexPath()).cstring

proc executeLaTeX(content: string, target: string)=
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
    else:
        echo "Trying remote service"
        let pdf = getPdfWs(content)
        if pdf.len > 0:
            target.writeFile(pdf)

proc writeFileToPath(content: string, target: string)=
    target.writeFile content


proc parse(equation:string):cstring=
    result = parseEquation.parse(equation).to(ParseResult).toJson.cstring


proc calculate(calc:string):cstring=
    #echo calc.fromJson(CalculateObject)
    result = parseEquation.calculate(calc.fromJson(CalculateObject)).to(CalcResult).toJson.cstring

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
        result = PngEncode( result: true, base64: png.encode).toJson.cstring
    except:
        result = PngEncode( result: false, base64: "").toJson.cstring

proc saveSvgAsPng(content: string, target: string)=
    let png = svgToPng(content)
    target.writeFile png

proc callNim*(call: cstring):cstring{.exportc.}=
    #echo "CALLER"
    var calling : CallObject 
    try:
        calling = ($call).fromJson(CallObject)
    except:
        discard

    echo calling
    case calling.call:
    of RunLaTex:
        result = withExecptions: 
            executeLaTeX(calling.content, calling.target)
    of HasLatex:
        result =  hasLatexPath()
    of Write:
        result = withExecptions: 
            writeFileToPath(calling.content, calling.target)
    of Init:
        echo "initializing Python"
        if not scriptLoaded:
            scriptLoaded = loadScript(calling.folder)
            if scriptLoaded:
                echo "Succesfully loaded SymPy"
                result = jTrue
            else:
                echo "Failed to load Sympy"
                result = jFalse
        else:
            echo "Succesfully loaded SymPy"
            result = jTrue
    of Parse:
        result = withOutputExecption: 
            parse(calling.argument)

    of Calculate:
        result = withOutputExecption: 
            calculate(calling.argument)
        
    of SaveSVGasPNG:
        result = withExecptions: 
            saveSvgAsPng(calling.content, calling.target)

    of GetPngFromSvg:
        result = getPngFromSvg(calling.svgString)

