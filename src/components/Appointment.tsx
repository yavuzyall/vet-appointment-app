import React, { useState, useEffect, useContext } from 'react';
import { getVets } from '../service/VetService';
import { UserService } from '../service/UserService';
import UserContext, { UserContextType } from '../context/UserContext';
import { IVet } from '../models/IVets';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { AppointmentService } from '../service/AppointmentService';
import { createAppointment, getAppointments } from '../service/AppointmentService';
import { IAppointment } from '../models/IAppointment';
import { toast } from 'react-toastify';


const Appointment: React.FC = () => {

    const [appointments, setAppointments] = useState<IAppointment[]>([])
    const [veterinarians, setVeterinarians] = useState<IVet[]>([]);

    // useContext;
    const { user, setUser } = useContext(UserContext) as UserContextType;

    //Bringing in veterinarians and appointments
    useEffect(() => {
        async function fetchData() {
            const vets = await getVets();
            setVeterinarians(vets);
        };

        async function fetchAppointments() {
            const fetchedAppointments = await getAppointments();
            setAppointments(fetchedAppointments);
        }
        fetchData();
        fetchAppointments();
    }, []);

    //Is there an appointment for the incoming date and time data?
    const isTimeSlotAvailable = (time: string, date: string) => {
        return !appointments.some(appointment => appointment.time === time && appointment.date === date);
    }

    const handleAppointmentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }


    // Managing and validating forms.
    const formik = useFormik({
        initialValues: {
            petId: '',
            vetId: '',
            date: '',
            time: '',
            description: ''
        },
        validationSchema: yup.object({
            petId: yup.number().required('Hayvan seçimi zorunludur'),
            vetId: yup.number().required('Veteriner seçimi zorunludur'),
            date: yup.string().required('Randevu tarihi zorunludur'),
            time: yup.string().required('Randevu saati zorunludur'),
            description: yup.string()
        }),
        onSubmit: async (values) => {
            const newAppointment: IAppointment = {
                date: values.date,
                time: values.time,
                description: values.description,
                petId: Number(values.petId),
                ownerUserId: user?.id || '',
                veterinarianId: Number(values.vetId)
            };

            try {
                const createdAppointment = await createAppointment(newAppointment);
                toast.success('Randevu başarıyla oluşturuldu', {
                    position: 'bottom-right',
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                formik.resetForm();

            } catch (error) {
                console.error("Randevu oluşturulamadı:", error);
                toast.error('Randevu oluşturulurken bir hata meydana geldi', {
                    position: 'bottom-right',
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

        }
    })

    return (
        <div className='min-h-screen flex justify-center bg-gray-50 py-12 px-4 sm:px-4 lg:px-8'>
            <div className='max-w w-2/5 space-y-8'>
                <h2 className='text-center text-3xl font-bold text-gray-800'>Randevu Oluştur</h2>
                <form onSubmit={formik.handleSubmit} className='mt-8 space-y-6'>
                    <div>
                        <label className='font-bold'>
                            Hayvanınız:
                        </label>
                        <select
                            name="petId"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.petId}
                            className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                        >
                            <option value="" label="Hayvan Seçin" />
                            {user && user.pets ? user.pets.map(pet => (
                                <option key={pet.petId} value={pet.petId}>
                                    {pet.name}
                                </option>
                            )) : null}
                        </select>
                        {formik.touched.petId && formik.errors.petId ? <div className='text-red-500'>{formik.errors.petId}</div> : null}

                    </div>
                    <div>
                        <label className='font-bold'>
                            Veteriner Hekim:
                        </label>
                        <select onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.vetId} name="vetId" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'>
                            <option value="" label='Veteriner Hekim Seçin' />
                            {veterinarians.map(vet => (
                                <option key={vet.id} value={vet.id}>
                                    {vet.firstName} {vet.lastName}
                                </option>
                            ))}
                        </select>
                        {formik.touched.vetId && formik.errors.vetId ? <div className='text-red-500'>{formik.errors.vetId}</div> : null}

                    </div>
                    <div>
                        <label className='font-bold'>
                            Randevu Tarihi:
                        </label>
                        <input
                            type='date'
                            name='date'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.date}
                            min={new Date().toISOString().split('T')[0]}
                            className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                        />
                        {formik.touched.date && formik.errors.date ? <div className='text-red-500'>{formik.errors.date}</div> : null}

                    </div>
                    <div>
                        <label className='font-bold'>
                            Uygun Randevu Saatleri:
                        </label>
                        <select
                            name="time"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.time}
                            className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                        >
                            <option value="" label='Randevu Saati Seçin' />
                            {Array.from({ length: 9 }, (_, i) => 8 + i).map((hour) => {
                                const timeValue = `${hour}:00`;
                                if (isTimeSlotAvailable(timeValue, formik.values.date)) {
                                    return (
                                        <option key={hour} value={timeValue}>
                                            {timeValue}
                                        </option>
                                    );
                                }
                                return null;
                            })}
                        </select>

                        {formik.touched.time && formik.errors.time ? <div className='text-red-500'>{formik.errors.time}</div> : null}
                    </div>
                    <div>
                        <label className='font-bold'>
                            Randevu Açıklaması (Opsiyonel):
                        </label>
                        <textarea onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.description} placeholder='Randevu hakkında bilgi girin...' name="description" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'></textarea>
                        {formik.touched.description && formik.errors.description ? <div className='text-red-500'>{formik.errors.description}</div> : null}

                    </div>

                    <button
                        type='submit'
                        className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    >
                        Randevu Oluştur
                    </button>
                </form>
            </div>
        </div >
    )
}

export default Appointment