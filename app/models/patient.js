onst db = require('./../services/db');

class patient {
    id;
    name;
    d.o.b;
    Address;
    mobile;
    gender;
    nationality;
    next_of_kin;
    Emergency_contact;
    receptionist_id; 
    doctor_id;  

  constructor(patient_id) {
    this.id = patient_id;
  }

module.exports = {
  patient
};