import "./TagPanel.scss"
import { PanelCreator, Panel } from "../PanelCreator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { IFormulaPropsContext } from "../../FormulaRenderContentComponent";
import { ITag } from "../../../@types/entities/tag";
import Toast from "../../../utils/toast";
import { FormulaContext } from "../../../App";
import Input from "../../../UI/Input/Input";

class TagPanelCreator extends PanelCreator {
    public factoryMethod(): Panel {
        return new TagPanel();
    }
}
export default TagPanelCreator

export interface ITagWithMode extends ITag {
    mode: "ordinary" | "selected",
    visibility: "hidden" | "visible"
}

class TagPanel implements Panel {
    public panelCreator(): JSX.Element {
        return <TagPanelHook />;
    }
}

function TagPanelHook(): JSX.Element {

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
            className={`TagPanel__Tag ${tag.mode === "ordinary" ? "TagPanel__Tag--ordinary" : "TagPanel__Tag--selected"} ${tag.visibility === "visible" ? "TagPanel__Tag--visible" : "TagPanel__Tag--hidden"}`}
            key={index}
            onClick={() => { tagsModeOnClickHandler(tag) }}>
            {tag.TID}
        </div>
    })

    const tagsModeOnClickHandler = (selectedTag: ITagWithMode) => {
        setTagsWithMode(tagsWithMode.map((tag) => {
            if (tag.TID === selectedTag.TID) {
                if (selectedTag.mode === "selected") {
                    return { ...tag, mode: "ordinary" }
                }
                return { ...tag, mode: "selected" }
            } else return { ...tag, mode: "ordinary" }
        }))
    }

    //#endregion

    //#region upload tags to Formula textArea

    const uploadOnClickHanlder = () => {

        let selectedTID: string = "@"
        let selectedTag: ITag
        let stringAndTagArray: (string | ITag)[] = propsContext!.mainVarible!

        if (stringAndTagArray!.length === 0 || stringAndTagArray![stringAndTagArray!.length - 1] === "(" || stringAndTagArray![stringAndTagArray!.length - 1] === "+" || stringAndTagArray![stringAndTagArray!.length - 1] === "-" || stringAndTagArray![stringAndTagArray!.length - 1] === "*" || stringAndTagArray![stringAndTagArray!.length - 1] === "/") {
            setTagsWithMode(tagsWithMode.map((tag) => {
                if (tag.mode === "selected") {
                    selectedTID = selectedTID + tag.TID
                    selectedTag = tag
                }
                return { ...tag, mode: "ordinary" }
            }))

            if (selectedTID !== "@") {

                let concatedStringAndTagValueWithSlectedTagTID = stringAndTagArray!.concat(selectedTag!)
                propsContext!.setMainVarible!(concatedStringAndTagValueWithSlectedTagTID)

                // let stringArray: string[] = []
                // propsContext!.mainVarible!.map((i, index) => {
                //     if (typeof (i) === "string") {
                //         stringArray.push(i)
                //     } else {
                //         stringArray.push((i as ITag).TID)
                //     }
                // })

                // let concatedStringValueWithSelectedTagTID = stringArray!.concat(selectedTID)
                // propsContext!.setFormulaTextArea!(concatedStringValueWithSelectedTagTID.join(""))
            }
        } else {
            Toast.show({
                message: "You can't add tag without operation",
                type: "warning"
            })
        }

    }

    //#endregion

    return <div className="TagPanel">
        <Input
            onChange={setSearchInput}
            value={searchInput}
            className="TagPanel__Input"
            placeholder="Search here ..."
            faIcon={{
                icon: faSearch,
                className: "faIcon",
                onClickHandler: searchOnClickHandler
            }}
        />
        <button
            className="TagPanel__UploadIcon"
            onClick={uploadOnClickHanlder}>
            <FontAwesomeIcon icon={faUpload} />
        </button>
        <div className="TagPanel__Tags">
            {tagsElement}
        </div>
    </div>
}