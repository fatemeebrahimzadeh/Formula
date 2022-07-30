import { fireEvent, render, screen } from "@testing-library/react";
import FormulaRenderContentComponent, { IProps } from "./FormulaRenderContentComponent";

const defaultProps: IProps = {
    FRM: "",
    onChangeHandler: function (value: string): void {
        throw new Error("Function not implemented.");
    },
    tags: []
}

const setup = (props: IProps = defaultProps) => {
    render(<FormulaRenderContentComponent {...props} />)
    return {
        Formula: screen.getByTestId('Formula') as HTMLDivElement,
    }
}

describe('render simple component', () => {
    it('render Formula', () => {
        setup()
        expect(screen.getByTestId('Formula'))
    })

    // it('operation key onChange event', () => {
    //     let Formula: ReturnType<typeof render> = render(<FormulaRenderContentComponent />)
    //     const operationKeys = Formula.getAllByRole('operationKey') as HTMLButtonElement[]
    //     operationKeys.map((operationKey, index) => {
    //         fireEvent.click(operationKey)
    //         switch (operationKey.textContent) {
    //             case "(": case ")": case "*": case "+": case "-": case "/":

    //                 break;
    //             case "<-":
    //                 break;
    //             case "C":
    //                 break;
    //             default:
    //                 break;
    //         }
    //     })
    // })
})