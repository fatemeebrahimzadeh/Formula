import React from "react";

export interface Panel {
    panelCreator(): JSX.Element;
}

export abstract class PanelCreator {
    public abstract factoryMethod(): Panel;

    public create(): JSX.Element {
        const product = this.factoryMethod();
        return product.panelCreator();
    }
}

export function createPanel(creator: PanelCreator): JSX.Element {
    return creator.create()
}