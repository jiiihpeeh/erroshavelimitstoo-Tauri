import { Tabs, TabList, TabPanels, Tab, TabPanel, Center, Table, Tbody, Tr, Td } from '@chakra-ui/react'
import { useContext } from 'react';
import { EquationContext } from './EquationContext';
import KaTeXBlockContent from './KaTeXBlockContext';

const ErrorTabs = () => {
    const { equation } = useContext(EquationContext);
    const errPrefix = (equation.tex_prefix.length > 0)?`\\delta ${equation.tex_prefix} = `:''

    const diffParts = () => {
        let err = errPrefix + ' \\sqrt{'
        let errs = [];
        for (let i=0;  i< equation.diff_parts_tex.length; i++){
            errs.push(` \\Delta_${i + 1} ^{2}`)
        }
 
        const rows = Math.ceil(equation.diff_parts_tex.length / 2)
        let rowContent = []
        for (let i=0;  i< rows; i++){
            if((i*2 + 2) <= equation.diff_parts_tex.length){
                rowContent.push(
                    <Tr key={`row${i}`} style={{height: "sm"}}>
                        <Td>
                            <KaTeXBlockContent equation={ `\\Delta_${i * 2 + 1} = ${equation.diff_parts_tex[i * 2]}`} />
                        </Td>
                        <Td>
                            <KaTeXBlockContent equation={ `\\Delta_${i * 2 + 2} = ${equation.diff_parts_tex[i * 2 + 1]}`} />
                        </Td>
                    </Tr>)
            }else{
                rowContent.push(
                        <Tr key={`row${i}`} style={{height: "sm"}}>
                            <Td colSpan="2">
                                <KaTeXBlockContent equation={ `\\Delta_${i * 2 + 1} = ${equation.diff_parts_tex[i * 2]}`} />
                            </Td>
                        </Tr>)
            }
        }
        err = err + errs.join(' + ') + '}'
        rowContent.push(
                        <Tr key={`row${rows + 1}`}>
                            <Td colSpan="2">
                                <KaTeXBlockContent equation={ err}/>
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
                {equation.error_term_tex &&
                    <KaTeXBlockContent equation={`${errPrefix}  ${equation.error_term_tex}`}/>
                }
                </TabPanel>
                <TabPanel>
                {equation.error_term_simplified_tex &&
                    <KaTeXBlockContent equation={`${errPrefix}  ${equation.error_term_simplified_tex}`}/>
                }
                </TabPanel>
                <TabPanel>
                {equation.diff_parts_tex &&
                    <Table variant="unstyled" size="sm">
                        <Tbody>
                            {diffParts()}
                        </Tbody>
                    </Table>
                    
                }
                </TabPanel>
                <TabPanel>
                {equation.error_equation &&
                    <KaTeXBlockContent equation={`${errPrefix}  ${equation.error_equation}`}/>
                }
                </TabPanel>
            </TabPanels>
            </Tabs>
        </Center>
    </>)
}

export default ErrorTabs;