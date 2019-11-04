import React from 'react';

import sty from './App.module.scss';

function App() {
  return (
    <div className={sty.app}>
      <div className={sty.logo}>ZERO</div>
      <div>Hello Zero</div>
      <div className={sty.docLink}>↓doc↓</div>
      <a href="https://github.com/Iixianjie/zero">https://github.com/Iixianjie/zero</a>
    </div>
  );
}

export default App;
