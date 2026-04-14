const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");
const validateRequest = require("../middleware/validationMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAuthInput'
 *           example:
 *             name: John Doe
 *             email: john@example.com
 *             password: secret123
 *     responses:
 *       201:
 *         description: User registered
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User registered successfully
 *               data:
 *                 id: 665f0c12bb32be9720a36e5a
 *                 name: John Doe
 *                 email: john@example.com
 *                 role: user
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageErrorResponse'
 */
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password length must be at least 6 characters"),
  ],
  validateRequest,
  register
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user and receive JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *           example:
 *             email: user@example.com
 *             password: User123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Login successful
 *               data:
 *                 token: jwt-token
 *                 user:
 *                   id: 665f0c12bb32be9720a36e5a
 *                   name: Normal User
 *                   email: user@example.com
 *                   role: user
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageErrorResponse'
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("Password length must be at least 6 characters")
  ],
  validateRequest,
  login
);

module.exports = router;
