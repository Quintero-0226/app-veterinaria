const Appointment = require('../models/Appointment');
const Owner = require('../models/Owner');
const Pet = require('../models/Pet');

exports.getAllAppointments = (req, res) => {
    Appointment.findAllWithDetails((err, appointments) => {
        if (err) return res.status(500).send(err.message);
        res.render('index', { title: 'Panel de Citas', appointments });
    });
};

exports.getCreateForm = (req, res) => {
    Owner.findAll((err, owners) => {
        if (err) return res.status(500).send(err.message);
        Pet.findAll((err, pets) => {
            if (err) return res.status(500).send(err.message);
            res.render('create', { title: 'Agendar Nueva Cita', owners, pets });
        });
    });
};

exports.createAppointment = (req, res) => {
    const { pet_id, service, appointment_date } = req.body;
    Appointment.create({ pet_id, service, appointment_date }, function (err) {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};

exports.deleteAppointment = (req, res) => {
    Appointment.deleteById(req.params.id, function (err) {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};
