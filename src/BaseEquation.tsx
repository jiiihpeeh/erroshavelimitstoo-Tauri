import { Button, HStack, Input,  Center, 
        Text, IconButton, Spacer, Tooltip } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import React from "react";
import Examples from "./Examples";
import {  usePython, useSympy, useEquation,useExample,
          useCommunicate, usePopUps } from "./stores";
import { Command } from "./type.d";

const BaseEquation = () => {
    const setShowExamples = useExample((state) => state.setShow)
    const equationReset = useEquation((state) => state.reset)
    const setMessageValue = useCommunicate((state) => state.setValue)

    const pythonReady = usePython((state) => state.ready)
    const sympyContent = useSympy((state)=> state.content)
    const sympySetContent = useSympy((state)=> state.setContent)
    const openSettings = usePopUps((state) => state.openSettings)

    const updateEquation = async () => {
        if(sympyContent.length > 0){
            setMessageValue(Command.Parse, sympyContent )
        }
        equationReset()
    }

    return(
        <>
            <Center bg="blue.50" w="100%" >
                <HStack width={"85%"} mt="5px" mb="5px">
                    <Text>
                        Insert an equation
                    </Text>
                    <HStack width={"70%"}>
                        <Input 
                            bg="ghostwhite"
                            type="text" 
                            value={sympyContent} 
                            onChange={(event) => sympySetContent(event.target.value)}
                            onKeyPress={(event) =>{
                                    if (event.key === "Enter"){
                                        updateEquation()
                                    }
                                }
                            }
                        />
                        <Examples/>
                    </HStack>
                    <HStack>
                        <Button 
                            isDisabled={!pythonReady}  
                            onClick={() => {updateEquation()}} 
                            bg="teal.100" 
                        >
                            Parse
                        </Button>
                        <Button 
                            bg={"red.100"} 
                            onClick={() => {equationReset(); sympySetContent('')}}
                        >
                            Clear
                        </Button>
                        <Button 
                            onClick={() => setShowExamples()} 
                            bg="yellow.100"
                        >
                            Examples
                        </Button>
                        <Spacer/>
                        <Tooltip label="Settings">
                            <IconButton
                                variant='solid'
                                colorScheme='telegram'
                                aria-label='Call Sage'
                                fontSize='20px'
                                onClick={() => openSettings()}
                                icon={<SettingsIcon />}
                            />
                        </Tooltip>
                    </HStack> 
                </HStack>
            </Center>
        </>
    )

}

export default BaseEquation;