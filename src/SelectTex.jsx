 
import { useEffect, useContext } from "react";
import { EquationContext } from "./EquationContext";
const SelectTex = (props) => {
    const { equation, evaluated, texEquations, setTexEquations, equationValues  } = useContext(EquationContext);
    useEffect(() =>{
        const settings = props.teXSettings;
        let parsed_equation = null;
        let result = null;
        if(settings.include_equation !== "none" ){
            if(settings.include_equation === "equation_simplified"){
                if(equation.tex !== equation.tex_eval){
                    parsed_equation =`${equation.tex_prefix} = ${equation.tex} = ${equation.tex_eval}` ;
                }else{
                    parsed_equation = `${equation.tex_prefix} = ${equation.tex}`;
                }
            }else {
                parsed_equation = `${equation.tex_prefix} = ${equation.tex}`;
            }
        }
        let error_equations = null;
        let error_equations_parts = null;
        if (settings.error_equation){
            const error_equation = settings.error_equation;
            let construction = "";
            if(error_equation.construction){
                construction = `${equation.error_equation} =`;
            }
            if(error_equation.parts){
                error_equations_parts = {base: null, parts: null};
                let  parts_eq = `\\sqrt{`;
                let eq_parts = [];
                let count = 1;
                let sumParts = [];
                for(const item of equation.diff_parts_tex){
                    sumParts.push(` \\left( \\Delta_${count} \\right)^2`)
                    eq_parts.push(`\\Delta_${count} = ${item}`);
                    count++;
                }
                parts_eq = parts_eq + sumParts.join(' + ');
                parts_eq = parts_eq + "}";
                error_equations_parts.base = `${equation.tex_error_prefix} = ${construction} ${parts_eq}`;
                error_equations_parts.parts = eq_parts;
                
            }
            if(error_equation.basic && error_equation.simplified && (equation.basic === equation.simplified)){
                error_equations = `${equation.tex_error_prefix} = ${construction} ${equation.error_term_tex} = ${equation.error_term_simplified_tex}`;
            }else{
                error_equations = `${equation.tex_error_prefix} = ${construction} ${equation.error_term_tex}`;
            }
        }
        if(settings.include_result !== "none" && evaluated){
            let replaceMap = new Map();
            for(const key in equation.used_symbols){
                let l = equation.used_symbols[key];
                replaceMap.set(  l[0], l[2]);
            }
            let entryData = [];
            
            for (const [key, value] of Object.entries(equationValues)) {
                let item = replaceMap.get(key) ;
                entryData.push(`${item} \\pm \\delta ${item} = ${value[0]} \\pm ${value[1]}`);
            }
            let evaluatedTex = null;
            if(evaluated){
                evaluatedTex = `${equation.tex_prefix} \\pm \\delta ${equation.tex_prefix} = ${evaluated.result} \\pm ${evaluated.error}`;
            }
            
            result = {entry: entryData, evaluated: evaluatedTex};
        }

        setTexEquations({
                            parsed_equation: parsed_equation, 
                            error_equations: error_equations, 
                            error_equations_parts: error_equations_parts, 
                            result: result
                        })
    },[props.teXSettings, evaluated, equation])
    useEffect(() => {
        console.log(texEquations)
    },[texEquations])
}

export default SelectTex;