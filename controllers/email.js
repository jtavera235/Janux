const userId = "user_QptLOdmoTOz0zgwLCX6jK";
const gmail = "gmail_connect";
const templateID = "template_vf1qJ1dA";


const contactID = "user_hsnEfRpaKQSeGZRc7RK9X";
const contactgmail = "gmail";
const reporttemplateID = "template_zHc2106T";

exports.sendEmail = emailjs.send(gmail, templateID, templateParams, userId) .then((response) => { }, (err) => { });

// send positive request
exports.reportABug = emailjs.send(contactgmail, contacttemplateID, templateParams, contactID)
.then((response) => {
  this.snackBar.open("Thank you. Your report was sucessfully sent. ", null, {
    duration: 2000
  });
//  success
}, (err) => {
  this.snackBar.open("There was an error sending your message. Please try again.", null, {
    duration: 2000
  });
});
