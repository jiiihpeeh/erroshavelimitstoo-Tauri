import React from 'react'
import { Box } from "@chakra-ui/react";
import SymbolTable from './SymbolTable';
import ErrorTabs from './ErrorTabs';
import DisplayEquation from './DisplayEquation';
import Communicator from './Communicator';
import CopySave from './CopySave';
import BaseEquation from './BaseEquation';
import { useEquation } from './stores'
import Settings from "./Settings";


export default function App() {
 const equationContent = useEquation((state)=> state.content)
  return (
        <>
          <Communicator/>
            <Box>
              <Box>
                { equationContent.tex && equationContent.tex.length > 0 &&<>
                    <CopySave/>
                </>}
                <BaseEquation/>
              </Box>
              <Box as="main">
                { equationContent.tex && equationContent.tex.length > 0 &&
                <>
                  <DisplayEquation/>
                  <ErrorTabs/>
                  <SymbolTable/>
                </>}
              </Box>
            </Box>
          <Settings/>
        </>
  );
}
