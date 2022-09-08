import './App.css';
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { MainComponent } from './components/MainComponent';
import { SignInUpComponent } from './components/SignInUpComponent';

function App() {

  const JWT = () => {
    const is = localStorage.getItem('user');
    return (is ? <MainComponent /> : <Navigate to={'/'} />)
  }

  const LoginPage = () => {
    const is = localStorage.getItem('user');
    return (is ? <Navigate to={'/main'} /> : <SignInUpComponent />)
  }

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<JWT />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;