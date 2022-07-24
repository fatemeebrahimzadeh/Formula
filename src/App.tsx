import React, { useState } from 'react';
import "./App.css"
import Tag from './fakeData/Tags/Tags';
import FormulaRenderContentComponent, { IFormulaPropsContext } from './FormulaRenderContentComponent/FormulaRenderContentComponent';

export const FormulaContext = React.createContext<IFormulaPropsContext | undefined>(undefined);

function App() {

  const [FRM, onChangeHandler] = useState("")

  return (
    <div className='App'>
      <FormulaContext.Provider
        value={{
          tags: Tag(),
          FRM: FRM,
          onChangeHandler: (value) => { onChangeHandler(value.toString()) },
          isSubmited: false
        }}>
        <FormulaRenderContentComponent />
      </FormulaContext.Provider>
    </div>
  );
}

export default App;
