import React from 'react'

const Footer: React.FC = () => {
    return (
        <footer className="bg-indigo-500 p-4 text-white text-center">
            <p>&copy; {new Date().getFullYear()} Veteriner Kliniği. Tüm Hakları Saklıdır.</p>
            {/* İsterseniz buraya ekstra bağlantılar veya bilgiler ekleyebilirsiniz. */}
        </footer>
    )
}

export default Footer