const API_BASE_URL = 'http://localhost:8000';

export class RecuperarContrasenaApi {
  
  static async solicitarRecuperacion(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/password-reset/request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al solicitar recuperación');
      }

      return {
        success: true,
        message: data.message,
        data
      };
    } catch (error) {
      console.error('Error en solicitarRecuperacion:', error);
      return {
        success: false,
        message: error.message || 'Error de conexión'
      };
    }
  }

  static async validarToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/password-reset/validate/?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      return {
        success: response.ok,
        valid: data.valid,
        message: data.message,
        userEmail: data.user_email,
        data
      };
    } catch (error) {
      console.error('Error en validarToken:', error);
      return {
        success: false,
        valid: false,
        message: 'Error de conexión'
      };
    }
  }

  // CORREGIR: Hacer el método estático
  static async restablecerContrasena(token, password, confirmPassword) {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/password-reset/confirm/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                password: password,
                password_confirm: confirmPassword
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return {
                success: true,
                message: data.message || 'Contraseña restablecida exitosamente'
            };
        } else {
            return {
                success: false,
                message: data.message || 'Error al restablecer la contraseña'
            };
        }
    } catch (error) {
        console.error('Error en restablecerContrasena:', error);
        return {
            success: false,
            message: 'Error de conexión'
        };
    }
  }
}

export default RecuperarContrasenaApi;