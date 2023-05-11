const db = require('./../services/db');
const bcrypt = require("bcryptjs");

//class Staff {
 // staff_id;
  //name;
  //email;
  //Address;
 // mobile;
 // password;


 
  //async authenticate(submitted) {
   // if (typeof submitted !== 'string' || !submitted) {
     //   return false;
    //  }

    // Get the stored, hashed password for the user
   // var sql = "SELECT password FROM staff WHERE staff_id = ?";
   // const result = await db.query(sql, [this.staff_id || null]);
       // if (result.length > 0) {
         // const match = await bcrypt.compare(submitted, result[0].password);
        //  if (match == true) {
         //   return true;
         // } else {
         //   return false;
        //  }
     //   } else {
    //      return false;
    //    }
    //  }  
      
   // }   
    
    class Staff {
        constructor(staff_id, name, email, Address, mobile, password) {
          this.name = name;
          this.id = staff_id;
          this.email = email;
          this.Address = Address;
          this.mobile = mobile;
          this.password = password;
        }
      
        async authenticate(submitted) {

            if (typeof submitted !== 'string' || !submitted) {
                   return false;
                 }
          var sql = "SELECT password FROM staff WHERE name = ?";
          const result = await db.query(sql, [this.name || null]);
          if (result.length > 0 && result[0].password === submitted) {
            this.id = result[0].staff_id;
            return true;
          } else {
            return false;
          }
        }
      }
      
      
      
  

module.exports = {
  Staff
};