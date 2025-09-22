import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import General from './General';
import EditAtletaModal from './EditAtletaModal';
import { getAtletaByUserId, updateAtleta } from './api/atletaApi';
import { useAuthContext } from "app/contexts/auth/context";

export default function AthleteProfile() {
  const { isAuthenticated, user } = useAuthContext();
  const [atletaData, setAtletaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchAtletaData = async () => {
    setLoading(true);
    try {
      if (!isAuthenticated || !user?.id) {
        navigate('/login');
        return;
      }

      const response = await getAtletaByUserId(user.id);
      
      if (response.data && response.data.length > 0) {
        setAtletaData(response.data[0]);
      } else {
        setError("No se encontró información de atleta");
      }
    } catch (err) {
      console.error("Error al cargar datos del atleta:", err);
      setError(err.response?.data?.message || "Error al cargar datos");
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAtletaData();
  }, [isAuthenticated, user, navigate]);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProfile = async (formData) => {
    try {
      // Asegurarse de que deportes sea un array
      let deportesData = formData.deportes;
      if (typeof deportesData === 'string') {
        deportesData = deportesData.split(',').map(id => id.trim()).filter(id => id);
      }

      const dataToSend = {
        ...formData,
        deportes: deportesData
      };

      const response = await updateAtleta(atletaData.id, dataToSend);
      if (response.status === 200 || response.status === 204) {
        // Recargar los datos del atleta para reflejar los cambios
        await fetchAtletaData();
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-dark-500 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 dark:bg-dark-500 rounded w-full"></div>
          <div className="h-64 bg-gray-200 dark:bg-dark-500 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 sm:p-6 text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-dark-700 rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-dark-50">
            Perfil del Atleta
          </h3>
          <div className="my-4 h-px bg-gray-200 dark:bg-dark-500" />
        </div>
        
        {atletaData && <General atletaData={atletaData} onEdit={handleEditProfile} />}
        
        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-dark-100 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      {atletaData && (
        <EditAtletaModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          atletaData={atletaData}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}