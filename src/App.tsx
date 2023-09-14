import React, {useState} from 'react';
import './App.css';
import { Route, Routes, Router } from 'react-router';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom'
import Footer from './components/Footer';
import Pets from './components/Pets';
import PetAdd from './components/PetAdd';
import UserContext from './context/UserContext';
import { IUser } from './models/IUser';
import { ToastContainer } from 'react-toastify';
import Vets from './components/Vets';
import Appointment from './components/Appointment';

function App() {

  //Current url is useLocation / location.pathname
  const location = useLocation();
  const hideNavbarOnPages = ['/login', '/register'];
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  return (
    <>
      <UserContext.Provider value={{user, setUser, loading, setLoading}}>
      <ToastContainer/>
         {/* Hidebar hiding for other pages */}
        {!hideNavbarOnPages.includes(location.pathname) && <Navbar />}
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          {/* Nested Route (İç İçe) */}
          <Route path='/home/*' element={<Home />} />
        </Routes>
        <Footer />
      </UserContext.Provider>
    </>
  );
}

export default App;
