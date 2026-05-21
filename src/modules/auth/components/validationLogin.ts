export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(email: string, password: string) {
  const errors: { email?: string; password?: string } = {};
  if (!email) {
    errors.email = "El correo es obligatorio";
  } else if (!emailRegex.test(email)) {
    errors.email = "El correo no es valido";
  }
  if (!password) {
    errors.password = "La contraseña es obligatoria.";
  }
  return errors;
} 

export function validatePasswordRecovery(email: string) {
  const errors: { email?: string; password?: string } = {};
  if (!email) {
    errors.email = "El correo es obligatorio";
  } else if (!emailRegex.test(email)) {
    errors.email = "El correo no es valido";
  }
  return errors;
}

export function validatePasswordRecoveryForm(
  email: string,
  password: string,
  confirmPassword: string
) {
  const errors: { email?: string; password?: string; confirmPassword?: string } = {};

  // Validación del correo
  if (!email) {
    errors.email = "El correo es obligatorio";
  } else if (!emailRegex.test(email)) {
    errors.email = "El correo no es valido";
  }

  // Validación de la contraseña
  if (!password) {
    errors.password = "La contraseña es obligatoria";
  } else {
    if (password.length < 6) {
      errors.password = "Minimo 6 caracteres";
    } else if (password.length > 20) {
      errors.password = "Maximo 20 caracteres";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/.test(password)
    ) {
      errors.password = "Debe incluir mayuscula, minuscula, numero y caracter especial";
    }
  }

  // Validación de repetir contraseña
  if (password !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  return errors;
} 