import React, { useContext } from 'react';
import UserContext, { UserContextType } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';
import { error } from 'console';


const Navbar: React.FC = () => {

  const userContext = useContext(UserContext);

  // If the navbar is not in the UserContextProvider it will be null and will give an error.
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }

  //Context State
  const { setUser } = useContext(UserContext) as UserContextType;
  //

  const navigate = useNavigate();

  // Logout function in combination with Firebase. 
  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("Oturum başarıyla kapatıldı");
      setUser(null); // User will be null.
      navigate("/login");
    }).catch((error) => {
      console.error("Oturum kapatılırken bir hata oluştu: ", error);

    });
  }

  return (
    <nav className='bg-indigo-500 p-2 text-white'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='flex space-x-6'>
          <Link to="/home" className='hover:underline hover:text-lg hover:font-bold transition-all'>Anasayfa</Link>
          <Link to="home/hayvanlarim" className='hover:underline hover:text-lg hover:font-bold transition-all'>Hayvanlarım</Link>
          <Link to="home/veterinerlerimiz" className='hover:underline hover:text-lg hover:font-bold transition-all'>Veterinerlerimiz</Link>
          <Link to="home/randevu-al" className='hover:underline hover:text-lg hover:font-bold transition-all'>Randevu Al</Link>
        </div>
        <div>
          <button className='bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-all' onClick={handleSignOut}>Çıkış Yap</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar