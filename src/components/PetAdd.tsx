import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addPetToUser } from '../service/AddPetService';
import UserContext from '../context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';


const PetAdd: React.FC = () => {

    //Photo Convert
    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }
    //-

    const saveImageToLocalStorage = (userId: string, petId: number, base64Image: string): void => {
        const key = `user_${userId}_pet_${petId}_photo`;
        localStorage.setItem(key, base64Image);
    };

    const user = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            name: '',
            type: '',
            age: '',
            photo: null,
            lastVacDate: '',
            lastInspectionDate: '',
            description: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Hayvanın adı gereklidir.'),
            type: Yup.string().required('Hayvanın türü gereklidir.'),
            age: Yup.number().required('Hayvanın yaşı gereklidir.').positive().integer(),
            lastVacDate: Yup.date(),
            lastInspectionDate: Yup.date(),
        }),
        onSubmit: async (values) => {
            let photoPath = '';
            const pet = {
                petId: Date.now(),
                name: values.name,
                type: values.type,
                age: parseInt(values.age),
                photo: photoPath,
                lastVacDate: values.lastVacDate,
                lastInspectionDate: values.lastInspectionDate,
                description: values.description
            }
            if (user && user.user) {
                const formData = new FormData();

                if (values.photo) {
                    try {
                        const base64Image = await convertImageToBase64(values.photo as File);
                        saveImageToLocalStorage(user.user.id, pet.petId, base64Image);
                        pet.photo = base64Image;
                    } catch (error) {
                        console.error("Fotoğraf dönüştürülürken bir hata oluştur:", error);

                    }
                }

                addPetToUser(user.user.id, pet);
            } else {
                alert('Kullanıcı bilgisi bulunamadı.');
            }

            if (user && user.user && user.user.id) {
                addPetToUser(user?.user?.id, pet).then(() => {
                    toast.success('Hayvan başarıyla kaydedildi!', {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    formik.resetForm();

                }).catch(error => {
                    toast.error('Bir hata oluştu!', {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
            }
        }
    })

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-4 lg:px-8'>
            <div className='max-w w-3/5 space-y-8'>
                <h2 className='text-center text-3xl font-bold text-gray-800'>Hayvan Kaydı</h2>
                <form className='mt-8 space-y-6' onSubmit={formik.handleSubmit}>
                    <div>
                        <label htmlFor="name" className='font-bold'>Hayvanın Adı:</label>
                        <input type="text" placeholder='Örn: Kitty' {...formik.getFieldProps('name')} name="name" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.name && formik.errors.name && <div className='text-red-500'>{formik.errors.name}</div>}
                    </div>
                    <div>
                        <label htmlFor="type" className='font-bold'>Hayvanın Türü:</label>
                        <select {...formik.getFieldProps('type')} name="type" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'>
                            <option value="" label='Tür Seçin'></option>
                            <option value="cat" label='Kedi'></option>
                            <option value="dog" label='Köpek'></option>
                            <option value="bird" label='Kuş'></option>
                        </select>
                        {formik.touched.type && formik.errors.type && <div className='text-red-500'>{formik.errors.type}</div>}
                    </div>
                    <div>
                        <label htmlFor="age" className='font-bold'>Hayvanın Yaşı:</label>
                        <input type="number" {...formik.getFieldProps('age')} name="age" placeholder='Örn: 8' className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.age && formik.errors.age && <div className='text-red-500'>{formik.errors.age}</div>}
                    </div>
                    <div>
                        <label htmlFor="lastVacDate" className='font-bold'>Son Aşı Tarihi (Olmadıysa Boş Bırakınız):</label>
                        <input type="date" {...formik.getFieldProps('lastVacDate')} name="lastVacDate" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.lastVacDate && formik.errors.lastVacDate && <div className='text-red-500'>{formik.errors.lastVacDate}</div>}
                    </div>
                    <div>
                        <label htmlFor="lastInspectionDate" className='font-bold'>Son Muayene Tarihi (Olmadıysa Boş Bırakınız):</label>
                        <input type="date" {...formik.getFieldProps('lastInspectionDate')} name="lastInspectionDate" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.lastInspectionDate && formik.errors.lastInspectionDate && <div className='text-red-500'>{formik.errors.lastInspectionDate}</div>}
                    </div>
                    <div>
                        <label htmlFor="photo" className='font-bold'>Hayvanınızın Profil Fotoğrafı:</label>
                        <input type="file" onChange={(event) => {
                            formik.setFieldValue('photo', event.currentTarget.files ? event.currentTarget.files[0] : null);
                        }} className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                            placeholder='Hayvanınızın Profil Fotoğrafını Yükleyin.' />
                    </div>
                    <div>
                        <label htmlFor="description" className='font-bold'>Hayvanınız İçin Detaylı Açıklama:</label>
                        <textarea
                            placeholder='Örn: Hayvanınızın alerjileri, sevdiği sevmediği davranışlar...'
                            id="description"
                            className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                            {...formik.getFieldProps('description')}
                            name="description"
                        >
                        </textarea>
                        {formik.touched.description && formik.errors.description && <div className='text-red-500'>{formik.errors.description}</div>}

                    </div>
                    <div>
                        <button type='submit' className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'

                        >Kaydet</button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default PetAdd