
import DiffViewer, { DiffMethod } from '@custom/react-diff-viewer';

import {FiEdit3} from "react-icons/fi";

const ReactDiffViewer = ({
    oldValue, 
    newValue, 
    oldTitle,
    newTitle,
    method="words", 
    splitView=true, 
    modeShow,
    isHover,

    handleAcceptTextBtn,

    ...props
}) => {
    let compareMethod = DiffMethod.WORDS;
    
    if (method === "words") {
        compareMethod = DiffMethod.WORDS;
    } else if (method === "lines") {
        compareMethod = DiffMethod.LINES;
        // splitView = false;
    }
    // compareMethod = DiffMethod.SENTENCES;
    
    const renderContent = (str) => {
        return (
        <div 
            className='diffent-element' 
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'center',
                width: "100%",
            }}
        >
            <pre
                style={{ display: "inline" }}
                className="foo"
                dangerouslySetInnerHTML={{
                // __html: Prism.highlight(str, Prism.languages.javascript)
                // __html: Prism.highlight(str, Prism.languages.json, "json")
                __html: `${str}`
                }}
            />
        </div>
    )}
    

    const renderGutter = (row) => {
        let text;
        if (row.prefix === 'L') {
            text = oldValue;
        } else if (row.prefix === 'R') {
            text = newValue;
        }

        return (
            <td 
                className='control-diff-viewer'
            >
                <FiEdit3 className='icon'
                    onClick={() => {
                        if (handleAcceptTextBtn) {
                            handleAcceptTextBtn(text);
                        }
                    }}
                />
            </td>
        )
    }

    return (
       
        <DiffViewer 
            oldValue={oldValue}
            newValue={newValue}

            leftTitle={()=>{return <>{oldTitle}</>}}
            rightTitle={newTitle}

            hideLineNumbers={true}
            showDiffOnly={false}
            splitView={splitView}
            compareMethod={compareMethod}
            styles={{
                variables: {
                    light: {
                        codeFoldGutterBackground: "#6F767E",
                        codeFoldBackground: "#E2E4E5"
                        }
                },
                contentText: {
                    display: 'flex',
                    width: "100%",
                },
                diffContainer: {
                    width: "100%"
                },
            }}
            {...props}
            renderContent={renderContent}
            renderGutter={renderGutter}
        />
    
    ) 
}

export default ReactDiffViewer