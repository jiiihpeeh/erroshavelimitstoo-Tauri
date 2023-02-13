import React from "react";
import { Text, VStack, HStack, Tooltip } from "@chakra-ui/react";
import { QuestionIcon } from '@chakra-ui/icons'
import { InlineMath } from 'react-katex';
import { useEquation } from "./stores";
import 'katex/dist/katex.min.css';
const ShowResult = () => {
    const equationResultDisplay = useEquation((state)=> state.displayResult)

    return(
            <VStack 
                bg={"teal.50"} 
                m="1%"
            >
                <Text as='b'>
                    Result 
                </Text>
                <Text>
                    <HStack>
                    <InlineMath>
                        {equationResultDisplay}
                    </InlineMath>
                    <Tooltip 
                        label="SymPy evaluation is not going to track plausible division by zero"
                    >
                        <QuestionIcon/>
                    </Tooltip>
                    </HStack>
                </Text>

            </VStack>
        )
}
export default ShowResult;