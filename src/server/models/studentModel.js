const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    wit_id: {
        type: String,
        required: [true, 'A student must have a WIT ID'],
        unique: true
    },

    name: {
        type: String,
        require: [true, 'A student must have a name'],
    },

    ssn: {
        type: String,
        require: [true, 'A student must have a ssn'],
    },

    date_of_birth: {
        type: Number,
        require: [true, 'A student must have a date of birth'],
    },

    type:           String,
    citizenship:    String,
    residence:      String,
    
    address:            { type: Array, default: [] },
    contact:            { type: Object, default: {} },
    curriculum_info:    { type: Array, default: [] },
    graduation:         { type: Object, default: {} },

});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
