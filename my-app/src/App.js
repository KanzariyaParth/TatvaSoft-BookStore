import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Navigation from './components/Navigation';
import { BrowserRouter } from 'react-router-dom';
import { loadIcon } from "../src/assets";

import { Provider } from 'react-redux';
import store from './State';

function App() {
  return (
    <>
    <BrowserRouter>

        <Provider store={store}>

            <div>
                <div className='loader-wrapper' id="load">
                    <img 
                        src = { loadIcon }
                        alt = 'Loading...'
                    />
                    <h1 className='txt-lb'> Loading... </h1>
                </div>
            </div>

            <Header />
                <Navigation />
            <Footer />

        </Provider>

    </BrowserRouter>
    </>
  );
}

export default App;