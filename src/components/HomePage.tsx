import React, { useState, useEffect, useContext } from 'react';
import { IUser } from '../models/IUser';
import { User } from 'firebase/auth';
import axios, { all } from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getVets, getVetById } from '../service/VetService';
import { error } from 'console';
import { Link } from 'react-router-dom';
import image1 from '../assets/1.jpg';
import image2 from '../assets/2.jpg';
import image3 from '../assets/3.jpg';
import { AppointmentService, deleteAppointment } from '../service/AppointmentService';
import { IAppointment } from '../models/IAppointment';
import UserContext, { UserContextType } from '../context/UserContext';
import { IVet } from '../models/IVets';
import { toast } from 'react-toastify';
import { IPet } from '../models/IPet';
import { PetService } from '../service/PetService';




const HomePage: React.FC = () => {

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }

  //Context State
  const { user, setUser, setLoading } = useContext(UserContext) as UserContextType;
  //

  //Local States
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [vets, setVets] = useState<IVet[]>([])
  const [pets, setPets] = useState<IPet[]>([])
  const auth = getAuth();

  //Slider İmages
  const images = [
    image1,
    image2,
    image3
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Current user control and assignment.
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth])

  useEffect(() => {
    if (currentUser) {
      axios.get(`http://localhost:3000/users?email=${currentUser?.email}`).then(response => {
        if (response.data.length > 0) {
          setUser(response.data[0]);
        }
        setLoading(false); // Make loading false when user information is received or not received
      }).catch(error => {
        console.error("Kullanıcı bilgileri çekilirken bir hata oluştu");
        setLoading(false); // Make loading false also in case of error
      });
    } else {
      setLoading(false); // If the user is not logged in, set the loading status to false
    }
  }, [currentUser, setUser, setLoading]);


  //Run a function repeatedly at a specific time interval = setInterval
  //Provides slider with a specific time interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);


  //Pulls the user's appointments, animals and vets linked to the appointments
  useEffect(() => {
    const fetchAppointmentsAndVets = async () => {
      if (user?.id) {
        const userAppointments = await AppointmentService.getAppointmentByUserId(user?.id);
        const allVets = await getVets();
        const getPets = await PetService.getAllPetsOfUser(user?.id);
        setVets(allVets);
        setPets(getPets);
        setAppointments(userAppointments);
      }
    }
    fetchAppointmentsAndVets();
  }, [user?.id]);

  // Delete an appointment with this function.
  const handleDelete = async (appointmentId: number) => {
    try {
      await deleteAppointment(appointmentId);
      setAppointments(prevAppointments => prevAppointments.filter(app => app.id !== appointmentId)) //Assigns all appointments that do not match the incoming value (appointmentId) to the new array.
      toast.success('Randevu kaydı başarıyla silindi!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Randevu silinirken bir hata oluştu:", error);
      toast.error('Randevu silinirken bir hata oluştu', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    }
  }

  const getImageFromLocalStorage = (userId: string, petId: number): string | null => {
    const key = `user_${userId}_pet_${petId}_photo`;
    return localStorage.getItem(key);
  }

  return (
    <div>
      <div className='relative overflow-hidden' style={{ height: '650px' }}>
        <img src={images[currentImageIndex]} alt={`Slide ${currentImageIndex}`} className='w-full h-full object-cover transition-transform duration-1000 ease-in-out' />
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
          {images.map((_, idx) => (
            <div key={idx} className={`w-3 h-3 rounded-full ${currentImageIndex === idx ? 'bg-white' : 'bg-gray-400'}`}></div>
          ))}
        </div>
      </div>
      {(!user?.pets || user?.pets.length === 0) && (
        <div className='flex justify-center'>
          <div className='flex justify-center flex-col align-middle items-center px-4 py-4 m-6 border w-2/3 rounded-md'>
            <p className='text-violet-700'>Henüz hayvanınız yok. Hemen bir hayvan ekleyin!</p>
            <Link to='/hayvan-ekle' className='text-violet-100 bg-violet-700 bg-opacity-85 rounded-lg px-1 py-1 mt-4 text-lg hover:bg-violet-800 transition-all'>Hayvan Ekle</Link>
          </div>
        </div>

      )}
      {appointments.length > 0 ?
        <div className='flex justify-center mt-6 relative'>
          <h1 className='text-xl font-semibold z-10 bg-white px-1 relative'>Aktif Randevularınız</h1>
          <div className="absolute inset-x-0 top-1/2 h-px bg-black opacity-25"></div>
        </div> : null}

      {appointments.length > 0 ? (appointments.map(appointment => {
        const vet = vets.find(v => v.id === appointment.veterinarianId);
        const pet = pets.find(p => p.petId === appointment.petId);
        const base64Image = getImageFromLocalStorage(appointment.ownerUserId, Number(pet?.petId));
        return (
          <div key={appointment.id} className='flex justify-center flex-col items-center'>
            <div className='flex flex-col align-middle items-center px-4 py-4 m-6 border w-2/3 rounded-md'>
              <div className='flex gap-32 items-center text-center'>
                <div className=''>
                  <div className='w-40 h-40 overflow-hidden rounded-full flex-wrap'>
                    {base64Image && <img className='object-cover w-full h-full' src={base64Image} alt={pet?.name} />}
                  </div>
                </div>
                <div className='flex flex-col items-start'>
                  <div className='flex items-center justify-center'>
                    <label className='text-lg font-semibold'>Dost Adı:</label>
                    <p className='text-lg ml-1'>{pet?.name}</p>
                  </div>
                  <div className='flex items-center'>
                    <label className='text-lg font-semibold'>Randevu Tarihi:</label>
                    <p className='text-lg ml-1'>{appointment.date}</p>
                  </div>
                  <div className='flex items-center'>
                    <label className='text-lg font-semibold'>Randevu Saati:</label>
                    <p className='text-lg ml-1'>{appointment.time}</p>
                  </div>
                  <div className='flex items-center'>
                    <label className='text-lg font-semibold'>Veteriner:</label>
                    <Link to='veterinerlerimiz'><p className='text-lg ml-1'>{vet?.firstName} {vet?.lastName}</p></Link>
                  </div>
                  <div className='flex items-center'>
                    <label className='text-lg font-semibold'>Randevu Açıklaması:</label>
                    <div className='border px-1 py-1 bg-gray-100 rounded-lg ml-2'>
                      <p className='text-md ml-1'>{appointment.description}</p>
                    </div>
                  </div>

                </div>
              </div>
              <div className='w-1/3'>
                <button onClick={() => handleDelete(Number(appointment.id))} className='text-white bg-red-500 w-full rounded-lg px-1 py-1 mt-4 text-lg hover:bg-red-600 hover:text-xl transition-all'>Randevuyu Sil</button>
              </div>
            </div>

          </div>
        );
      })) : (
        <div className='flex justify-center'>
          <div className='flex justify-center flex-col align-middle items-center px-4 py-4 m-6 border w-2/3 rounded-md'>
            <p className='text-violet-700'>Henüz aktif bir randevunuz yok.</p>
            <Link to="/randevu-al" className='text-violet-800 bg-emerald-300 rounded-lg px-1 py-1 mt-4 text-lg hover:bg-emerald-400 hover:text-violet-700 transition-all'>Hemen Randevu Al</Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage