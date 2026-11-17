const customerRepository = require('../repositories/customerRepository');

const getAllCustomers = async () => {
    const customers = await customerRepository.getAllCustomers();
    return customers;
}

const getCustomerById = async (customerId) => {
 const customer = await customerRepository.getCustomerById(customerId);
 return customer;
}

const createCustomer = async (customerData) =>{
    const customer = await customerRepository.createCustomer(customerData)
    return customer
}

const updateCustomer = async (customerId, customerData) => {
    const customer = await customerRepository.updateCustomer(customerId, customerData);
    return customer;
}

const patchCustomer = async (customerId, customerData) => {
    const customer = await customerRepository.patchCustomer(customerId, customerData);
    return customer;
}   

const deleteCustomer = async (customerId) => {
    const customer = await customerRepository.deleteCustomer(customerId);
    return customer;
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    patchCustomer,
    deleteCustomer
};
