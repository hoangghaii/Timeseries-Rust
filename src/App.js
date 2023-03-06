import init, { main } from './wasm';
import { useEffect } from 'react';
import { config, data } from './demo/mock-data';

function App() {
  function wasmMain() {
    const result = main(data, config);
    console.log('result', result);
  }

  useEffect(() => {
    const initialize = async () => {
      await init();
      wasmMain();
    };
    initialize();
  }, []);

  return <div>Learn React</div>;
}

export default App;
