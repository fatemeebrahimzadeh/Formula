import { PanelCreator, Panel } from "../PanelCreator"
import NumPanelHook from "../PanelHooks/NumPanelHook/NumPanelHook";

class NumPanelCreator extends PanelCreator {
    public factoryMethod(): Panel {
        return new NumPanel();
    }
}
export default NumPanelCreator


class NumPanel implements Panel {
    public panelCreator(): JSX.Element {
        return <NumPanelHook/>
    }
}