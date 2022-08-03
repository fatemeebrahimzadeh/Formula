import React, { Dispatch, FC, useContext, useEffect, useState } from "react";
import "./FormulaRenderContentComponent.scss"
import { createPanel } from "./PanelCreator/PanelCreator"
import NumPanelCreator from "./PanelCreator/NumPanelCreator/NumPanelCreator"
import TagPanelCreator from "./PanelCreator/TagPanelCreator/TagPanelCreator";
import MultipleTagsPanelCreator from "./PanelCreator/MultipleTagsPanelCreator/MultipleTagsPanelCreator";
import { ITag } from "../@types/entities/tag";
import TextArea, { ITextAreaValidationRules } from "../UI/TextArea/TextArea";
import { GlobalEvent } from "../utils/event-emitter";
import { TEXTAREA_VALIDATION } from "../@types/events";

export interface IVirtualTabPanelValidationRules {
    FRM: ITextAreaValidationRules[]
}

export interface IFormulaPropsContext {
    tags: ITag[]
    mainVarible: IMainArray
    setMainVarible: Dispatch<React.SetStateAction<IMainArray>>
    tagsAndNumbersTabMode: ITagsAndNumbersTabs
}

export type ITagsAndNumbersTabs = "Num" | "Tag" | "Min" | "Ave" | "Max"
export type IOperationKeys = "C" | "<-" | "(" | ")" | "+" | "-" | "*" | "/"
export type IMainArray = (string | ITag)[]

export interface IProps {
    FRM: string
    onChangeHandler: (value: string) => void
    tags: ITag[]
}

let mounted = false
export const FormulaContext = React.createContext<IFormulaPropsContext | undefined>(undefined);

export const isOperationOrParenthesBefore = (arr: IMainArray): boolean => {
    return (arr!.length !== 0 && (
        arr![arr!.length - 1] === "( " ||
        arr![arr!.length - 1] === "+ " ||
        arr![arr!.length - 1] === "- " ||
        arr![arr!.length - 1] === "* " ||
        arr![arr!.length - 1] === "/ "
    )
    )
}

