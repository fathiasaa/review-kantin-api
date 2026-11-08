
import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { validate } from '../middlewares/validate.ts';
import {
  registerSchema,
  loginSchema,
} from '../schemas/authSchema.ts';
import { authenticate } from '../middlewares/authenticate.ts';

const authRouter = Router();
const authController = new AuthController();

// POST /auth/register
authRouter.post(
  '/register',
  validate(registerSchema, 'body'),
  (req, res, next) => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Registrasi pengguna baru'
    /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/RegisterInput' }
    } */
    // #swagger.responses[201] = { description: 'Registrasi berhasil' }

    return authController.register(req, res, next);
  }
);

// POST /auth/login
authRouter.post(
  '/login',
  validate(loginSchema, 'body'),
  (req, res, next) => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Login pengguna'
    /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/LoginInput' }
    } */
    // #swagger.responses[200] = { description: 'Login berhasil' }
    // #swagger.responses[401] = { description: 'Email atau password salah' }

    return authController.login(req, res, next);
  }
);


// GET /auth/me
authRouter.get(
  '/me',
  authenticate,
  (req, res, next) => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Melihat profil pengguna yang login'
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.responses[200] = { description: 'Profil pengguna' }
    // #swagger.responses[401] = { description: 'Token tidak valid atau tidak ada' }

    return authController.getMe(req, res, next);
  }
);


export { authRouter };
