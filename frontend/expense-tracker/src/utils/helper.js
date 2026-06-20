// validateEmail: función que verifica si un email tiene formato válido
// export: permite importar esta función desde otros archivos
export const validateEmail = (email) => {
  // regex (expresión regular): patrón para validar formato de email
  // /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  // ^ = inicio, $ = final
  // [^\s@]+ = uno o más caracteres que NO sean espacio ni @
  // @ = debe tener un @
  // \. = debe tener un punto
  // .test(email) devuelve true si el email coincide con el patrón, false si no
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