const FormulaRenderContentComponent: FC<IProps> = (props) => {

    const [formulaTextArea, setFormulaTextArea] = useState<string>("")
    const [mainVarible, setMainVarible] = useState<IMainArray>([])

    useEffect(() => {
        if (mounted) {
            let [FRMString, textAreaString] = convertArrayToString(mainVarible)
            setFormulaTextArea(textAreaString)
            props.onChangeHandler(FRMString)
        }
    }, [mainVarible])

    useEffect(() => {
        mounted = true
        let value = convertStringToArray()
        setMainVarible(value)
        let [FRMString, textAreaString] = convertArrayToString(value)
        setFormulaTextArea(textAreaString)
    }, [])

    const convertArrayToString = (arr: IMainArray): [string, string] => {
        // send data to higher component after changing OR change textArea with FRM prop 
        let textAreaString: string[] = []
        let FRMString: string[] = []

        for (let index = 0; index < arr.length; index++) {
            if (typeof (arr[index]) === "string") {
                FRMString.push(arr[index] as string)
                textAreaString.push(arr[index] as string)
            } else if (index !== 0 && typeof (arr[index - 1]) === "string" || index === 0) {
                FRMString.push("@" + (arr[index] as ITag).id + " ")
                textAreaString.push("@" + (arr[index] as ITag).TID + " ")
            } else {
                FRMString.push(" , @" + (arr[index] as ITag).id + " ")
                textAreaString.push(", @" + (arr[index] as ITag).TID + " ")
            }
        }

        return [FRMString.join(""), textAreaString.join("")]

    }

    const convertStringToArray = (): IMainArray => {
        // convert FRM string to array
        let FRMItems = props.FRM.split(" ").filter((i) => i !== "")
        let value: IMainArray = []

        for (let index = 0; index < FRMItems.length; index++) {
            if (FRMItems[index].includes("@")) {

                let FRMItemID = FRMItems[index].replace("@", "")

                props.tags.map((tag, index) => {
                    if (tag.id?.toString() === FRMItemID) {
                        value.push(tag)
                    }
                })

            }
            else if (FRMItems[index] !== ",") {
                value.push(FRMItems[index] + " ")
            }
        }

        return value

    }

    //#region validation

    const requiredData: (keyof IVirtualTabPanelValidationRules)[] = ["FRM"]

    const validationRules: IVirtualTabPanelValidationRules = {
        FRM: [{ name: "required" },
        {
            name: "custom",
            runtime: "onEvent",
            handler: (value: string) => {
                return formulaValidation(value)
            }
        }]
    }

    const formulaValidation = (value: string) => {
        if (!parenthesisCount(value) ||
            value.length === 0 ||
            isOperationTheLastChar(value)) {
            if (!parenthesisCount(value)) {
                return "count of parenthesis is incorrect"
            } else if (value.length === 0) {
                return "You can't submit empty Formula"
            } else {
                return "You can't submit this Formula"
            }
        }
        return undefined
    }

    const parenthesisCount = (textAreaString: string): boolean => {
        let parenthesisCount = 0

        for (let index = 0; index < textAreaString.length; index++) {
            if (textAreaString.charAt(index) === "(") parenthesisCount++
            else if (textAreaString.charAt(index) === ")") parenthesisCount--
        }

        return parenthesisCount === 0
    }

    const isOperationTheLastChar = (textAreaString: string): boolean => {
        return (
            textAreaString.length > 1 && (
                textAreaString.charAt(textAreaString.length - 2) === "+" ||
                textAreaString.charAt(textAreaString.length - 2) === "-" ||
                textAreaString.charAt(textAreaString.length - 2) === "/" ||
                textAreaString.charAt(textAreaString.length - 2) === "*"
            )
        )
    }

    useEffect(() => {
        GlobalEvent.get().emit(TEXTAREA_VALIDATION, 'VirtualTabPanel')
    });

    //#endregion

    //#region operationKeys

    const operationKeyOnClickHandler = (key: IOperationKeys) => {

        let value: IMainArray = [...mainVarible]

        switch (key) {
            case "*": case "+": case "/": case ")":
                if (value!.length === 0 || isOperationOrParenthesBefore(value)) {
                    console.log("You can't add this operation")
                } else {
                    value.push(key + " ")
                }
                break;
            case "(":
                if (value!.length === 0 || isOperationOrParenthesBefore(value)) {
                    value.push(key + " ")
                } else {
                    console.log("You can't add this operation")
                }
                break;
            case "-":
                if (isOperationOrParenthesBefore(value)) {
                    console.log("You can't add this operation")
                } else {
                    value.push(key + " ")
                }
                break;
            case "<-":
                if (value.length !== 0) {
                    if (isTheParenthesForMultipleTags(value)) {
                        let countOfPop = countOfCharThatShouldPopForRemovingMultipleTagsCompletely(value)
                        for (let index = 0; index < countOfPop; index++) {
                            value.pop()
                        }
                    } else {
                        value.pop()
                    }
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

    const isTheParenthesForMultipleTags = (arr: IMainArray): boolean => {
        return (
            arr.length > 2 &&
            arr![arr!.length - 1] === ") " &&
            arr![arr!.length - 2] !== ") " && (
                typeof arr![arr!.length - 3] === "string" && (
                    (arr![arr!.length - 3] as string).includes("MIN") ||
                    (arr![arr!.length - 3] as string).includes("MAX") ||
                    (arr![arr!.length - 3] as string).includes("AVE")
                ) ||
                typeof arr![arr!.length - 3] !== "string"
            )

        )
    }

    const countOfCharThatShouldPopForRemovingMultipleTagsCompletely = (arr: IMainArray): number => {
        let count = 0
        for (let index = arr.length - 1; index >= 0; index--) {
            count++
            if (typeof arr[index] === "string" && (arr[index] as string).includes("MIN") ||
                typeof arr[index] === "string" && (arr[index] as string).includes("MAX") ||
                typeof arr[index] === "string" && (arr[index] as string).includes("AVE")) {
                break
            }
        }
        return count
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
                className={`Formula__textarea`}
                autoFocus={true}
                validation={validationRules.FRM}
                groupName="VirtualTabPanel" />
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
                                tags: props.tags.filter((tag) => { return !!tag.TID }),
                                mainVarible: mainVarible,
                                setMainVarible: setMainVarible,
                                tagsAndNumbersTabMode: tagsAndNumbersTabMode
                            }}>
                            {panel(tagsAndNumbersTabMode)}
                        </FormulaContext.Provider>
                    }
                </div>
            </div>
        </section>
    )

}

export default FormulaRenderContentComponent;