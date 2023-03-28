const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authMiddleware(req, res, next) {
  // Get the JWT token from the request headers
  let token = req.headers.authorization;
    console.log(token,'token')
  // If there is no token, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token using the secret key
    const bearer = 'Bearer ';
     token = token.replace(bearer, '');
    const decoded = jwt.verify(token,process.env.JWT_KEY);

    // Attach the user ID to the request object
    req.user_id = decoded.user_id;

    // Call the next middleware function
    next();
  } catch (err) {
    // If the token is invalid or has expired, return a 401 Unauthorized response
    return res.status(401).json({ message: 'Unauthorized' });
  }
}



module.exports = authMiddleware;