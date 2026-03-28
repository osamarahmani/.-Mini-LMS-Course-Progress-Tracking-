// middleware/authMiddleware.js

const verifyAdmin = (req, res, next) => {
  // 1. Get the user data from the headers
  // (Assuming you're passing user info or a token)
  const userRole = req.headers['x-user-role']; 

  // 2. Check if the role is 'admin'
  if (userRole !== 'admin') {
    return res.status(403).json({ 
      message: "Access Denied: You do not have administrator privileges." 
    });
  }

  // 3. If they are admin, let them through to the next function
  next();
};

module.exports = { verifyAdmin };