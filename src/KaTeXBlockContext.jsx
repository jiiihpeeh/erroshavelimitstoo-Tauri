import { Menu, MenuItem, MenuList, MenuButton, MenuDivider, Text , MenuGroup, Box} from "@chakra-ui/react"
import { useState, useRef } from "react"
import { BlockMath } from 'react-katex';
import mathJaxSVGConverter from "./MathJaxSVG";
import SaveTextFile from "./SaveTextFile";
import {saveEquationPng} from "./SaveExt";
import { copyToClipboard, copyBlobToClipboard } from "./copy";
import { getPngFromSvg } from "./invokers";
import 'katex/dist/katex.min.css';


const getTexCode = (id) => {
    let katexData = document.getElementById(id);
    return katexData.outerHTML.split('<annotation encoding="application/x-tex">')[1].split('</annotation>')[0];
}


const saveStandaloneTex = (id) => {
    const doc = `\\documentclass{standalone}\n\\begin{document}\n$\\displaystyle ${getTexCode(id)}$\n\\end{document}\n`
    SaveTextFile(doc, ['tex'],'TeX')
} 

const KaTeXBlockContent = (props) => {
    const svgAction = useRef('');
    const [showMenu, setShowMenu ] = useState(false)
    const id = `${Math.random().toString(16).slice(2)} `+ props.equation
    const toAction = async (id, format, action) => {
        try{
            switch(format){
                case 'png':
                    const data =  mathJaxSVGConverter(getTexCode(id));
                    console.log(data)
                    switch(action){
                        case 'download':
                            saveEquationPng(data);
                            break;
                        case 'copy':
                            let blobData = await  getPngFromSvg(data);
                            copyBlobToClipboard(blobData);
                            break;
                        default:
                            break;
                    }
                    break;
                case 'svg':
                    const texData = getTexCode(id)
                    let svgData = mathJaxSVGConverter(texData);
                    console.log(svgData)
                    switch(action){
                        case 'copy':
                            copyToClipboard(svgData);
                            break;
                        case 'download':
                            SaveTextFile(svgData, ["svg"], "SVG");
                            break;
                        default:
                            break
                    }
                    svgAction.current = action;
                    break;
                default:
                    break;
            }
        }catch(err){
            console.log(err)
        }        
    }

    return (
        <Box onContextMenu={(e) => {e.preventDefault(); setShowMenu(true) }} >                    
        <Menu bg={"gray.100"} isOpen={showMenu} 
            placement={"top"}  closeOnBlur >
                <MenuButton 
                        as={Text} 
                    >   
                    <div id={id}>
                        <BlockMath >
                            {props.equation}
                        </BlockMath>
                    </div>
                </MenuButton>
            <MenuList bg={"gray.100"} onClick={() => setShowMenu(false)} >
                <MenuGroup title='Copy'>
                <MenuItem bg={"gray.100"} onClick={() => copyToClipboard(getTexCode(id))}   > 
                    <Text>Copy as TeX</Text> 
                </MenuItem>
                <MenuItem bg={"gray.100"} onClick={() => toAction(id, 'png','copy')}>
                        Copy as PNG
                </MenuItem>
                <MenuItem bg={"gray.100"} onClick={()=>toAction(id, 'svg','copy')}>
                        Copy as SVG (text)
                </MenuItem>
                </MenuGroup>

                <MenuDivider/>
                <MenuGroup title='Save'>
                <MenuItem bg={"gray.100"} onClick={() => saveStandaloneTex(id)}  >
                        Save as TeX
                </MenuItem>   
                <MenuItem bg={"gray.100"} onClick={()=>toAction(id, 'png','download')}>
                        Save as PNG
                </MenuItem>   
                <MenuItem bg={"gray.100"} onClick={()=>toAction(id, 'svg','download')}>
                        Save as SVG
                </MenuItem>
                </MenuGroup>                                  
            </MenuList>
        </Menu>
        </Box>
        )
};

export default KaTeXBlockContent;