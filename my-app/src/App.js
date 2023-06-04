import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Navigation from './components/Navigation';
import { AuthWrapper } from './context/auth';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <>
    <BrowserRouter>
      <AuthWrapper>
        <Header />

          {/* <main> */}
            <Navigation />
          {/* </main> */}
        
        <Footer />
      </AuthWrapper>
    </BrowserRouter>
    </>
  );
}

export default App;