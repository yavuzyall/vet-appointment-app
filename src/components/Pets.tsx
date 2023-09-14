import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import backFoto from '../assets/bg.jpg';
import UserContext, { UserContextType } from '../context/UserContext';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { deletePetFromUser } from '../service/DeletePetService';
import { toast } from 'react-toastify';
import { IPet } from '../models/IPet';
import { error } from 'console';


const Pets = () => {


  const auth = getAuth();

  //Pet foto getirme.
  const getImageFromLocalStorage = (userId: string, petId: number): string | null => {
    const key = `user_${userId}_pet_${petId}_photo`;
    return localStorage.getItem(key);
  }

  //-

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }

  const { user, setUser, loading } = useContext(UserContext) as UserContextType;
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pets, setPets] = useState<IPet[]>(user?.pets || []);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPet, setEditingPet] = useState<IPet | null>(null);
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);


  //Use Effects

  // Current user control and assignment.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (currentUser) {
      axios.get(`http://localhost:3000/users?email=${currentUser?.email}`).then(response => {
        if (response.data.length > 0) {
          setUser(response.data[0]);
        }
        setLoadingUser(false);
      }).catch(error => {
        console.error("Kullanıcı bilgileri çekilirken bir hata oluştu");
        setLoadingUser(false);
      });
    } else {
      setLoadingUser(false);
    }
  }, [currentUser]);

  
  useEffect(() => {
    if (user && user.pets) {
      setPets(user.pets);
    }
  }, [user]);

  // Handle Functions

  // Delete an pet with this function.
  const handleDeletePet = (petId: number) => {
    if (user) {
      deletePetFromUser(user.id, petId).then(() => {

        const updatedPets = pets.filter(pet => pet.petId !== petId);
        setPets(updatedPets);

        toast.success('Hayvan başarıyla silindi!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
    }
  };

  const handleEditClick = (pet: IPet) => {
    setEditingPet(pet);
    setIsModalOpen(true);
  }

  // Printing text into the input during input change.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof IPet) => {
    if (editingPet) {
      setEditingPet({
        ...editingPet,
        [field]: e.target.value
      });
    }
  };

  // Saving operations made when the save button is pressed.
  const handleSave = () => {
    if (editingPet && tempPhoto) {
      const key = `user_${user?.id}_pet_${editingPet.petId}_photo`;
      localStorage.setItem(key, tempPhoto);
    }
    if (editingPet && user) {
      const updatedPets = pets.map(pet => {
        if (pet.petId === editingPet.petId) {
          return editingPet;
        }
        return pet;
      });
      setPets(updatedPets);

      axios.put(`http://localhost:3000/users/${user.id}`, {...user, pets: updatedPets})
      .then(response => {
        toast.success('Hayvan bilgileri başarıyla güncellendi!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }).catch(error => {
        console.error("Hayvan bilgileri güncellenirken bir hata oluştu.");
      });
    };

    setIsModalOpen(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempPhoto(base64String);
        };
      reader.readAsDataURL(file);
    };
  };


  if (loadingAuth || loadingUser) {
    return <div className='flex justify-center items-center h-screen text-2xl'>Yükleniyor...</div>;
  }


  return (
    <>
      {isModalOpen && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-4 rounded-md w-1/4'>
            <div className='flex flex-col justify-center items-center'>
              <label htmlFor="name" className='text-lg font-bold'>İsim</label>
              <input type="text" value={editingPet?.name || ''} onChange={(e) => { handleInputChange(e, 'name') }} name='name' className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'/>
              <label htmlFor="age" className='text-lg font-bold'>Yaş</label>
              <input type="number" value={editingPet?.age || ''} onChange={(e) => { handleInputChange(e, 'age') }} name='age'  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
              <label htmlFor="lastVacDate" className='text-lg font-bold'>Son Aşı Tarihi</label>
              <input type="date" value={editingPet?.lastVacDate || ''} onChange={(e) => { handleInputChange(e, 'lastVacDate') }} name='lastVacDate'  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
              <label htmlFor="lastInspectionDate" className='text-lg font-bold'>Son Aşı Tarihi</label>
              <input type="date" value={editingPet?.lastInspectionDate || ''} onChange={(e) => { handleInputChange(e, 'lastInspectionDate') }} name='lastInspectionDate'  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
              <label htmlFor="photo">Fotoğraf</label>
              <input type="file" onChange={handlePhotoChange} name='photo' className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'/>
              <label htmlFor="photo">Not (Açıklama)</label>
              <textarea value={editingPet?.description} onChange={(e) => {handleInputChange(e, "description")}} name="description" id="description" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'></textarea>
            </div>
            <div className='flex justify-around mt-4'>
              <button onClick={() => setIsModalOpen(false)} className='bg-red-500 hover:bg-red-600 transition-all text-white text-md px-1 py-1 rounded-md w-1/3'>İptal</button>
              <button onClick={handleSave} className='bg-indigo-600 hover:bg-indigo-700 transition-all text-white text-md px-1 py-1 rounded-md w-1/3'>Kaydet</button>
            </div>
          </div>
        </div>
      )}
      <div style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.89)), url(${backFoto})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        minHeight: '100vh',
      }}>
        <div>
          {(!user?.pets || user?.pets.length === 0) && (
            <div className='flex justify-center'>
              <div className='flex justify-center flex-col align-middle items-center px-4 py-4 m-6 border w-2/3 rounded-md bg-white'>
                <p className='text-violet-700'>Henüz hayvanınız yok. Hemen bir hayvan ekleyin!</p>
              </div>
            </div>

          )}
          {user?.pets && user.pets.length > 0 && (
            <div className='flex justify-center items-center flex-col'>
              {pets.map(pet => {
                const base64Image = getImageFromLocalStorage(user.id, pet.petId);
                return (

                  <div key={pet.petId} className='flex flex-col justify-between items-center w-4/6 bg-gray-100 p-4 mb-4 rounded-2xl mt-8 border border-indigo-200 shadow-md'>
                    <div className='flex justify-between items-center w-full flex-col md:flex-row'>
                      <div className='flex items-center'>
                        <div className='w-32 h-32 overflow-hidden rounded-full flex-wrap'>
                          {base64Image && <img className='object-cover w-full h-full' src={base64Image} alt={pet.name} />}
                        </div>
                        <div className='flex flex-col ml-4'>
                          <span className='text-xl font-bold'>{pet.name}</span>
                          <span className='text-lg'>{pet.age} yaşında!</span>
                        </div>
                      </div>
                      <div className='flex flex-col mr-5'>
                        <span className='text-lg'><span className='font-medium'>Son Aşı Tarihi:</span>  {pet.lastVacDate ? pet.lastVacDate : "Yok"}</span>
                        <span className='text-lg'><span className='font-medium'>Son Muayene Tarihi:</span>  {pet.lastInspectionDate ? pet.lastInspectionDate : "Yok"}</span>
                      </div>
                      <div className='flex ml-4 flex-wrap md:flex-col space-x-2 md:space-x-0 md:space-y-2'>
                        <button onClick={() => { handleEditClick(pet) }} className='bg-indigo-700 hover:bg-indigo-800 transition-all text-white text-lg px-4 py-1 rounded-md mr-2 md:w-full'>Düzenle</button>
                        <button className='bg-red-500 hover:bg-red-600 transition-all text-white text-lg px-4 py-1 rounded-md mr-2 md:w-full' onClick={() => handleDeletePet(pet.petId)}>Sil</button>
                      </div>
                    </div>
                    <label className='font-bold'>Not (Açıklama)</label>
                    <div className='bg-gray-200 border border-indigo-500 rounded-lg px-4 py-4 mt-2 font-medium w-4/6 text-center'>
                      {pet.description ? pet.description : 'Yok'}
                    </div>
                  </div>
                );
              })}
            </div>)}
        </div>
        <div className='flex justify-center text-center'>
          <div className='mb-4 mt-4'>
            <Link to="../hayvan-ekle" className='border rounded-lg px-2 py-2 bg-violet-700 text-white text-lg hover:bg-violet-800 transition-all'>Hayvan Ekle</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Pets