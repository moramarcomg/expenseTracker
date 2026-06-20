// require: importa el modelo User y la librería jsonwebtoken
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// generateToken: función que crea un token JWT (JSON Web Token)
// jwt.sign(): firma un token con un payload (datos) y una clave secreta
// { id }: payload del token (datos que guardamos dentro del token)
// expiresIn: "1h" → el token expira en 1 hora
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// formatUserResponse: función que limpia los datos del usuario para la respuesta
// user: objeto completo de MongoDB (incluye password, etc.)
// Retorna solo los campos que queremos exponer al frontend
const formatUserResponse = (user) => ({
  fullName: user.fullName,
  email: user.email,
  profileImageUrl: user.profileImageUrl,
  _id: user._id,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  __v: user.__v,
});

// exports.registerUser: exporta la función para usarla en authRoutes
// async (req, res): req = petición del cliente, res = respuesta del servidor
exports.registerUser = async (req, res) => {
  // Destructuración de req.body: extrae fullName, email, password del body de la petición
  const { fullName, email, password, profileImageUrl } = req.body;

  // Validación: si falta algún campo obligatorio, devuelve error 400
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    // User.findOne({ email }): busca en MongoDB un usuario con ese email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    // User.create(): crea y guarda un nuevo documento en MongoDB
    // El pre("save") hook de User.js encripta la contraseña automáticamente
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    // Genera el token JWT para el nuevo usuario
    const token = generateToken(user._id);

    // res.status(201): 201 = Created (recurso creado exitosamente)
    res.status(201).json({
      success: true,
      id: user._id,
      user: formatUserResponse(user),  // Solo datos públicos
      token,
    });
  } catch (error) {
    // catch: captura cualquier error que ocurra en el try
    res.status(400).json({
      success: false,
      message: error.message,  // Mensaje de error de Mongoose o del sistema
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    // Busca el usuario por email
    const user = await User.findOne({ email });

    // user.matchPassword(): método personalizado definido en el modelo User
    // Compara la contraseña ingresada con la hasheada en la BD
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.status(200).json({  // 200 = OK
        success: true,
        id: user._id,
        user: formatUserResponse(user),
        token,
      });
    } else {
      // 401 = Unauthorized (credenciales incorrectas)
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    // req.user.id: viene del middleware protect (authMiddleware.js)
    // protect buscó el usuario y lo puso en req.user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({  // 404 = Not Found
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      id: user._id,
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
