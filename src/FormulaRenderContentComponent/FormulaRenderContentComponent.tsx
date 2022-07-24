import React, { Dispatch, FC, useContext, useEffect, useState } from "react";
import "./FormulaRenderContentComponent.scss"
import { createPanel } from "./PanelCreator/PanelCreator"
import NumPanelCreator from "./PanelCreator/NumPanel/NumPanel"
import TagPanelCreator from "./PanelCreator/TagPanel/TagPanel";
import MultipleTagsPanelCreator from "./PanelCreator/MultipleTagsPanel/MultipleTagsPanel";
import { IVirtualTag } from "../@types/entities/virtualtag";
import { ITag } from "../@types/entities/tag";
import TextArea from "../UI/TextArea/TextArea";
import { FormulaContext } from "../App";
import Toast from "../utils/toast";

export interface IFormulaPropsContext {
    tags: ITag[]
    onChangeHandler?: (value: number | string | boolean, fieldName: keyof IVirtualTag) => void
    FRM?: string
    mainVarible?: (string | ITag)[]
    setMainVarible?: Dispatch<React.SetStateAction<(string | ITag)[]>>
    tagsAndNumbersTabMode?: ITagsAndNumbersTabs
    isSubmited?: boolean
}

export type ITagsAndNumbersTabs = "Num" | "Tag" | "Min" | "Ave" | "Max"
export type IOperationKeys = "C" | "<-" | "(" | ")" | "+" | "-" | "*" | "/"

export interface IProps { }

