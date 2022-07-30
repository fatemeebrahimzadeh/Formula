import { PanelCreator, Panel } from "../PanelCreator"
import MultipleTagsHook from "../PanelHooks/MultipleTagsPanelHook/MultipleTagsPanelHook";

class MultipleTagsCreator extends PanelCreator {
    public factoryMethod(): Panel {
        return new MultipleTags();
    }
}
export default MultipleTagsCreator

class MultipleTags implements Panel {
    public panelCreator(): JSX.Element {
        return <MultipleTagsHook />
    }
}