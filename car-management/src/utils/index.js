export function formatNumber(phoneNumber) {
    phoneNumber = phoneNumber.replace(/\D/g, '');
    phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
  
    return phoneNumber;
}