import { Tabs, TabList, TabPanels, Tab,
        TabPanel, Center, Table, Tbody, Tr, Td 
    } from '@chakra-ui/react'
import React from 'react';
import KaTeXBlockContent from './KaTeXBlockContext';
import { useEquation } from './stores';

const ErrorTabs = () => {
    const equationContent = useEquation((state) => state.content);

    const errPrefix = (equationContent.tex_prefix.length > 0)?`\\delta ${equationContent.tex_prefix} = `:''

    const diffParts = () : Array<any> => {
        let err = errPrefix + ' \\sqrt{'
        let errs: Array<string> = [];
        for (let i=0;  i< equationContent.diff_parts_tex.length; i++){
            errs.push(` \\Delta_${i + 1} ^{2}`)
        }
 
        const rows = Math.ceil(equationContent.diff_parts_tex.length / 2)
        let rowContent : Array<any> = []
        for (let i=0;  i< rows; i++){
            if((i*2 + 2) <= equationContent.diff_parts_tex.length){
                rowContent.push(
                    <Tr 
                        key={`row${i}`} 
                        style={{height: "sm"}}
                    >
                        <Td>
                            <KaTeXBlockContent 
                                equation={ `\\Delta_${i * 2 + 1} = ${equationContent.diff_parts_tex[i * 2]}`} 
                            />
                        </Td>
                        <Td>
                            <KaTeXBlockContent 
                                equation={ `\\Delta_${i * 2 + 2} = ${equationContent.diff_parts_tex[i * 2 + 1]}`} 
                            />
                        </Td>
                    </Tr>)
            }else{
                rowContent.push(
                        <Tr 
                            key={`row${i}`} 
                            style={{height: "sm"}}
                        >
                            <Td colSpan={2}>
                                <KaTeXBlockContent 
                                    equation={ `\\Delta_${i * 2 + 1} = ${equationContent.diff_parts_tex[i * 2]}`} 
                                />
                            </Td>
                        </Tr>)
            }
        }
        err = err + errs.join(' + ') + '}'
        rowContent.push(
                        <Tr key={`row${rows + 1}`}>
                            <Td colSpan ={2}>
                                <KaTeXBlockContent 
                                    equation={err}
                                />
                            </Td>
                        </Tr>)

        return rowContent
    }
    return(<>
        <Center>
            <Tabs>
            <TabList>
                <Tab>Basic</Tab>
                <Tab>Simplified</Tab>
                <Tab>Parts</Tab>
                <Tab>Construction</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                {equationContent.error_term_tex &&
                    <KaTeXBlockContent 
                        equation={`${errPrefix} ${equationContent.error_term_tex}`}
                    />
                }
                </TabPanel>
                <TabPanel>
                {equationContent.error_term_simplified_tex &&
                    <KaTeXBlockContent 
                        equation={`${errPrefix} ${equationContent.error_term_simplified_tex}`}
                    />
                }
                </TabPanel>
                <TabPanel>
                {equationContent.diff_parts_tex &&            
                    <Table 
                        variant="unstyled" 
                        size="sm"
                    >
                        <Tbody>
                            {diffParts()}
                        </Tbody>
                    </Table>
                    
                }
                </TabPanel>
                <TabPanel>
                {equationContent.error_equation &&
                    <KaTeXBlockContent 
                        equation={`${errPrefix}  ${equationContent.error_equation}`}
                    />
                }
                </TabPanel>
            </TabPanels>
            </Tabs>
        </Center>
    </>)
}

export default ErrorTabs;