const Appointment = require('../models/Appointment');
const Owner = require('../models/Owner');
const Pet = require('../models/Pet');

exports.getAllAppointments = (req, res) => {
    try {
        const appointments = Appointment.findAllWithDetails();
        res.render('index', { title: 'Panel de Citas', appointments });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getCreateForm = (req, res) => {
    try {
        const owners = Owner.findAll();
        const pets = Pet.findAll();
        res.render('create', { title: 'Agendar Nueva Cita', owners, pets });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.createAppointment = (req, res) => {
    const { pet_id, service, appointment_date, diagnosis, weight, prescribed_medication } = req.body;
    try {
        Appointment.create({ pet_id, service, appointment_date, diagnosis, weight, prescribed_medication });
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getMedicalHistory = (req, res) => {
    try {
        const appointments = Appointment.findMedicalHistory();

        const historyByPet = appointments.reduce((acc, item) => {
            if (!acc[item.pet_id]) {
                acc[item.pet_id] = {
                    pet_id: item.pet_id,
                    pet_name: item.pet_name,
                    owner_name: item.owner_name,
                    visits: []
                };
            }
            acc[item.pet_id].visits.push(item);
            return acc;
        }, {});

        res.render('history', {
            title: 'Historial Clinico',
            historyGroups: Object.values(historyByPet)
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.deleteAppointment = (req, res) => {
    try {
        Appointment.deleteById(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};
