import React, { useEffect } from "react";
import { Text, Button, Center, Divider, Checkbox, Stack,
        VStack, HStack, Select, Box, Spacer, Menu, MenuButton, 
        MenuList, MenuItem} from "@chakra-ui/react";
import SelectTex from "./SelectTex";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { copyToClipboard } from './copy';
import { InlineMath} from 'react-katex';
import SaveTextFile from "./SaveTextFile";
import {runLaTeXCommand} from "./SaveExt";
import { useEquation, useTeX, useTeXSelection } from './stores'
import  { IncludeEquation, IncludeResult, IncludeValues, ErrorEquation, ErrorEquations } from './type.d'
import 'katex/dist/katex.min.css';


const CopySave = () => {
    const equationResult = useEquation((state)=> state.result)
    const equationContent = useEquation((state)=> state.content)
    const teXEquations  = useTeX((state) => state.equations)

    const setIncludeEquation =  useTeXSelection((state) => state.setParsedEquation)
    const errorEquations = useTeXSelection((state) => state.errorEquations)
    const setErrorEquations = useTeXSelection((state) => state.setErrorEquations)
    const setIncludeResult = useTeXSelection((state) => state.setResults)


    const selectErrorEquations = (event :React.FormEvent<HTMLDivElement> )  => {
        let eventTarget = event.target as HTMLInputElement
        let eName = eventTarget.name as ErrorEquation
        if(eName){
            setErrorEquations( eName, eventTarget.checked)
        }
    }

    const toIncludes = (event : React.FormEvent<HTMLDivElement>) => {
        let eventTarget = event.target as HTMLInputElement
        let inclResult = eventTarget.value as IncludeResult
        if(inclResult){
            setIncludeResult(inclResult)
        }      
    }
    const toIncludeEquation = (event: React.FormEvent<HTMLDivElement>) =>{
        let eventTarget = event.target as HTMLInputElement
        let includeEquation = eventTarget.value as IncludeEquation
        if(includeEquation){
            setIncludeEquation(includeEquation)
        }
    }

    const constructTeXFile = (e: any = null):string => {
        //console.log(teXEquations)
        const insertBlocks = (eq:string):string => {
            return `\\begin{equation}\n${eq}\n\\end{equation}`;
        }
        const toMultiLine = (text:string):string => {
            return text.replace('\\begin{equation}','\\begin{multline}').replace('\\end{equation}',
                                '\\end{multline}').replace('} =','} \\\\=').replace('} =','} \\\\=')
        }
        
        let prefix = (equationContent.tex_prefix)? equationContent.tex_prefix + ' = ':'';
        let teXLines = [
            '\\documentclass[]{report} ',
            '\\usepackage{amsmath}',
            '\\begin{document}',
            `\\title{Evaluation of $ ${prefix} ${equationContent.tex} $}`,
            '\\author{}',
            '\\maketitle',
            "\\chapter*{}", 
            '\\section*{Evaluation}',
        ];
    
        if(teXEquations.parsed_equation){
            teXLines.push('Evaluated equation');
            teXLines.push(insertBlocks(teXEquations.parsed_equation));
        }
        if(teXEquations.error_equations.length > 0 && (teXEquations.error_equations_parts.base.length === 0)){
            teXLines.push('Evaluated error equation');
            teXLines.push(toMultiLine(insertBlocks(teXEquations.error_equations)));
        }
        if(teXEquations.error_equations_parts.base.length > 0){
            teXLines.push('Evaluated error in parts');
            if(teXEquations.error_equations_parts.base){
                teXLines.push(toMultiLine(insertBlocks(teXEquations.error_equations_parts.base)));
            }
            teXLines.push('Evaluated parts');
            for(const item of teXEquations.error_equations_parts.parts){
                teXLines.push(insertBlocks(item));
            }
        }
        if(teXEquations.result.evaluated.length > 0){
            teXLines.push('Entries');
            for(const item of teXEquations.result.entry){
                teXLines.push(insertBlocks(item));
            }
            teXLines.push('Result');
            teXLines.push(insertBlocks(teXEquations.result.evaluated));
        }
        teXLines.push('\\end{document}');
        return teXLines.join('\n');
    }

    const copyLaTeXCode = async() => {
        await copyToClipboard(constructTeXFile())
    }

    useEffect (() => {
        if(equationResult.result.length > 0){
            setIncludeResult(IncludeResult.ResultError)
        }else{
            setIncludeResult(IncludeResult.None)
        }
    },[equationResult])
 
    return ( 
        <>
            <Box 
                bg={"gray.50"} 
                w="100%" 
            >
                <Divider/>
                <Box>
                <Center  >
                    <VStack>
                    <HStack 
                        mt={"4px"} 
                        spacing={"1.5%"}
                    >
                        <Button 
                            m={"4px"} 
                            bg={"gray.200"} 
                            onClick={() => copyLaTeXCode()}
                        >
                            Copy <InlineMath>{' \\LaTeX'}</InlineMath> Code to a Clipboard
                        </Button>
                        <Button  
                            bg={"gray.200"} 
                            onClick={() => {SaveTextFile(constructTeXFile(), ["tex"], "TeX")}}
                        >
                            <Text 
                                m={"4px"}
                            >
                                Save as a <InlineMath>{'\\LaTeX'}</InlineMath> file
                            </Text>
                        </Button>
                        <Button  
                            bg={"gray.200"} 
                            onClick={()=>runLaTeXCommand(constructTeXFile())
                        }>
                            <Text 
                                m={"4px"} 
                            >
                                Save as a PDF
                            </Text>
                        </Button>
                    </HStack>
                    <Divider/>
                    <Stack 
                        spacing={5} 
                        direction='row' 
                        bg={"#FEFCFF"} 
                        rounded="xl"
                    >
                        <Spacer/>
                        <HStack 
                            onChange={(event) => event && toIncludeEquation(event)}
                        >
                            <Text>
                                Include equation
                            </Text>
                            <Select  
                                name="selection"  
                                bg={"gray.100"}
                            >
                                { (equationContent.tex !== equationContent.tex_eval) && <>
                                <option 
                                    value={IncludeEquation.EquationSimplified}
                                >
                                    Equation & Simplified
                                </option>
                                <option 
                                    value={IncludeEquation.Equation}
                                >
                                    Equation
                                </option>
                                <option 
                                    value={IncludeEquation.None}
                                >
                                    None
                                </option>
                                </>}
                                {(equationContent.tex === equationContent.tex_eval) && <>
                                <option 
                                    value={IncludeEquation.Equation}
                                >
                                    Equation
                                </option>
                                <option 
                                    value={IncludeEquation.None}
                                >
                                    None
                                </option>
                                </>}
                                
                                
                            </Select>
                        </HStack>
                        <HStack>
                            <Text>Error equations</Text>
                            <Box onClick={(e) => {e && selectErrorEquations(e)}}>
                                <Menu  closeOnSelect={false} >
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
                                                    name={ErrorEquation.Construction}
                                                    isChecked={errorEquations[ErrorEquation.Construction]} 
                                                >
                                                Construction
                                            </Checkbox>
                                        </MenuItem>
                                        <MenuItem bg={"gray.100"}>
                                            <Checkbox 
                                                    name={ErrorEquation.Basic} 
                                                    isChecked={errorEquations[ErrorEquation.Basic]} 
                                                >
                                                Basic
                                            </Checkbox>
                                        </MenuItem>
                                        { (equationContent.error_term_simplified_tex !== equationContent.error_term_tex) &&
                                        <MenuItem bg={"gray.100"}>
                                            <Checkbox 
                                                    name={ErrorEquation.Simplified}  
                                                    isChecked={errorEquations[ErrorEquation.Simplified]} 
                                                >
                                                Simplified
                                            </Checkbox>
                                        </MenuItem>}
                                        <MenuItem bg={"gray.100"}>
                                            <Checkbox 
                                                    name={ErrorEquation.Parts}  
                                                    isChecked={errorEquations[ErrorEquation.Parts]} 
                                            >
                                                Parts
                                            </Checkbox>
                                        </MenuItem>                            
                                    </MenuList>
                                </Menu>
                            </Box>
                        </HStack>
                        <HStack onChange={(event) => event && toIncludes(event)}>
                            <Text>Include results</Text>
                            <Select  
                                name="selection" 
                                isDisabled={!(equationResult.result.length > 0)} 
                                bg={"gray.100"}
                            >
                                <option 
                                    value={IncludeResult.ResultError}
                                >
                                    Result & Error
                                </option>
                                <option 
                                    value={IncludeResult.Result}
                                >
                                    Result
                                </option>
                                <option 
                                    value={IncludeResult.None}
                                >
                                    None
                                </option>
                            </Select>
                        </HStack>
                        <Spacer/>
                    </Stack>
                </VStack>
                </Center>
            </Box>
            <Divider/>
        </Box>
        <SelectTex/>
    </>
    )
}

export default CopySave;