const FormulaRenderContentComponent: FC<IProps> = (props) => {

    const [validation, setValidation] = useState<string>("")
    const [formulaTextArea, setFormulaTextArea] = useState<string>("")

    //#region Context

    const propsContext = useContext<IFormulaPropsContext | undefined>(FormulaContext);

    //#endregion

    //#region mainVarible Array

    const [mainVarible, setMainVarible] = useState<(string | ITag)[]>([])

    useEffect(() => {
        console.log("useEffect")
        let textAreaString: string[] = []
        let FRMString: string[] = []

        for (let index = 0; index < mainVarible.length; index++) {
            if (typeof (mainVarible[index]) === "string") {
                FRMString.push(mainVarible[index] as string)
                textAreaString.push(mainVarible[index] as string)
            } else if (index !== 0 && typeof (mainVarible[index - 1]) === "string" || index === 0) {
                FRMString.push("@" + (mainVarible[index] as ITag).id + " ")
                textAreaString.push("@" + (mainVarible[index] as ITag).TID + " ")
            } else {
                FRMString.push(" , @" + (mainVarible[index] as ITag).id + " ")
                textAreaString.push(", @" + (mainVarible[index] as ITag).TID + " ")
            }

        }

        setFormulaTextArea(textAreaString.join(""))
        propsContext!.onChangeHandler!(FRMString.join(""), 'FRM')
    }, [mainVarible])

    //#region validation

    useEffect(() => {
        // check validation every render when submit is happened before
        if (propsContext!.isSubmited) {
            let parenthesisCount = 0
            let FRM = propsContext!.FRM!
            for (let index = 0; index < FRM.length; index++) {
                if (FRM.charAt(index) === "(") parenthesisCount++
                else if (FRM.charAt(index) === ")") parenthesisCount--
            }
            if (parenthesisCount !== 0 || FRM.length === 0) setValidation("FRM")
            else { setValidation("") }
        }
    });

    //#endregion

    //#region operationKeys

    const operationKeyOnClickHandler = (key: IOperationKeys) => {

        let value: (string | ITag)[] = mainVarible

        switch (key) {
            case "*": case "+": case "/":
                if (value.length === 0 || value.length !== 0 && (value![value!.length - 1] === "+ " || value![value!.length - 1] === "* " || value![value!.length - 1] === "/ " || value![value!.length - 1] === "- ")) {
                    Toast.show({
                        message: "You can't add this operation",
                        type: "warning"
                    })
                } else {
                    value.push(key + " ")
                }
                break;
            case "(":
                if (value.length === 0 || value.length !== 0 && (value![value!.length - 1] !== "+ " || value![value!.length - 1] !== "* " || value![value!.length - 1] !== "/ " || value![value!.length - 1] !== "- ")) {
                    value.push(key + " ")
                } else {
                    Toast.show({
                        message: "You can't add this operation",
                        type: "warning"
                    })
                }
                break;
            case ")":
                if (value.length === 0 || value.length !== 0 && (value![value!.length - 1] === "* " || value![value!.length - 1] === "- " || value![value!.length - 1] === "/ " || value![value!.length - 1] === "+ ")) {
                    Toast.show({
                        message: "You can't add this operations",
                        type: "warning"
                    })
                } else {
                    value.push(key + " ")
                }
                break;
            case "-":
                if (value.length !== 0 && (value![value!.length - 1] !== "+ " || value![value!.length - 1] !== "* " || value![value!.length - 1] !== "/ " || value![value!.length - 1] !== "- ")) {
                    Toast.show({
                        message: "You can't add this operation",
                        type: "warning"
                    })
                } else {
                    value.push(key + " ")
                }
                break;
            case "<-":
                if (value.length !== 0) {
                    value.pop()
                }
                break;
            case "C":
                value = []
                break;
            default:
                break;
        }

        setMainVarible(value)
    }

    const operationKeys: (IOperationKeys)[] = ["C", "<-", "(", ")", "+", "-", "*", "/"]
    const keys = operationKeys.map((key, index) => {
        return <button
            className="operationKey"
            key={index}
            onClick={(event) => { operationKeyOnClickHandler(key) }}
            role='operationKey'>{key}</button>
    })

    //#endregion

    //#region tagsAndNumbers

    const [tagsAndNumbersTabMode, setTagsAndNumbersTabMode] = useState<ITagsAndNumbersTabs>("Num")

    const tagsAndNumbersTabs: (ITagsAndNumbersTabs)[] = ["Num", "Tag", "Min", "Ave", "Max"]
    const tabs = tagsAndNumbersTabs.map((tagsAndNumbersTabs, index) => {
        return <button
            className={`tagsAndNumbers__Tab ${tagsAndNumbersTabMode === tagsAndNumbersTabs ? "tagsAndNumbers__Tab--open" : "tagsAndNumbers__Tab--close"}`}
            key={index}
            onClick={() => { setTagsAndNumbersTabMode(tagsAndNumbersTabs) }}>
            {<span className={`Tab__Mark ${tagsAndNumbersTabMode === tagsAndNumbersTabs ? "Tab__Mark--open" : "Tab__Mark--close"}`} />}
            {tagsAndNumbersTabs}
        </button>
    })

    //#endregion

    //#region tagsAndNumbers__panel

    const panel = (type: ITagsAndNumbersTabs): JSX.Element => {
        switch (type) {
            case "Num":
                return createPanel(new NumPanelCreator())
            case "Tag":
                return createPanel(new TagPanelCreator())
            case "Min": case "Ave": case "Max":
                return createPanel(new MultipleTagsPanelCreator())
            default:
                return <></>
        }
    }

    //#endregion

    return (
        <section
            className="FormulaRenderContentComponent"
            data-testid='Formula'>
            <TextArea
                rows={1}
                value={formulaTextArea}
                placeholder="0.0"
                readOnly={true}
                wrap="off"
                className={`Formula__textarea ${validation === "FRM" ? "textarea-error" : ""}`}
                autoFocus={true} />
            <div className="Formula__OperabilitySection">
                <div className="operationKeys">
                    {keys}
                </div>
                <div className="tagsAndNumbers">
                    <div className="tagsAndNumbers__Tabs">
                        {tabs}
                    </div>
                    <div className="tagsAndNumbers__panel">
                        {
                            <FormulaContext.Provider
                                value={{
                                    tags: propsContext!.tags,
                                    mainVarible: mainVarible,
                                    setMainVarible: setMainVarible,
                                    tagsAndNumbersTabMode: tagsAndNumbersTabMode
                                }}>
                                {panel(tagsAndNumbersTabMode)}
                            </FormulaContext.Provider>
                        }
                    </div>
                </div>
            </div>
        </section>
    )

}

export default FormulaRenderContentComponent;