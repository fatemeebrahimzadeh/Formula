import { useContext, useState } from "react";
import "./NumPanel.scss"
import { PanelCreator, Panel } from "../PanelCreator"
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IFormulaPropsContext } from "../../FormulaRenderContentComponent";
import { ITag } from "../../../@types/entities/tag";
import TextArea from "../../../UI/TextArea/TextArea";
import Toast from "../../../utils/toast";
import { FormulaContext } from "../../../App";

export type INumberKeys = "7" | "8" | "9" | "4" | "5" | "6" | "1" | "2" | "3" | "<-" | "0" | "."

class NumPanelCreator extends PanelCreator {
    public factoryMethod(): Panel {
        return new NumPanel();
    }
}
export default NumPanelCreator


class NumPanel implements Panel {
    public panelCreator(): JSX.Element {
        return <NumPanelHook />
    }
}

function NumPanelHook(): JSX.Element {

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
        let value = propsContext!.mainVarible

        if (value!.length === 0 || value![value!.length - 1] === "(" || value![value!.length - 1] === "+" || value![value!.length - 1] === "-" || value![value!.length - 1] === "*" || value![value!.length - 1] === "/") {
            if (mainNumPanelVarible.length !== 0) {
                let concatedStringAndTagValueWithNumPanelValue = value!.concat([mainNumPanelVarible.join("") + " "])
                propsContext!.setMainVarible!(concatedStringAndTagValueWithNumPanelValue)

                // let stringArray: string[] = []
                // propsContext!.mainVarible!.map((i, index) => {
                //     if (typeof (i) === "string") {
                //         stringArray.push(i)
                //     } else {
                //         stringArray.push((i as ITag).TID)
                //     }
                // })

                // let concatedStringValueWithNumPanelValue = stringArray!.concat([mainNumPanelVarible.join("")])
                // propsContext!.setFormulaTextArea!(concatedStringValueWithNumPanelValue.join(""))

                setMainNumPanelVarible([])
                setNumPanelTextArea("")
            }
        } else {
            Toast.show({
                message: "You can't add number without operation",
                type: "warning"
            })
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