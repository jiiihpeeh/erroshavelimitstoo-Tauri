import { Table, Thead, Th, Tr, Td, Tbody, Input,
     Center, Button, VStack, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ShowResult from "./ShowResult";
import { InlineMath } from 'react-katex';
import { useCommunicate, useErrorSymbol, useSymbol, useEquation } from "./stores";
import { Command } from "./type.d";
import 'katex/dist/katex.min.css';

const SymbolTable = () => {
    const equationResult = useEquation((state)=> state.result)
    const equationContent = useEquation((state)=> state.content)
    const equationValues = useEquation((state)=> state.values)
    const equationSetValues = useEquation((state)=> state.setValues)
    const setMessageValue = useCommunicate((state)=> state.setValue)
    const symbolsValues = useSymbol((state) => state.values)
    const errorSymbolsValues = useErrorSymbol((state) => state.values)
    const symbolsSetValue = useSymbol((state) => state.setValue)
    const errorSymbolsSetValue = useErrorSymbol((state) => state.setValue)
    const symbolsSetValues = useSymbol((state) => state.setValues)
    const errorSymbolsSetValues = useErrorSymbol((state) => state.setValues)
    const [ table, setTable ] = useState<Array<any>>([]);


    const [ inputsAreNumbers, setInputsAreNumbers ] = useState(false);
    
    const isNumber = (s:string):boolean => {
        return /^\s*[-+]?((\d+(\.\d+)?)|(\d+\.)|(\.\d+))(e[-+]?\d+)?\s*$/.test(s) && (parseFloat(s) >= 0); 
    }
    const onChangeSymbol = (event: OnChangeEvent, command: ValueSetter ):void => {
        if(!event){
            return
        }
        command(event.target.name, event.target.value)
    }
    const calculate = async () => {
        if(!equationContent.used_symbols){
            return
        }
        //console.log("calculating", equationValues);
        let postValues =  { 
            original_equation: equationContent.original_equation,
            original_error: equationContent.error_str,
            values: equationValues,
            used_symbols: equationContent.used_symbols
        }
        setMessageValue( Command.Calculate, postValues )
    }

    useEffect(()=> {
        if(!equationContent){
            return
        }
        let tableComponents : Array<any> = []
        for (const symbol in equationContent.used_symbols){
            tableComponents.push(<Tr key={`symbol-${symbol}`}>
                                    <Td>
                                        <Box>
                                            <InlineMath>{`${equationContent.used_symbols[symbol][2]}`}</InlineMath> 
                                        </Box>
                                    </Td>
                                    <Td>
                                        <Input 
                                            type="text"
                                            value ={symbolsValues[symbol]||0}
                                            name={symbol}
                                            onChange={(e) => onChangeSymbol(e, symbolsSetValue)}
                                            color={isNumber(symbolsValues[symbol])?"black":"red"}
                                            //placeholder="0"
                                        />
                                    </Td>
                                    <Td>
                                        <Box>
                                            <InlineMath>{`\\delta ${equationContent.used_symbols[symbol][2]}`}</InlineMath> 
                                        </Box>
                                    </Td>
                                    <Td>
                                        <Input 
                                            type="text"
                                            value ={errorSymbolsValues[symbol]||0}
                                            name={symbol}
                                            onChange={(e) => onChangeSymbol(e, errorSymbolsSetValue)}
                                            color={isNumber(errorSymbolsValues[symbol])?"black":"red"}
                                            //placeholder="0"
                                        />
                                    </Td>
                                </Tr>)
        }
        setTable(tableComponents);
    },[equationContent,symbolsValues, errorSymbolsValues ])
    useEffect(() =>{
        let initialValues: SymbolObject = {};
        for (const symbol in equationContent.used_symbols){
            if(symbol){
                initialValues[symbol]="0.0";
            }
        }
        let inv = initialValues
        symbolsSetValues(inv);
        errorSymbolsSetValues(inv);
    },[equationContent])
    useEffect(() => {
        let numberStatus = true;
        let values = new Map<string,Array<number>>();
        for(const valueObj of [symbolsValues, errorSymbolsValues]){
            for(const obj in valueObj){
                if(!isNumber(valueObj[obj])){
                    numberStatus = false;
                    break;
                }
                if(!values.has(obj)){
                    values.set(obj, [parseFloat(valueObj[obj])]);
                }else{
                    let n = values.get(obj)
                    if(n){
                        values.set(obj, [...n, parseFloat(valueObj[obj])]);  
                    }
                }
            }
        }
        //console.log(values)
        setInputsAreNumbers(numberStatus);
        if(numberStatus){
            equationSetValues(Object.fromEntries(values));
        }
        
    },[errorSymbolsValues, symbolsValues])

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
            { equationResult.result !== "" &&
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