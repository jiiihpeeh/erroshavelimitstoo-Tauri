import { EquationContext } from "./EquationContext";
import { useContext, useEffect , useState} from "react";
import { Text, Button, Center, Divider, Checkbox, Stack,
        VStack, HStack, Select, Box, Spacer, Menu, MenuButton, 
        MenuList, MenuItem} from "@chakra-ui/react";
import SelectTex from "./SelectTex";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { copyToClipboard, copyBlobToClipboard} from './copy';
import { InlineMath} from 'react-katex';
import SaveTextFile from "./SaveTextFile";
import {runLaTeXCommand} from "./SaveExt";
import 'katex/dist/katex.min.css';


const CopySave = () => {
    const [ includeEquation, setIncludeEquation ] = useState('equation_simplified');
    const [ errorEquations, setErrorEquations ] = useState({ simplified: true, basic: true, construction: true, parts: false});
    const [ includeValues, setIncludeValues ] = useState('values_error');
    const [ includeResult, setIncludeResult ] = useState('none');
    const [ teXSettings,  setTeXSettings] = useState({});
    

    const { equation, evaluated,  texEquations } = useContext(EquationContext);

    const selectErrorEquations = (event) => {
        if(event.target.name ){
            setErrorEquations((errorEquations)=>{
                return { ...errorEquations, [event.target.name]: event.target.checked}
            })
        }
    }

    const constructTeXFile = () => {
        const insertBlocks = (eq) => {
            return `\\begin{equation}\n${eq}\n\\end{equation}`;
        }
        const toMultiLine = (text) => {
            return text.replace('\\begin{equation}','\\begin{multline}').replace('\\end{equation}','\\end{multline}').replace('} =','} \\\\=').replace('} =','} \\\\=')
        }
        let prefix = (equation.tex_prefix)? equation.tex_prefix + ' = ':'';
        let teXLines = [
            '\\documentclass[]{report} ',
            '\\usepackage{amsmath}',
            '\\begin{document}',
            `\\title{Evaluation of $ ${prefix} ${equation.tex} $}`,
            '\\author{}',
            '\\maketitle',
            "\\chapter*{}", 
            '\\section*{Evaluation}',
        ];
        if(texEquations.parsed_equation){
            teXLines.push('Evaluated equation');
            teXLines.push(insertBlocks(texEquations.parsed_equation));
        }
        if(texEquations.error_equations && !texEquations.error_equations_parts){
            teXLines.push('Evaluated error equation');
            teXLines.push(toMultiLine(insertBlocks(texEquations.error_equations)));
        }
        if(texEquations.error_equations_parts){
            teXLines.push('Evaluated error in parts');
            teXLines.push(toMultiLine(insertBlocks(texEquations.error_equations_parts.base)));
            teXLines.push('Evaluated parts');
            for(const item of texEquations.error_equations_parts.parts){
                teXLines.push(insertBlocks(item));
            }
        }
        if(texEquations.result){
            teXLines.push('Entries');
            for(const item of texEquations.result.entry){
                teXLines.push(insertBlocks(item));
            }
            teXLines.push('Result');
            teXLines.push(insertBlocks(texEquations.result.evaluated));
        }
        teXLines.push('\\end{document}');
        //console.log(teXLines.join('\n'))
        return teXLines.join('\n');
    }


    const copyLaTeXCode = () => {
        //console.log(constructTeXFile())
        copyToClipboard(constructTeXFile())
    }

    useEffect (() => {
        if(evaluated){
            setIncludeResult("result_error")
        }else{
            setIncludeResult("none")
        }
    },[evaluated])
    useEffect(()=>{
        setTeXSettings({
                        include_equation: includeEquation, 
                        error_equation: errorEquations, 
                        include_values: includeValues, 
                        include_result: includeResult
                    })
    },[includeResult, errorEquations,  includeValues, includeEquation])
    return ( 
        <>
        <Box bg={"gray.50"} w="100%" >
            <Divider/>
            <Box >
            <Center  >
                <VStack>
                <HStack mt={"4px"} spacing={"1.5%"}>

                    <Button m={"4px"} bg={"gray.200"} onClick={() => copyLaTeXCode(constructTeXFile())}>
                        Copy <InlineMath>{' \\LaTeX'}</InlineMath> Code to a Clipboard
                    </Button>
                    <Button  bg={"gray.200"} onClick={() => {SaveTextFile(constructTeXFile(), ["tex"], "TeX")}}>
                        <Text m={"4px"}>
                            Save as a <InlineMath>{'\\LaTeX'}</InlineMath> file
                        </Text>
                    </Button>
                    <Button  bg={"gray.200"} onClick={()=>runLaTeXCommand(constructTeXFile())}>
                        <Text m={"4px"} >
                            Save as a PDF
                        </Text>
                    </Button>
                </HStack>
                <Divider/>
                <Stack spacing={5} direction='row' bg={"#FEFCFF"} rounded="xl">
                    <Spacer/>
                    <HStack onChange={(event) => setIncludeEquation(event.target.value)}>
                        <Text>Include equation</Text>
                        <Select  name="selection"  bg={"gray.100"}>
                            { (equation.tex !== equation.tex_eval) && <>
                            <option value='equation_simplified'>Equation & Simplified</option>
                            <option value='equation'>Equation</option>
                            <option value='none'>None</option>
                            </>}
                            {(equation.tex === equation.tex_eval) && <>
                            <option value='equation'>Equation</option>
                            <option value='none'>None</option>
                            </>}
                            
                            
                        </Select>
                    </HStack>
                    <HStack>
                        <Text>Error equations</Text>
                        <Box onClick={selectErrorEquations}>
                            <Menu bg={"gray.100"} closeOnSelect={false} mb={"4px"}>
                                <MenuButton 
                                        as={Button} 
                                        fontWeight='normal'
                                        mt={"4px"}
                                    >
                                    Error Equations <ChevronDownIcon/>
                                </MenuButton>
                                <MenuList bg={"gray.100"}>
                                    <MenuItem bg={"gray.100"}> 
                                        <Checkbox 
                                                name="construction" 
                                                isChecked={errorEquations["construction"]} 
                                            >
                                            Construction
                                        </Checkbox>
                                    </MenuItem>
                                    <MenuItem bg={"gray.100"}>
                                        <Checkbox 
                                                name="basic" 
                                                isChecked={errorEquations["basic"]} 
                                            >
                                            Basic
                                        </Checkbox>
                                    </MenuItem>
                                    { (equation.error_term_simplified_tex !== equation.error_term_tex) &&
                                    <MenuItem bg={"gray.100"}>
                                        <Checkbox 
                                                name="simplified"  
                                                isChecked={errorEquations["simplified"]} 
                                            >
                                            Simplified
                                        </Checkbox>
                                    </MenuItem>}
                                    <MenuItem bg={"gray.100"}>
                                        <Checkbox 
                                                name="parts" 
                                                isChecked={errorEquations["parts"]} 
                                            >
                                            Parts
                                        </Checkbox>
                                    </MenuItem>                            
                                </MenuList>
                            </Menu>
                        </Box>
                    </HStack>
                    <HStack onChange={(event) => setIncludeResult(event.target.value)}>
                        <Text>Include results</Text>
                        <Select  name="selection" isDisabled={!evaluated} bg={"gray.100"}>
                            <option value='result_error'>Result & Error</option>
                            <option value='result'>Result</option>
                            <option value='none'>None</option>
                        </Select>
                    </HStack>
                    <Spacer/>
                </Stack>
            </VStack>
            </Center>
        </Box>
        <Divider/>
    </Box>
    <SelectTex teXSettings={teXSettings}/>
    </>
    )
}

export default CopySave;
