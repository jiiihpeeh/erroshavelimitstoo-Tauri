import {useState, useEffect, useRef} from 'react'
import {   Box  } from "@chakra-ui/react";
import { EquationContext } from './EquationContext' 
import { CommunicatorContext } from './CommunicatorContext';
import SymbolTable from './SymbolTable';
import ErrorTabs from './ErrorTabs';
import DisplayEquation from './DisplayEquation';
import Communicator from './Communicator';
import CopySave from './CopySave';
import BaseEquation from './BaseEquation';
import SetPython from './SetPython';

export default function App() {
  const [ sympy, setSympy ] = useState("");
  const emptyEquation = { tex:'', tex_eval:'', tex_prefix:'', symbols : [], error_term_tex: ''}
  const [ equation, setEquation ] = useState(emptyEquation);
  const [ evaluated, setEvaluated ] = useState(null);
  const [ communicate, setCommunicate ] = useState({ parseEquation: null, processTable : null,  fetchSvg: null, fetchPdf: null});
  const [ texEquations, setTexEquations ] = useState({parsed_equation: null, error_equations: null, error_equations_parts: null, result: null})
  const [ equationValues, setEquationValues ] = useState({});
  const [ isReady, setIsReady ] = useState(false);
  const [python, setPython] = useState(null);

  useEffect(()=>{
    console.log('python: ',python)
  ,[python]})
  return (
      <EquationContext.Provider value={{sympy, setSympy, equation, setEquation, emptyEquation, evaluated, setEvaluated,  texEquations, setTexEquations, equationValues, setEquationValues }}>
      <CommunicatorContext.Provider value={{ communicate, setCommunicate, isReady, setIsReady, python, setPython }}>
          <Communicator/>
        <Box>
          {/* <Box as="header" position="fixed" w="100%" backgroundColor="white" mt="0px"> */}
          <Box>
            { equation && equation.tex && equation.tex.length > 0 &&<>
                <CopySave/>
            </>}

            <BaseEquation/>
          </Box>
          <Box as="main">
            { equation && equation.tex && equation.tex.length > 0 &&
            <>
              <DisplayEquation/>
              <ErrorTabs/>
              <SymbolTable/>
            </>}
          </Box>
        </Box>
        <SetPython/>
      </CommunicatorContext.Provider>
      </EquationContext.Provider>
  );
}
