import { Modal, ModalContent, ModalHeader,
        ModalBody, ModalCloseButton, ModalOverlay, 
        Text, Switch, HStack, Center,Table, Thead,
        Tbody, Tr, Th, Td,TableContainer, IconButton, Tooltip} from '@chakra-ui/react'
import { RepeatIcon } from "@chakra-ui/icons";
import { InlineMath } from 'react-katex';
import React from "react";
import { usePopUps, usePython, useRemoteTeX } from "./stores";
import { Python } from './type.d';

const Settings = () => {
    const isOpen = usePopUps((state) => state.showSettings)
    const closeModal = usePopUps((state) => state.closeSettings)
    const python = usePython((state)=> state.mode)
    const togglePython = usePython((state)=> state.togglePython)
    const remoteTeX = useRemoteTeX((state) => state.remoteFetch)
    const setRemoteTeX = useRemoteTeX((state) => state.setFetch)

    const setPythonSwitch = ():boolean => {
        switch(python){
            case Python.Wasm:
                return true;
            case Python.System:
                return false;
            default:
                return false;
        }
    }
    const pySlider = () => {
        togglePython()
    }

    return (
      <>  
        <Modal 
            size={"xl"} 
            blockScrollOnMount={false} 
            isOpen={isOpen} 
            onClose={closeModal} 
        >
          <ModalOverlay />
          <ModalContent>
            <Center>
                <ModalHeader>
                    <Text color={"red"}>
                        Settings
                    </Text>
                </ModalHeader>
             </Center>
            <ModalCloseButton />
            <ModalBody>
            <TableContainer>
                <Table variant='striped'>
                    <Thead>
                    <Tr>
                        <Th>
                            Name
                        </Th>
                        <Th>
                            <Center>
                                Setting
                            </Center>
                        </Th>
                        <Th></Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    <Tr>
                        <Td>
                            Python
                        </Td>
                        <Td>
                            <Center>
                                <HStack>
                                    <Text>
                                        System
                                    </Text>
                                    <Switch
                                        onChange={pySlider}
                                        isChecked={setPythonSwitch()}
                                        colorScheme="gray"
                                    />
                                    <Text>
                                        Wasm
                                    </Text>
                                </HStack>
                            </Center>
                        </Td>
                        <Td>
                        <Tooltip label="Reload">
                            <IconButton
                                icon={<RepeatIcon />}
                                color={'red.400'}
                                onClick={() => window.location.reload()} 
                                aria-label={''}                                    
                            />
                        </Tooltip>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>
                            Remote <InlineMath>{"\\LaTeX"}</InlineMath> rendering             
                        </Td>
                        <Td>
                            <Center>
                                <HStack>
                                    <Text>
                                        Ask
                                    </Text>
                                    <Switch
                                        isChecked={remoteTeX}
                                        onChange={() => setRemoteTeX(!remoteTeX)}
                                        colorScheme="gray"
                                    />
                                    <Text>
                                        Allow
                                    </Text>
                                </HStack>
                            </Center>
                        </Td>
                        <Td></Td>
                    </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
            </ModalBody>
  
          </ModalContent>
        </Modal>
      </>
    )
  }

  export default Settings;