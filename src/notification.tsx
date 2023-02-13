import { createStandaloneToast } from "@chakra-ui/react";

export enum Status {
    Success ="success", 
    Error = "error",
    Warning = "warning", 
    Info = "info"
}

export const notification = (title: string, description: string, info: Status = Status.Success, duration=2500, isClosable=true ) => {
    const { toast } = createStandaloneToast();
    toast({
        title: title,
        description: description,
        status: info,
        duration: duration,
        isClosable: isClosable,
    })
};