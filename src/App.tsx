import React, { useState } from 'react';
import "./App.css"
import Tag from './fakeData/Tags/Tags';
import FormulaRenderContentComponent from './FormulaRenderContentComponent/FormulaRenderContentComponent';

function App() {

  const [FRM, onChangeHandler] = useState<string>("")

  return (
    <div className='App'>
      <FormulaRenderContentComponent FRM={FRM} onChangeHandler={(value) => { onChangeHandler(value) }} tags={Tag()} />
    </div>
  );
}

export default App;
