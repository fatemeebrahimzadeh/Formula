
import { useContext, useEffect, useState } from "react";
import "./MultipleTagsPanelHook.scss"
import { FormulaContext, IFormulaPropsContext, IMainArray, isOperationOrParenthesBefore } from "../../../FormulaRenderContentComponent";
import { faSearch, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ITagWithMode } from "../TagPanelHook/TagPanelHook"
import { ITag } from "../../../../@types/entities/tag";
import Input from "../../../../UI/Input/Input";
import Checkbox from "../../../../UI/Checkbox/Checkbox";
import Toast from "../../../../utils/toast";

export default function MultipleTagsPanelHook(): JSX.Element {

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

    useEffect(() => {
        setTagsWithMode(
            propsContext!.tags.map(tag => {
                return { ...tag, mode: "ordinary", visibility: "visible" }
            })
        )
    }, [propsContext!.tagsAndNumbersTabMode])

    const tagsElement = tagsWithMode.map((tag, index) => {
        return <div
            key={index}
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

        let selectedTags: IMainArray = []
        let value = [...propsContext!.mainVarible]

        if (value!.length === 0 || isOperationOrParenthesBefore(value)) {

            selectedTags.push(`${propsContext!.tagsAndNumbersTabMode.toLocaleUpperCase()}( `)

            setTagsWithMode(tagsWithMode.map((tag) => {
                if (tag.mode === "selected") {
                    isSelectedTag = true
                    selectedTags.push(tag)
                }
                return { ...tag, mode: "ordinary" }
            }))

            selectedTags.push(") ")

            if (isSelectedTag) {
                propsContext!.setMainVarible(value!.concat(selectedTags))
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
        <div
            onWheel={tagsOnWheelHandler}
            className="MultipleTags__Tags">
            {tagsElement}
        </div>
    </div>
}