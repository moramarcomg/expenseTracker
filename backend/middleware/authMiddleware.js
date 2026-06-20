const jwt = require("jsonwebtoken");  // jsonwebtoken: crea y verifica tokens JWT
const User = require("../models/User");

// protect: middleware que protege rutas (requiere autenticación)
// req: petición, res: respuesta, next: función para pasar al siguiente middleware
const protect = async (req, res, next) => {
  let token;

  // Verifica si el header Authorization existe y empieza con "Bearer "
  // req.headers.authorization: ejemplo → "Bearer eyJhbGciOiJIUzI1NiIs..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // split(" ") separa "Bearer <token>" en ["Bearer", "<token>"]
    // [1] obtiene el segundo elemento (el token)
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    // return res.status(401): 401 = No autorizado
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }

  try {
    // jwt.verify(): verifica que el token sea válido y no haya expirado
    // decoded = { id: "...", iat: ..., exp: ... } (datos que guardamos al crear el token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca el usuario en MongoDB por el id del token
    // .select("-password"): excluye el campo password de la respuesta
    req.user = await User.findById(decoded.id).select("-password");

    // next(): pasa al siguiente middleware o al controlador
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid",
    });
  }
};

// Exporta como objeto { protect } para poder agregar más middlewares después
module.exports = { protect };
