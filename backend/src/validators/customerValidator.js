const validateCreateCustomer = (data) => {
    const { customerCode, fullName, email, phone, customerType, address } = data;

    // Required Field
    if (!customerCode || !fullName || !email || !phone || !customerType) {
        return  "Customer code, name, email, phone and customer type are required."
    }

    // check data types
    if (typeof customerCode !== 'string' || typeof fullName !== 'string' || typeof email !== 'string' || typeof phone !== 'string' || typeof customerType !== 'string') {
        return "Customer code, name, email, phone and customer type must be strings."
    }

    // Remove unnecessary spaces
    const cleanEmail = email.trim();

    // Length Validation
    if (customerCode.trim().length > 20) {
        return "customer Code must not exceed 20 characters.";
    }

    if (fullName.trim().length > 100) {
        return "Full name must not exceed 100 characters.";
    }
    if (cleanEmail.length > 100) {
        return "Email must not exceed 100 characters.";
    }
    if (phone.trim().length > 15) {
        return "Phone number must not exceed 15 characters.";
    }

    if(address !== undefined &&
       address !== null && 
       (typeof(address) !== "string" || address.length >250)
    ){
        return "Address must be a string and not exceed 250 characters.";
    }

    // Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {   // **** ".test" to validate email usinf regex
        return "Please provide a valid email address.";
    }

    // customerType Validation
    const allowedTypes = ["Individual", "Joint", "Corporate"];
    if (!allowedTypes.includes(customerType)) {
        return "Customer type must be either 'Individual', 'Joint', or 'Corporate'.";
    }

    return null ; // No validation errors
}

const validatePatchCustomer = (data) => {
  const allowedFields = [
    "customerCode",
    "fullName",
    "email",
    "phone",
    "customerType",
    "address",
  ];

  //const data = {fullName:"Rohit",email:"rohit@example.com", mobile:"1234567854"};
  const fields = Object.keys(data);

  if (fields.length === 0) {
    return "Please provide at least one field to update.";
  }

  const invalidFields = fields.filter(
    (field) => !allowedFields.includes(field) 
  );

 // console.log("invalidFields", invalidFields); // [ 'mobile' ]

  if (invalidFields.length > 0) {
    return `Invalid fields: ${invalidFields.join(", ")}`;
  }

  const {
    customerCode,
    fullName,
    email,
    phone,
    customerType,
    address,
  } = data;

  // Validate customerCode
  if (customerCode !== undefined) {
    if (typeof customerCode !== "string" || !customerCode.trim()) {
      return "Customer code must be a non-empty string.";
    }

    if (customerCode.trim().length > 20) {
      return "Customer code cannot exceed 20 characters.";
    }
  }

  // Validate fullName
  if (fullName !== undefined) {
    if (typeof fullName !== "string" || !fullName.trim()) {
      return "Full name must be a non-empty string.";
    }

    if (fullName.trim().length > 100) {
      return "Full name cannot exceed 100 characters.";
    }
  }

  // Validate email
  if (email !== undefined) {
    if (typeof email !== "string" || !email.trim()) {
      return "Email must be a non-empty string.";
    }

    if (email.trim().length > 100) {
      return "Email cannot exceed 100 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return "Please provide a valid email address.";
    }
  }

  // Validate phone
  if (phone !== undefined) {
    if (typeof phone !== "string" || !phone.trim()) {
      return "Phone must be a non-empty string.";
    }

    if (phone.trim().length > 15) {
      return "Phone cannot exceed 15 characters.";
    }
  }

  // Validate customerType
  if (customerType !== undefined) {
    const allowedTypes = ["Individual", "Joint", "Corporate"];

    if (
      typeof customerType !== "string" ||
      !allowedTypes.includes(customerType.trim())
    ) {
      return "Customer type must be Individual, Joint or Corporate.";
    }
  }

  // Validate address
  if (address !== undefined) {
    if (
      address !== null &&
      (typeof address !== "string" || address.length > 250)
    ) {
      return "Address must be text and cannot exceed 250 characters.";
    }
  }

  return null;
};

module.exports = {
    validateCreateCustomer,
    validatePatchCustomer
};