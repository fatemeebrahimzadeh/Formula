import "./TagPanelHook.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { FormulaContext, IFormulaPropsContext, IMainArray, isOperationOrParenthesBefore } from "../../../FormulaRenderContentComponent";
import { ITag } from "../../../../@types/entities/tag";
import Input from "../../../../UI/Input/Input";
import Toast from "../../../../utils/toast";

export interface ITagWithMode extends ITag {
    mode: "ordinary" | "selected",
    visibility: "hidden" | "visible"
}

export default function TagPanelHook(): JSX.Element {

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

    useEffect(() => {
        searchOnClickHandler()
    }, [searchInput])

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

    const tagsOnWheelHandler = (event: React.WheelEvent<HTMLDivElement>) => {
        event.preventDefault();

        event.currentTarget.scrollBy({
            top: event.deltaY < 0 ? -30 : 30,
        });
    }

    //#endregion

    //#region upload tags to Formula textArea

    const uploadOnClickHanlder = () => {

        let isSelectedTag: boolean = false

        let selectedTag: ITag
        let value: IMainArray = [...propsContext!.mainVarible]

        if (value!.length === 0 || isOperationOrParenthesBefore(value)) {
            setTagsWithMode(tagsWithMode.map((tag) => {
                if (tag.mode === "selected") {
                    isSelectedTag = true
                    selectedTag = tag
                }
                return { ...tag, mode: "ordinary" }
            }))

            if (isSelectedTag) {
                propsContext!.setMainVarible(value!.concat(selectedTag!))
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
        <div
            onWheel={tagsOnWheelHandler}
            className="TagPanel__Tags">
            {tagsElement}
        </div>
    </div>
}