import { useContext } from "react";
import { Text, VStack, HStack, Tooltip } from "@chakra-ui/react";
import { QuestionIcon } from '@chakra-ui/icons'
import { EquationContext } from "./EquationContext";
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const ShowResult = () => {
    const { evaluated, equation } = useContext(EquationContext);
    return(
            <VStack bg={"teal.50"} m="1%">
                <Text as='b'>
                    Result
                </Text>
                <Text>
                    <HStack>
                    <InlineMath>
                        {`${equation.tex_prefix} \\pm \\delta ${equation.tex_prefix} = ${evaluated.result} \\pm ${evaluated.error}`}
                    </InlineMath>
                    <Tooltip label="SymPy evaluation is not going to track plausible division by zero">
                        <QuestionIcon/>
                    </Tooltip>
                    </HStack>
                </Text>

            </VStack>
        )
}
export default ShowResult;
