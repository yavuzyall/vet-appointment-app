import { onAuthStateChanged } from "firebase/auth"
import { useEffect } from "react"
import { auth } from "../firebaseConfig"
import { Route, Routes, useNavigate } from "react-router-dom";
import Pets from "./Pets";
import PetAdd from "./PetAdd";
import Vets from "./Vets";
import Appointment from "./Appointment";
import HomePage from "./HomePage";

export default function Home() {
  const navigate = useNavigate();
  const authorized = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        localStorage.setItem("uid", user.uid);
      }
    });
  };
  useEffect(() => {
    authorized()
  }, [])

  return <>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path='hayvanlarim' element={<Pets />} />
      <Route path='hayvan-ekle' element={<PetAdd />} />
      <Route path='veterinerlerimiz' element={<Vets />} />
      <Route path='randevu-al' element={<Appointment />} />
    </Routes>
  </>
}