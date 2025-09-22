
import axios from "axios";

const consultasApi = axios.create({
    baseURL: 'http://localhost:8000/Modulos/Consultas/'
});

const profesionalesSaludApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Profesionales-Salud/'
});

const atletasApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Atletas/'
});

const citasApi = axios.create({
    baseURL: 'http://localhost:8000/Modulos/Citas/'
});


// Obtener todos los profesionales de salud
export const getAllProfesionales = () => profesionalesSaludApi.get('/');

// Obtener un profesional de salud por userid
export const getProfesionalByUserId = (userId) => profesionalesSaludApi.get(`/?user=${userId}`);

// Obtener todos los atletas
export const getAllAtletas = () => atletasApi.get('/');

// Obtener todas las citas por Profesional de salud
// Updated to reflect common usage - fetching all citas and filtering by profesional_salud_id
export const getCitasByProfesional = (profesionalId) => citasApi.get(`/?profesional_salud=${profesionalId}`);


// Obtener todas las citas por atleta
export const getCitasByAtleta = (atletaId) => citasApi.get(`/?atleta=${atletaId}`);

// Obtener todas las consultas por profesional de salud
export const getConsultasByProfesional = (profesionalId) => consultasApi.get(`/?profesional_salud=${profesionalId}`);

// Obtener una consulta específica
export const getConsultaById = (id) => consultasApi.get(`/${id}/`);

// Crear una nueva consulta con FormData
export const createConsulta = (consultaData) => {
    const formData = new FormData();
    
    // Agregar campos de la consulta
    Object.keys(consultaData).forEach(key => {
        if (key === 'estudios') return;
        if (consultaData[key] !== null && consultaData[key] !== undefined) {
            formData.append(key, consultaData[key]);
        }
    });

    // Agregar estudios
    if (consultaData.estudios?.length > 0) {
        // Solución limpia sin warnings
        const estudiosParaEnviar = consultaData.estudios.map(estudio => {
            // eslint-disable-next-line no-unused-vars
            const { archivo, ...rest } = estudio;
            return rest;
        });
        
        formData.append('estudios', JSON.stringify(estudiosParaEnviar));
        
        // Agregar archivos
        consultaData.estudios.forEach((estudio, index) => {
            if (estudio.archivo instanceof File) {
                formData.append(`estudios_archivos_${index}`, estudio.archivo);
            }
        });
    }

    return consultasApi.post('/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Actualizar una consulta existente
export const updateConsulta = (id, consultaData) => {
    // Si es FormData, usar multipart/form-data
    if (consultaData instanceof FormData) {
        return consultasApi.put(`/${id}/`, consultaData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    
    // Si es un objeto normal, convertir a FormData para manejar archivos
    const formData = new FormData();
    
    // Agregar campos de la consulta
    Object.keys(consultaData).forEach(key => {
        if (key === 'estudios') return;
        if (consultaData[key] !== null && consultaData[key] !== undefined) {
            formData.append(key, consultaData[key]);
        }
    });

    // Agregar estudios
    if (consultaData.estudios?.length > 0) {
        // Solución limpia sin warnings
        const estudiosParaEnviar = consultaData.estudios.map(estudio => {
            // eslint-disable-next-line no-unused-vars
            const { archivo, ...rest } = estudio;
            return rest;
        });
        
        formData.append('estudios', JSON.stringify(estudiosParaEnviar));
        
        // Agregar archivos
        consultaData.estudios.forEach((estudio, index) => {
            if (estudio.archivo instanceof File) {
                formData.append(`estudios_archivos_${index}`, estudio.archivo);
            }
        });
    }

    return consultasApi.put(`/${id}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Eliminar una consulta
export const deleteConsulta = (id) => consultasApi.delete(`/${id}/`);