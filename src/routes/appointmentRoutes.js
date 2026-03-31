const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { isAuthenticated, isVeterinario } = require('../middleware/auth');

// Vista pública del panel
router.get('/', appointmentController.getAllAppointments);

// Criterio 1: solo veterinario/admin puede crear citas (campos médicos)
router.get('/create', isVeterinario, appointmentController.getCreateForm);
router.post('/create', isVeterinario, appointmentController.createAppointment);

// Criterio 2: solo usuarios autenticados pueden borrar registros
router.post('/delete/:id', isAuthenticated, appointmentController.deleteAppointment);

module.exports = router;