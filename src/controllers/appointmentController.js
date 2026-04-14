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
    const { pet_id, service, appointment_date, diagnosis, weight, prescribed_medication } = req.body;
    Appointment.create({
        pet_id,
        service,
        appointment_date,
        diagnosis,
        weight,
        prescribed_medication
    }, function (err) {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};

exports.getMedicalHistory = (req, res) => {
    Appointment.findMedicalHistory((err, appointments) => {
        if (err) return res.status(500).send(err.message);

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
    });
};

exports.deleteAppointment = (req, res) => {
    Appointment.deleteById(req.params.id, function (err) {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};
