 
import {
        Menu, MenuList, MenuItem, MenuButton,
        VisuallyHidden, Button } from '@chakra-ui/react'
import React from 'react'
import { useExample, useSympy } from './stores'

const Examples = () => {
    const examples = useExample((state) => state.examples) 
    const setShowExamples = useExample((state) => state.setShow)
    const showExamples = useExample((state) => state.show)
    const sympySetContent = useSympy((state)=> state.setContent)

    const menuActionItems = () => {
        return examples.map( example =>  
            <MenuItem 
                onClick={(e)=>{sympySetContent(example); setShowExamples()}} 
                key={example}
            >
                {example}
            </MenuItem>)
    }
    return(
        <Menu isOpen={showExamples} > 
            <VisuallyHidden>
                <MenuButton 
                    as={Button} 
                    height={"3px"}
                />
            </VisuallyHidden>
            <MenuList>
                {menuActionItems()}
            </MenuList>
        </Menu>
    )
}

export default Examples;