import { Menu, MenuItem, MenuList, MenuButton, 
            MenuDivider, Text , MenuGroup, Box} from "@chakra-ui/react"
import React, { useState } from "react"
import { BlockMath } from 'react-katex';
import mathJaxSVGConverter from "./MathJaxSVG";
import SaveTextFile from "./SaveTextFile";
import {saveEquationPng} from "./SaveExt";
import { copyToClipboard, copyBlobToClipboard } from "./copy";
import { getPngFromSvg, clipboardPNGSupport, copyPngToClipboard } from "./invokers";
import { notification } from "./notification";
import 'katex/dist/katex.min.css';

let pngSupport =false;
const getTexCode = (id: string): string| null => {
    let katexData = document.getElementById(id);
    if(katexData){
        return katexData.outerHTML.split('<annotation encoding="application/x-tex">')[1].split('</annotation>')[0];
    }
    return null;
}


const saveStandaloneTex = (id:string) => {
    const doc = `\\documentclass{standalone}\n\\begin{document}\n$\\displaystyle ${getTexCode(id)}$\n\\end{document}\n`
    SaveTextFile(doc, ['tex'],'TeX')
} 
interface KateBlock {
    equation: string;
}
interface KateFormat {
    action: string;
}
enum Action {
    Download = 0,
    Copy = 1
}
enum Format {
    SVG = 0,
    PNG = 1
}
const KaTeXBlockContent = (props: KateBlock) => {
    const [showMenu, setShowMenu ] = useState(false)
    const id : string = `${Math.random().toString(16).slice(2)} `+ props.equation
    const toAction = async (id :string, format: Format, action : Action) => {
        try{
            switch(format){
                case Format.PNG:
                    const data =  mathJaxSVGConverter(getTexCode(id));
                    if(!data){
                        return
                    }
                    //console.log(data)
                    switch(action){
                        case Action.Download:
                            saveEquationPng(data);
                            break;
                        case Action.Copy:
                            if(!pngSupport){
                                pngSupport = await clipboardPNGSupport()
                            }
                            if(pngSupport){
                                let res = await copyPngToClipboard(data);
                                if(!res){
                                    notification("Failed", "Failed to copy Clipboard")
                                }
                            }else{
                                let blobData = await getPngFromSvg(data);
                                if(blobData){
                                    copyBlobToClipboard(blobData);
                                }
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case Format.SVG:
                    const texData = getTexCode(id);
                    let svgData = mathJaxSVGConverter(texData);
                    if(!svgData){
                        return;
                    }
                    switch(action){
                        case Action.Copy:
                            copyToClipboard(svgData);
                            break;
                        case Action.Download:
                            SaveTextFile(svgData, ["svg"], "SVG");
                            break;
                        default:
                            break
                    }
                    break;
                default:
                    break;
            }
        }catch(err){
            //console.log(err)
        }        
    }

    return (
        <Box onContextMenu={(e) => {e.preventDefault(); setShowMenu(true) }} >                    
        <Menu isOpen={showMenu} 
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
            <MenuList 
                bg={"gray.100"} 
                onClick={() => setShowMenu(false)} 
            >
                <MenuGroup title='Copy'>
                <MenuItem 
                    bg={"gray.100"} 
                    onClick={() => copyToClipboard(getTexCode(id))}   
                > 
                    <Text>Copy as TeX</Text> 
                </MenuItem>
                <MenuItem 
                    bg={"gray.100"} 
                    onClick={() => toAction(id, Format.PNG, Action.Copy)}
                >
                        Copy as PNG
                </MenuItem>
                <MenuItem 
                    bg={"gray.100"} 
                    onClick={()=>toAction(id, Format.SVG,Action.Copy)}
                >
                        Copy as SVG (text)
                </MenuItem>
                </MenuGroup>

                <MenuDivider/>
                <MenuGroup title='Save'>
                <MenuItem 
                    bg={"gray.100"} 
                    onClick={() => saveStandaloneTex(id)}  
                >
                        Save as TeX
                </MenuItem>   
                <MenuItem 
                    bg={"gray.100"} 
                    onClick={()=>toAction(id, Format.PNG,Action.Download)}
                >
                        Save as PNG
                </MenuItem>   
                <MenuItem 
                    bg={"gray.100"} 
                    onClick={()=>toAction(id, Format.SVG, Action.Download)}
                >
                        Save as SVG
                </MenuItem>
                </MenuGroup>                                  
            </MenuList>
        </Menu>
        </Box>
        )
};

export default KaTeXBlockContent;