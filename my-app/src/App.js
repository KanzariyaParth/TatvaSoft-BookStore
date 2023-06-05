import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Navigation from './components/Navigation';
import { AuthWrapper } from './context/auth';
import { CartWrapper } from './context/cart';
import { BrowserRouter } from 'react-router-dom';
// import { addIcon } from "../src/assets";

function App() {
  return (
    <>
    <BrowserRouter>
        <AuthWrapper>
            <CartWrapper>

                {/* <div>
                    <div className='loader-wrapper'>
                        <img 
                            src={addIcon}
                            alt='loader'
                        />
                    </div>
                </div> */}

                <Header />
                    <Navigation />
                <Footer />

            </CartWrapper>
      </AuthWrapper>
    </BrowserRouter>
    </>
  );
}

export default App;