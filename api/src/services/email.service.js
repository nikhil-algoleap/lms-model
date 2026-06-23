const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendLeadNotification = async (lead, assigneeEmail) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Algoleap LMS <noreply@algoleap.com>', // Update with verified domain
      to: [assigneeEmail],
      subject: `New Lead Assigned: ${lead.title}`,
      html: `
        <h2>You have been assigned a new lead</h2>
        <p><strong>Lead Title:</strong> ${lead.title}</p>
        <p><strong>Value:</strong> $${lead.value || 'N/A'}</p>
        <p><strong>Probability:</strong> ${lead.probability}%</p>
        <p><strong>Stage:</strong> ${lead.leadStatus || lead.stage}</p>
        <br/>
        <a href="http://localhost:5173/leads/${lead.id}">View Lead in Dashboard</a>
      `
    });

    if (error) {
      console.error("Failed to send email:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email service error:", err);
    return false;
  }
};

module.exports = {
  sendLeadNotification
};
