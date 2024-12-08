import { RequestHandler } from 'express';
import admin from 'firebase-admin';

const isAuth: RequestHandler = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).send('Unauthorized: Invalid token');
  }
};

export default isAuth;
