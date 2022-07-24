import "./MultipleTagsPanel.scss"
import { PanelCreator, Panel } from "../PanelCreator"
import { useContext, useState } from "react";
import { IFormulaPropsContext } from "../../FormulaRenderContentComponent";
import { faSearch, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ITagWithMode } from "../TagPanel/TagPanel";
import { FormulaContext } from "../../../App";
import Toast from "../../../utils/toast";
import { ITag } from "../../../@types/entities/tag"
import Input from "../../../UI/Input/Input";
import Checkbox from "../../../UI/Checkbox/Checkbox";

class MultipleTagsCreator extends PanelCreator {
    public factoryMethod(): Panel {
        return new MultipleTags();
    }
}
export default MultipleTagsCreator

class MultipleTags implements Panel {
    public panelCreator(): JSX.Element {
        return <MultipleTagsHook />;
    }
}

function MultipleTagsHook(): JSX.Element {

    //#region Context

    const propsContext = useContext<IFormulaPropsContext | undefined>(FormulaContext);

    //#endregion

    //#region searchBar

    const [searchInput, setSearchInput] = useState<string>("")

    const searchOnClickHandler = () => {
        let searchedTags = propsContext!.tags.filter((tag) => {
            return tag.TID.includes(searchInput)
        })

        let visibleTags: ITagWithMode[] = tagsWithMode.map((tagWithMode, index) => {
            for (const searchedTag of searchedTags) {
                if (tagWithMode.TID === searchedTag.TID) {
                    return { ...tagWithMode, visibility: "visible" }
                }
            }
            return { ...tagWithMode, visibility: "hidden" }
        })

        setTagsWithMode(visibleTags)

    }

    //#endregion

    //#region tagsSelection

    const [tagsWithMode, setTagsWithMode] = useState<ITagWithMode[]>(
        propsContext!.tags.map(tag => {
            return { ...tag, mode: "ordinary", visibility: "visible" }
        })
    )

    const tagsElement = tagsWithMode.map((tag, index) => {
        return <div
            className={`MultipleTags__Tag ${tag.mode === "ordinary" ? "MultipleTags__Tag--ordinary" : "MultipleTags__Tag--selected"} ${tag.visibility === "visible" ? "MultipleTags__Tag--visible" : "MultipleTags__Tag--hidden"}`}
            onClick={() => { tagsModeOnClickHandler(tag) }}>
            {tag.TID}
            {<div className="Tag__CheckBox">
                <Checkbox onChange={() => { tagsModeOnClickHandler(tag) }} checked={tag.mode === "ordinary" ? 0 : 1} />
            </div>}
        </div>
    })

    const tagsModeOnClickHandler = (selectedTag: ITagWithMode) => {
        setTagsWithMode(tagsWithMode.map((tag) => {
            if (tag.TID === selectedTag.TID) {
                if (tag.mode === "selected") return { ...tag, mode: "ordinary" }
                else return { ...tag, mode: "selected" }
            } else return tag
        }))
    }

    //#endregion

    //#region upload tags to Formula textArea

    const uploadOnClickHanlder = () => {

        let selectedTagsTID: string[] = []
        let selectedTags: (ITag | string)[] = []
        let stringAndTagArray = propsContext!.mainVarible!

        if (stringAndTagArray!.length === 0 || stringAndTagArray![stringAndTagArray!.length - 1] === "(" || stringAndTagArray![stringAndTagArray!.length - 1] === "+" || stringAndTagArray![stringAndTagArray!.length - 1] === "-" || stringAndTagArray![stringAndTagArray!.length - 1] === "*" || stringAndTagArray![stringAndTagArray!.length - 1] === "/") {

            // selectedTagsTID.push(`${propsContext!.tagsAndNumbersTabMode}( `)
            selectedTags.push(`${propsContext!.tagsAndNumbersTabMode}( `)

            setTagsWithMode(tagsWithMode.map((tag) => {
                if (tag.mode === "selected") {
                    selectedTagsTID.push("@" + tag.TID + ", ")
                    selectedTags.push(tag)
                }
                return { ...tag, mode: "ordinary" }
            }))

            // let lastItem = selectedTagsTID.pop()!.split(",")
            // selectedTagsTID.push(lastItem[0])
            // selectedTagsTID.push(` )`)

            selectedTags.push(") ")

            if (selectedTagsTID.length !== 0) {
                let concatedStringAndTagValueWithSlectedTagsTID: (ITag | string)[] = stringAndTagArray!.concat(selectedTags)
                propsContext!.setMainVarible!(concatedStringAndTagValueWithSlectedTagsTID)

                // let stringArray: string[] = []
                // propsContext!.mainVarible!.map((i, index) => {
                //     if (typeof (i) === "string") {
                //         stringArray.push(i)
                //     } else {
                //         stringArray.push((i as ITag).TID)
                //     }
                // })

                // let concatedStringValueWithSelectedTagsTID = stringArray!.concat(selectedTagsTID)
                // propsContext!.setFormulaTextArea!(concatedStringValueWithSelectedTagsTID.join(""))
            }
        } else {
            Toast.show({
                message: "You can't add tags without operation",
                type: "warning"
            })
        }
    }

    //#endregion

    return <div className="MultipleTags">
        <Input
            onChange={setSearchInput}
            value={searchInput}
            className="MultipleTags__Input"
            placeholder="Search here ..."
            faIcon={{
                icon: faSearch,
                className: "faIcon",
                onClickHandler: searchOnClickHandler
            }}
        />
        <button
            className="MultipleTags__UploadIcon"
            onClick={uploadOnClickHanlder}>
            <FontAwesomeIcon icon={faUpload} />
        </button>
        <div className="MultipleTags__Tags">
            {tagsElement}
        </div>
    </div>
}