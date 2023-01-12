/* eslint-disable no-useless-escape */
/* eslint-disable no-invalid-regexp */
const mail = 'gtn213@gmail.uf';
const regexMail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/

console.log('regex ', regexMail.test(mail))