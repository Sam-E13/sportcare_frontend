import axios from "axios";

const categoriasApi = axios.create({
    baseURL: 'http://localhost:8000/Catalogos/Categorias/'
});

// Obtener todas las categorías
export const getAllCategorias = () => categoriasApi.get('/');

// Crear nueva categoría
export const crearCategoria = (categoria) => categoriasApi.post('/', categoria);

// Obtener una categoría por ID
export const getCategoriaById = (id) => categoriasApi.get(`/${id}/`);

// Actualizar una categoría
export const updateCategoria = (id, categoria) => categoriasApi.put(`/${id}/`, categoria);

// Eliminar una categoría
export const deleteCategoria = (id) => categoriasApi.delete(`/${id}/`);