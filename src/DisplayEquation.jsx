import {Box, Center, VStack, Text } from '@chakra-ui/react'
import { EquationContext } from './EquationContext';
import { useContext, useEffect, useState } from 'react';
import KaTeXBlockContext from './KaTeXBlockContext';
import 'katex/dist/katex.min.css';

const DisplayEquation = () => {
    const [renderedEquation, setRenderedEquation] = useState('')
    const { equation } = useContext(EquationContext);
    useEffect(() => {
        let eqStr = ''
        if(equation.tex === equation.tex_eval){
            eqStr = equation.tex
        }else{
            eqStr = `${equation.tex} = ${equation.tex_eval}`
        }
        if(equation.tex_prefix !== ''){
            eqStr = `${equation.tex_prefix} = ${eqStr}`
        }
        setRenderedEquation(eqStr)
      },[equation, setRenderedEquation])

    return (<>
        <Box m={"10px"} >
        <Center>
        <VStack>
            <Text  m={"10px"}>
                Parsed Equation
            </Text>
            <KaTeXBlockContext equation={renderedEquation}/>
        </VStack>
        </Center>
        </Box>
        </>
    )
}
export default DisplayEquation;