import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from '../service/AuthService';
import { Timestamp } from 'firebase/firestore';
import { UserService } from '../service/UserService';
import { IUser } from '../models/IUser';

const Register: React.FC = () => {
    const authService = new AuthService();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Adınızı giriniz'),
            lastName: Yup.string().required('Soyadınızı giriniz'),
            phoneNumber: Yup.string().length(10, "Telefon numarası başında 0 olmadan 10 karakter olmalıdır.").required('Telefon numaranızı giriniz'),
            email: Yup.string().email('Geçerli bir e-posta adresi giriniz').required('E-posta adresinizi giriniz'),
            password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifrenizi giriniz'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor').required('Şifre tekrarını giriniz')
        }),
        onSubmit: async values => {
            authService.signUpWithEmailandPassword(values.email, values.password).then(async (userId) => {
                if (userId) {
                    const newUser: IUser = {
                        ...values,
                        id: userId
                    };
                    try {
                        await UserService.register(newUser);
                        console.log("Kullanıcı başarıyla kaydedildi.");
                        navigate("/");
                    } catch (error) {
                        console.error(error);
                    }
                }
            }).catch(err => {
                alert(err);
            });
        }

    })

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w w-md w-full space-y-8'>
                <h2 className='mt-6 text-center text-3xl font-bold text-gray-800'>Kayıt Ol</h2>
                <form className='mt-8 space-y-6' onSubmit={formik.handleSubmit}>
                    <div>
                        <label htmlFor="firstName" className='sr-only'>Ad:</label>
                        <input type="text" {...formik.getFieldProps('firstName')} name='firstName' placeholder="Adınız" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.firstName && formik.errors.firstName ? (
                            <div className='text-red-500'>{formik.errors.firstName}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="lastName" className='sr-only'>Soyad:</label>
                        <input type="text" {...formik.getFieldProps('lastName')} name='lastName' placeholder="Soyadınız" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.lastName && formik.errors.lastName ? (
                            <div className='text-red-500'>{formik.errors.lastName}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className='sr-only'>Telefon Numarası:</label>
                        <input type="text" {...formik.getFieldProps('phoneNumber')} name='phoneNumber' placeholder="Telefon Numaranız" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                            <div className='text-red-500'>{formik.errors.phoneNumber}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="email" className='sr-only'>Email:</label>
                        <input type="email" {...formik.getFieldProps('email')} name='email' placeholder="Mail Adresiniz" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.email && formik.errors.email ? (
                            <div className='text-red-500'>{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="" className='sr-only'>Şifre:</label>
                        <input type="password" {...formik.getFieldProps('password')} name='password' placeholder="Şifreniz" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.password && formik.errors.password ? (
                            <div className='text-red-500'>{formik.errors.password}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="" className='sr-only'>Şifre Tekrarı:</label>
                        <input type="password" {...formik.getFieldProps('confirmPassword')} name='confirmPassword' placeholder="Şifre Tekrarı" className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className='text-red-500'>{formik.errors.confirmPassword}</div>
                        ) : null}
                    </div>
                    <div>
                        <button type='submit' className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>Kayıt Ol</button>
                    </div>
                    <div className='mt-2 text-center'>
                        <Link to='/login' className='text-indigo-600 hover:text-indigo-900'>Giriş Yap</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register