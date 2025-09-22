import * as Yup from 'yup';

export const schema = Yup.object().shape({
    username: Yup.string()
        .trim()
        .required('Por favor ingresa tu nombre de usuario'),
    password: Yup.string().trim()
        .required('Por favor ingresa tu contraseña'),
});