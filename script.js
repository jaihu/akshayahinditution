document.addEventListener('DOMContentLoaded', function() {
    // Initialize ticket data if not exists
    if (!localStorage.getItem('tickets')) {
        localStorage.setItem('tickets', JSON.stringify([]));
    }

    // Generate a unique ticket ID
    function generateTicketId() {
        const timestamp = Date.now().toString().slice(-6);
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `TKT-${timestamp}-${randomNum}`;
    }

    // Ticket submission
    const ticketForm = document.getElementById('ticket-form');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Generate ticket ID
            const ticketId = generateTicketId();
            console.log("Generated Ticket ID:", ticketId); // Debug log
            
            // Create ticket object
            const ticketData = {
                id: ticketId,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                department: document.getElementById('department').value,
                priority: document.getElementById('priority').value,
                description: document.getElementById('description').value,
                status: 'open',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Save ticket
            let tickets = JSON.parse(localStorage.getItem('tickets'));
            tickets.push(ticketData);
            localStorage.setItem('tickets', JSON.stringify(tickets));
            
            // Show confirmation with ticket ID
            document.getElementById('ticket-id').textContent = ticketId;
            document.getElementById('ticket-confirmation').style.display = 'block';
            
            // Reset form
            ticketForm.reset();
            
            // Scroll to confirmation
            document.getElementById('ticket-confirmation').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Rest of your existing code for tracking tickets...
});
