import { Box, Center, VStack, Text } from '@chakra-ui/react'
import React from 'react';
import KaTeXBlockContext from './KaTeXBlockContext';
import { useEquation } from './stores';
import 'katex/dist/katex.min.css';

const DisplayEquation = () => {
    const equationDisplay = useEquation((state)=> state.display)

    return (
        <>
            <Box 
                m={"10px"}
            >
                <Center>
                    <VStack>
                        <Text  
                            m={"10px"}
                        >
                            Parsed Equation
                        </Text>
                        <KaTeXBlockContext 
                            equation={equationDisplay}
                        />
                    </VStack>
                </Center>
            </Box>
        </>
    )
}
export default DisplayEquation;