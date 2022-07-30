import { PanelCreator, Panel } from "../PanelCreator"
import TagPanelHook from "../PanelHooks/TagPanelHook/TagPanelHook";

class TagPanelCreator extends PanelCreator {
    public factoryMethod(): Panel {
        return new TagPanel();
    }
}
export default TagPanelCreator

class TagPanel implements Panel {
    public panelCreator(): JSX.Element {
        return <TagPanelHook/>
    }
}