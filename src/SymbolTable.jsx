import { Table, Thead, Th, Tr, Td, Tbody, Input, Center, Button, Text, VStack, Box } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { EquationContext } from "./EquationContext";
import { CommunicatorContext } from "./CommunicatorContext";
import ShowResult from "./ShowResult";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
const SymbolTable = () => {
    const { equation, evaluated, setEvaluated, equationValues, setEquationValues } = useContext(EquationContext);
    const { communicate, setCommunicate } = useContext(CommunicatorContext);

    const [ table, setTable ] = useState([]);
    const [ symbolValues, setSymbolValues ] = useState({});
    const [ symbolErrorValues, setSymbolErrorValues ] = useState({});
    const [ inputsAreNumbers, setInputsAreNumbers ] = useState(false);
    
    const isNumber = (s) => {
        return /^\s*[-+]?((\d+(\.\d+)?)|(\d+\.)|(\.\d+))(e[-+]?\d+)?\s*$/.test(s) && (parseFloat(s) >= 0); 
    }
    const onChangeSymbol = (event) => {
        setSymbolValues((symbolValues) => {
            return {
                ...symbolValues,
                [event.target.name] : event.target.value 
            };
        })
    }
    const onChangeSymbolError = (event) => {
        setSymbolErrorValues((symbolErrorValues) => {
            return {
                ...symbolErrorValues,
                [event.target.name] : event.target.value 
            };
        })
    }
    const formulateNumbers = (number) => {
        let numberStr = [null, undefined].includes(number) ? 'NaN': `${number}`.replace('e+','e');
        if(numberStr.indexOf('e') !== -1){
            numberStr= numberStr.replace('e','\\cdot 10^{') +'}';
        }
        return numberStr;
    }
    const calculate = async () => {
        console.log("calculating", equationValues);
        let postValues =  { 
            original_equation:equation.original_equation,
            original_error: equation.error_str,
            values: equationValues,
            used_symbols:equation.used_symbols
        }
        setCommunicate({ ...communicate, processTable: postValues })
        // try{
        //     let res = await axios.post(`${server}/calculate`, postValues);
        //     console.log(res.data);
        //     let calculated = {};
        //     calculated.result = formulateNumbers(res.data.result);
        //     calculated.error = formulateNumbers(res.data.error);
        //     setEvaluated(calculated);
        // }catch(err){
        //     setEvaluated(null);
        // }            
    }

    useEffect(()=> {
        let tableComponents = [];
        for (const symbol in equation.used_symbols){
            tableComponents.push(<Tr key={`symbol-${symbol}`}>
                                    <Td>
                                        <Box>
                                            <InlineMath>{`${equation.used_symbols[symbol][2]}`}</InlineMath> 
                                        </Box>
                                    </Td>
                                    <Td>
                                        <Input 
                                            type="text"
                                            value ={symbolValues[symbol]||0}
                                            name={symbol}
                                            onChange={onChangeSymbol}
                                            color={(isNumber(symbolValues[symbol]))?"black":"red"}
                                            placeholder="0"
                                        />
                                    </Td>
                                    <Td>
                                        <Box>
                                            <InlineMath>{`\\delta ${equation.used_symbols[symbol][2]}`}</InlineMath> 
                                        </Box>
                                    </Td>
                                    <Td>
                                        <Input 
                                            type="text"
                                            value ={symbolErrorValues[symbol]||0}
                                            name={symbol}
                                            onChange={onChangeSymbolError}
                                            color={(isNumber(symbolErrorValues[symbol]))?"black":"red"}
                                            placeholder="0"
                                        />
                                    </Td>
                                </Tr>)
        }
        setTable(tableComponents);
    },[equation,symbolValues, symbolErrorValues])
    useEffect(() =>{
        let initialValues = {};
        for (const symbol in equation.used_symbols){
            initialValues[symbol]=0.0;
        }
        setSymbolValues(initialValues);
        setSymbolErrorValues(initialValues);
    },[equation])
    useEffect(() => {
        let numberStatus = true;
        let values = new Map();
        for(const valueObj of [symbolValues, symbolErrorValues]){
            for(const obj in valueObj){
                if(!isNumber(valueObj[obj])){
                    numberStatus = false;
                    break;
                }
                if(!values.has(obj)){
                    values.set(obj, [parseFloat(valueObj[obj])]);
                }else{
                    values.set(obj, [...values.get(obj), parseFloat(valueObj[obj])]);
                }
            }
        }
        setInputsAreNumbers(numberStatus);
        setEquationValues(Object.fromEntries(values));
    },[symbolValues, symbolErrorValues])
    // useEffect(()=>{
    //     console.log(equationValues)
    // },[equationValues])
    return(
        <Center>
        <form>
        <Table>
            <Thead>
                <Tr>
                    <Th>
                    </Th>
                    <Th>
                        Variable value
                    </Th>
                    <Th>
                    </Th>
                    <Th>
                        Variable error value
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                {table}
            </Tbody>
        </Table>
        
        <VStack>            
            {evaluated &&
            <ShowResult/>
            }
        <Center>
            <Button 
                m={"5px"} 
                isDisabled={!inputsAreNumbers} 
                onClick={calculate}
            >
                Calculate
            </Button>
        </Center></VStack>
        </form>
        </Center>
        
    )
}

export default SymbolTable;