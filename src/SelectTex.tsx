import React, { useEffect } from "react";
import { useTeX, useTeXSelection, useEquation, emptyResult } from "./stores";
import {  IncludeEquation, IncludeResult } from './type.d'

const SelectTex = () => {
    const equationContent = useEquation((state)=> state.content)
    const equationResult = useEquation((state)=> state.result)
    const equationValues = useEquation((state)=> state.values)
    const teXSetEquations = useTeX((state) => state.setEquations)

    const includeEquation = useTeXSelection((state) => state.parsedEquation)
    const errorEquations = useTeXSelection((state) => state.errorEquations)
    const includeValues = useTeXSelection((state) => state.values)
    const includeResult = useTeXSelection((state) => state.results)

    useEffect(() =>{
        let parsed_equation : string ="" ;
        let result = emptyResult
        if(includeEquation !== IncludeEquation.None ){
            if(includeEquation === IncludeEquation.EquationSimplified){
                if(equationContent.tex !== equationContent.tex_eval){
                    parsed_equation =`${equationContent.tex_prefix} = ${equationContent.tex} = ${equationContent.tex_eval}` ;
                }else{
                    parsed_equation = `${equationContent.tex_prefix} = ${equationContent.tex}`;
                }
            }else {
                parsed_equation = `${equationContent.tex_prefix} = ${equationContent.tex}`;
            }
        }

        let error_equations : string ='' ;
        let error_equations_parts : Parts = { base: '', parts : [] };
        
        if (errorEquations){
            //console.log(errorEquations)
            const error_equation = errorEquations;
            let construction = "";

            if(error_equation.construction){
                construction = `${equationContent.error_equation} =`;
            }
            if(error_equation.parts){
                error_equations_parts = {base: '', parts : []};
                let  parts_eq = `\\sqrt{`;
                let eq_parts : Array<string> = [];
                let count = 1;
                let sumParts: Array<string> = [];
                for(const item of equationContent.diff_parts_tex){
                    sumParts.push(` \\left( \\Delta_${count} \\right)^2`)
                    eq_parts.push(`\\Delta_${count} = ${item}`);
                    count++;
                }
                parts_eq = parts_eq + sumParts.join(' + ');
                parts_eq = parts_eq + "}";
                error_equations_parts.base = `\\delta ${equationContent.tex_prefix} = ${construction} ${parts_eq}`;
                error_equations_parts.parts = eq_parts;
            }
            if(error_equation.basic && error_equation.simplified && (equationContent.error_term_tex === equationContent.error_term_simplified_tex)){
                error_equations = `\\delta ${equationContent.tex_prefix} = ${construction} ${equationContent.error_term_tex} = ${equationContent.error_term_simplified_tex}`;
            }else{
                error_equations = `\\delta ${equationContent.tex_prefix} = ${construction} ${equationContent.error_term_tex}`;
            }
        }
        if(includeResult !== IncludeResult.None ) {
            let replaceMap = new Map<string,string>();
            for(const key in equationContent.used_symbols){
                let l = equationContent.used_symbols[key];
                replaceMap.set(  l[0], l[2]);
            }
            let entryData : Array<string>= [];
            
            for (const [key, value] of Object.entries(equationValues)) {
                let item = replaceMap.get(key) ;
                if(item){
                    entryData.push(`${item} \\pm \\delta ${item} = ${value[0]} \\pm ${value[1]}`);
                }
            }
            let evaluatedTex : null | string = null;
            if(equationResult.result.length >0 && equationContent.original_equation.length > 0){
                evaluatedTex = `${equationContent.tex_prefix} \\pm \\delta ${equationContent.tex_prefix} = ${equationResult.result} \\pm ${equationResult.error}`;
            }
            if(evaluatedTex){
                result = {entry: entryData, evaluated: evaluatedTex};
            }
            
        }
        // console.log({
        //     includeEquation: includeEquation, 
        //     errorEquations: errorEquations, 
        //     includeValues: includeValues, 
        //     includeResult: includeResult,
        // })
        // console.log(
        //     {
        //         parsed_equation: parsed_equation, 
        //         error_equations: error_equations, 
        //         error_equations_parts: error_equations_parts, 
        //         result: result 
        //     }
        // )
        teXSetEquations({
                            parsed_equation: parsed_equation, 
                            error_equations: error_equations, 
                            error_equations_parts: error_equations_parts, 
                            result: result 
                        })
    },[includeEquation, errorEquations, includeValues, includeResult])

    return (<></>)
}

export default SelectTex;