//import { useToast, Button } from '@chakra-ui/react'
import { createStandaloneToast } from "@chakra-ui/react";

export const notification = (title, description, info='success', duration=2500, isClosable=true ) => {
//export const notification = (title, description ) => {
    const { toast } = createStandaloneToast();
    const statuses = ['success', 'error', 'warning', 'info']
    let msgStatus = info
    if (statuses.indexOf(msgStatus) === -1){
        msgStatus = 'success'
        console.error('Wrong status')
    }

    toast({
        title: title,
        description: description,
        status: info,
        duration: duration,
        isClosable: isClosable,
    })
    //toast({ title: "Toast", status: "success" });

};

