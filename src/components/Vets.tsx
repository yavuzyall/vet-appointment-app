import React, { useEffect, useState } from 'react';
import { IVet } from '../models/IVets';
import { getVets } from '../service/VetService';
import backFoto2 from '../assets/bgvet.jpg';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';



const Vets = () => {

    const [vets, setVets] = useState<IVet[]>([])

    useEffect(() => {
        getVets().then(data => {
            setVets(data);
        })
    }, []);

    return (
        <div style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.89)), url(${backFoto2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
        }}>
            <h1 className='items-center m-auto text-center text-2xl font-bold text-gray-800 mt-4'>Veterinerlerimiz</h1>
            <div className='container px-4 py-12 flex gap-6 justify-center flex-wrap'>
                {vets.map(vet => (
                    <div key={`${vet.firstName}-${vet.lastName}`} className='bg-white p-6 rounded shadow-lg w-1/3 border border-gray-200 flex flex-col'>
                        <div className='flex justify-start space-x-6 text-center items-center h-40 w-full'>
                            <div className='h-32 w-32 rounded-full border overflow-hidden shadow-lg'>
                                <img src={vet.vetPhoto} alt={vet.firstName} className='object-cover w-full h-full' />
                            </div>
                            <div className='flex flex-col items-start'>
                                <h2 className='text-2xl font-bold text-gray-700'>{vet.firstName} {vet.lastName}</h2>
                                <p className='text-lg'>Yaş: {vet.age}</p>
                            </div>
                        </div>
                        <div className='border px-2 py-2 flex-grow rounded-xl border-indigo-300' style={{ background: `linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url(${backFoto2})` }}>
                            <p className='font-medium'>{vet.description}</p>
                        </div>
                        <div className='mt-auto pt-4 flex justify-center gap-6'>
                            <div className='flex gap-1 items-center'>
                                <ThumbUpIcon className='text-green-600'/>
                                <p className='text-green-600 font-semibold'>{vet.goodRate}</p>
                            </div>
                            <div className='flex gap-1 items-center'>
                                <ThumbDownIcon className='text-red-600'/>
                                <p className='text-red-600 font-semibold'> {vet.badRate}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Vets