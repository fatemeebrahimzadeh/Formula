import { useContext, useState } from "react";
import "./NumPanelHook.scss"
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormulaContext, IFormulaPropsContext, isOperationOrParenthesBefore } from "../../../FormulaRenderContentComponent";
import TextArea from "../../../../UI/TextArea/TextArea";

export type INumberKeys = "7" | "8" | "9" | "4" | "5" | "6" | "1" | "2" | "3" | "<-" | "0" | "."

export default function NumPanelHook(): JSX.Element {

    const [mainNumPanelVarible, setMainNumPanelVarible] = useState<string[]>([])
    const [numPanelTextArea, setNumPanelTextArea] = useState<string>("")

    //#region Context

    const propsContext = useContext<IFormulaPropsContext | undefined>(FormulaContext);

    //#endregion

    //#region numberKeys

    const numberKeyOnClickHandler = (key: INumberKeys) => {

        let value: any[] = mainNumPanelVarible

        switch (key) {
            case "<-":
                value.pop()
                break;
            default:
                value.push(key)
                break;
        }

        setMainNumPanelVarible(value)
        setNumPanelTextArea(value.join(""))
    }

    const numberKeys: (INumberKeys)[] = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "<-", "0", "."]
    const keys = numberKeys.map((key, index) => {
        return <button
            className="numberKey"
            key={index}
            onClick={(event) => { numberKeyOnClickHandler(key) }}>{key}</button>
    })

    //#endregion

    //#region upload text to Formula

    const uploadOnClickHanlder = () => {
        let value = [...propsContext!.mainVarible]

        if (value!.length === 0 || isOperationOrParenthesBefore(value)) {
            if (mainNumPanelVarible.length !== 0) {
                propsContext!.setMainVarible(value!.concat([mainNumPanelVarible.join("") + " "]))

                setMainNumPanelVarible([])
                setNumPanelTextArea("")
            }
        } else {
            console.log("You can't add number without operation")
        }

    }

    //#endregion

    return (
        <div className="NumPanel">
            <TextArea
                rows={1}
                value={numPanelTextArea}
                placeholder="0.0"
                readOnly={true}
                wrap="off"
                className="NumPanel__textarea"
                autoFocus={true} />
            <button
                className="NumPanel__UploadIcon"
                onClick={uploadOnClickHanlder}>
                <FontAwesomeIcon className="" icon={faUpload} />
            </button>
            <div className="NumPanel__NumberKeys">
                {keys}
            </div>
        </div>
    )
}