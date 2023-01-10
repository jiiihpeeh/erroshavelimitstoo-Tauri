 
import {
    Menu,
    MenuList,
    MenuItem,
    VisuallyHidden,
    MenuButton,
    Button
  } from '@chakra-ui/react'
import React from 'react'

const Examples = (props) => {
    const menuActionItems = () => {
        let examples = ["y=a*x**2+b*x+c +3",  "nu=beta/(m_alpha -r)", "s=(sqrt(k_lambda) +exp(-p)+log(6))/(pi) + 8.09e32"]
        return examples.map( example =>  
            <MenuItem onClick={(e)=>{props.setExample(example); props.setShowExamples(false)}} key={example}>
                {example}
            </MenuItem>)
    }
    return(
        <Menu isOpen={props.showExamples} > 
            <VisuallyHidden>
                <MenuButton as={Button} height={"3px"}/>
            </VisuallyHidden>
            <MenuList>
                {menuActionItems()}
            </MenuList>
        </Menu>
    )

}

export default Examples;