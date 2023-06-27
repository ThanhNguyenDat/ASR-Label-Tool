import React, { Component, MouseEvent } from "react";
import ReactDiff, { DiffMethod } from "@custom/react-diff-viewer";
import { render } from "react-dom";

interface DiffViewerState {
    splitView?: boolean;
    highlightLine?: string[];
    language?: string;
    theme: "dark" | "light";
    enableSyntaxHighlighting?: boolean;
    compareMethod?: DiffMethod;
    customGutter?: boolean;
}

interface DiffViewerProps {
    oldValue: string | object;
    newValue: string | object;
    leftTitle: string;
    rightTitle: string;
    splitView: boolean;
    renderGutter: (data: {}) => JSX.Element;
    renderContent: () => JSX.Element;
    hideLineNumbers: boolean;
    compareMethod: DiffMethod;
}

const P = (window as any).Prism;

class DiffViewer extends Component<DiffViewerProps, DiffViewerState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            highlightLine: [],
            theme: "light",
            splitView: true,
            customGutter: true,
            enableSyntaxHighlighting: true,
        };
    }

    private onLineNumberClick = (id: string, e: MouseEvent<HTMLTableCellElement>): void => {
        let highlightLine = [id];
        if (e.shiftKey && this.state.highlightLine?.length === 1) {
            const [dir, oldId] = this.state.highlightLine[0].split("-");
            const [newDir, newId] = id.split("-");
            if (dir === newDir) {
                highlightLine = [];
                const lowEnd = Math.min(Number(oldId), Number(newId));
                const highEnd = Math.max(Number(oldId), Number(newId));
                for (let i = lowEnd; i <= highEnd; i++) {
                    highlightLine.push(`${dir}-${i}`);
                }
            }
        }
        this.setState({
            highlightLine,
        });
    };

    private syntaxHighlight = (str: string): any => {
        if (!str) return;
        const language = P.highlight(str, P.languages.javascript);
        return <span dangerouslySetInnerHTML={{ __html: language }} />;
    };

    public render(): JSX.Element {
        const {
            oldValue,
            newValue,
            leftTitle,
            rightTitle,
            splitView,
            renderGutter,
            renderContent,
            hideLineNumbers,
            compareMethod,
        } = this.props;

        return (
            <div className="diff-viewer" style={{ width: "100%", height: "100%" }}>
                <ReactDiff
                    highlightLines={this.state.highlightLine}
                    onLineNumberClick={this.onLineNumberClick}
                    compareMethod={compareMethod}
                    splitView={splitView}
                    oldValue={oldValue}
                    newValue={newValue}
                    renderGutter={renderGutter}
                    // renderContent={this.syntaxHighlight}
                    renderContent={renderContent}
                    useDarkTheme={this.state.theme === "dark"}
                    leftTitle={leftTitle}
                    rightTitle={rightTitle}
                    hideLineNumbers={hideLineNumbers}
                />
            </div>
        );
    }
}

export default DiffViewer;
