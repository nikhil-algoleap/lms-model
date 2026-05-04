document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-grid');
    const saveBtn = document.querySelector('.btn-save');

    if (form && saveBtn) {
        // Change the button type to submit instead of button
        saveBtn.type = 'submit';
        // Remove the onclick redirect so we can handle it via API
        saveBtn.removeAttribute('onclick');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const originalText = saveBtn.innerText;
            saveBtn.innerText = 'Saving...';
            saveBtn.disabled = true;

            try {
                // Get owner initials
                const ownerSelect = document.getElementById('owner');
                const ownerText = ownerSelect.options[ownerSelect.selectedIndex].text;
                const ownerInitials = ownerText.charAt(0).toUpperCase();

                // Format the stage to uppercase for the DB (e.g., 'New' -> 'NEW', 'Qualification' -> 'QUALIFICATION')
                const stageSelect = document.getElementById('stage');
                let stageStr = stageSelect.options[stageSelect.selectedIndex].text.toUpperCase();
                // Map 'CLOSED WON' to 'WON' for consistency with our other scripts
                if (stageStr === 'CLOSED WON') stageStr = 'WON';

                const dueDateValue = document.getElementById('start-date') ? document.getElementById('start-date').value : null;

                const payload = {
                    title: document.getElementById('lead-title').value,
                    accountName: document.getElementById('account').value,
                    serviceLine: document.getElementById('service-line').value,
                    deliveryFormat: document.getElementById('delivery-format') ? document.getElementById('delivery-format').value : null,
                    value: document.getElementById('revenue').value,
                    probability: parseInt(document.getElementById('probability').value) || 0,
                    ownerInitials: ownerInitials,
                    stage: stageStr,
                    dueDate: dueDateValue ? new Date(dueDateValue).toISOString() : null
                };

                const response = await fetch('http://localhost:4000/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || errData.message || 'Error saving lead');
                }

                alert('Lead successfully saved to Database!');
                window.location.href = 'leads.html';

            } catch (err) {
                console.error('Error saving lead:', err);
                alert('Failed to save lead: ' + err.message);
                saveBtn.innerText = originalText;
                saveBtn.disabled = false;
            }
        });
    }
});
