import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../service/AuthService';
import { UserService } from '../service/UserService';

const Login: React.FC = () => {

    const authService = new AuthService();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Email gereklidir.').email('Doğru olmayan mail adresi.'),
            password: Yup.string().required('Password gereklidir.').min(6, 'Şifreniz en az 6 karakter olmalı.')
        }),
        onSubmit: (values) => {
            authService.signInWithEmailandPassword(values.email, values.password).then(async (userId) => {
                if (userId) {
                    
                    const user = await UserService.getUserById(userId);
                    if (user) {
                        
                        navigate('/home');
                    } else {
                        setErrorMessage("Kullanıcı bilgileri alınamadı.");
                    }
                }
            }).catch(err => {
                
                if (err.message.includes('user-not-found')) {
                    setErrorMessage("Kullanıcı bulunamadı")
                } else if (err.message.includes('wrong-password')) {
                    setErrorMessage("Parola veya mail adresi yanlış")
                } else {
                    setErrorMessage("Bilinmeyen bir hata oluştu")
                }
            })
        }

    })

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <h2 className='mt-6 text-center text-3xl font-bold text-gray-800'>Giriş</h2>
                <form onSubmit={formik.handleSubmit} className='mt-8 space-y-6'>
                    <div>
                        <label className='sr-only'>Email:</label>
                        <input type="email" {...formik.getFieldProps('email')} name='email' className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='Mail adresini girin' />
                        {formik.touched.email && formik.errors.email ? (<div className='text-red-500'>{formik.errors.email}</div>) : null}
                    </div>
                    <div>
                        <label className='sr-only'>Password:</label>
                        <input type="password" {...formik.getFieldProps('password')} name='password' placeholder='Şifrenizi girin.' className='apperance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.password && formik.errors.password ? (<div className='text-red-500'>{formik.errors.password}</div>) : null}
                    </div>
                    {errorMessage && <div className='alert alert-danger text-red-500'>{errorMessage}</div>}
                    <button type='submit' className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:bg-indigo-800'>Giriş Yap</button>
                    <div className='mt-2 text-center'>
                        <Link to="/register" className='text-indigo-600 hover:text-indigo-900'>Kayıt Ol</Link>
                    </div>
                    <div className='mt-2 flex justify-between items-center'>
                        <label className='flex items-center'>
                            <input type="checkbox" className='form-checkbox h-4 w-4 text-indigo-600 cursor-pointer' />
                            <span className='text-sm text-indigo-600 hover:text-indigo-900 cursor-pointer ml-1'>Beni Hatırla.</span>
                        </label>

                        <a href="/forgot-password" className='text-sm text-indigo-600 hover:text-indigo-900'>Şifremi Unuttum!</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login