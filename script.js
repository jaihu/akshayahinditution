document.addEventListener('DOMContentLoaded', function() {
    // Initialize ticket data if not exists
    if (!localStorage.getItem('tickets')) {
        localStorage.setItem('tickets', JSON.stringify([]));
    }

    // Tab switching functionality
    const tabs = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.ticket-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.id.replace('-tab', '-section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(targetId).style.display = 'block';
        });
    });

    // Ticket submission
    const ticketForm = document.getElementById('ticket-form');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const ticketId = 'TKT-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
            
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
            
            let tickets = JSON.parse(localStorage.getItem('tickets'));
            tickets.push(ticketData);
            localStorage.setItem('tickets', JSON.stringify(tickets));
            
            document.getElementById('ticket-id').textContent = ticketId;
            document.getElementById('ticket-confirmation').style.display = 'block';
            ticketForm.reset();
        });
    }

    // Add to your existing DOMContentLoaded event listener

// Add Admin tab to your navigation (add this with your other tabs)
const adminTab = document.createElement('a');
adminTab.className = 'nav-link';
adminTab.href = '#';
adminTab.id = 'admin-tab';
adminTab.textContent = 'Admin';
document.querySelector('.nav').appendChild(adminTab);

// Add click handler for admin tab
adminTab.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.ticket-section').forEach(s => s.style.display = 'none');
    document.getElementById('admin-section').style.display = 'block';
    loadAdminDashboard();
});

// Admin Dashboard Functions
function loadAdminDashboard() {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    renderStats(tickets);
    renderAllTickets(tickets);
    setupAdminSearch();
    setupAdminActions();
}

function renderStats(tickets) {
    const statsContainer = document.getElementById('stats-container');
    
    const statusCounts = tickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
    }, {});
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <h3>${tickets.length}</h3>
            <p>Total Tickets</p>
        </div>
        <div class="stat-card">
            <h3>${statusCounts['open'] || 0}</h3>
            <p>Open</p>
        </div>
        <div class="stat-card">
            <h3>${statusCounts['pending'] || 0}</h3>
            <p>Pending</p>
        </div>
        <div class="stat-card">
            <h3>${statusCounts['resolved'] || 0}</h3>
            <p>Resolved</p>
        </div>
    `;
}

function renderAllTickets(tickets) {
    const container = document.getElementById('admin-tickets-container');
    container.innerHTML = '';
    
    if (tickets.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No tickets found</div>';
        return;
    }
    
    tickets.forEach(ticket => {
        const ticketEl = document.createElement('div');
        ticketEl.className = 'card mb-2 admin-ticket';
        ticketEl.dataset.id = ticket.id;
        ticketEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="card-title">${ticket.subject}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">ID: ${ticket.id}</h6>
                        <p class="card-text mb-1">${ticket.description.substring(0, 100)}${ticket.description.length > 100 ? '...' : ''}</p>
                        <small class="text-muted">Submitted by ${ticket.name} (${ticket.email}) on ${new Date(ticket.createdAt).toLocaleString()}</small>
                    </div>
                    <div>
                        <span class="badge ${getStatusClass(ticket.status)} me-2">${ticket.status}</span>
                        <span class="badge bg-secondary">${ticket.priority}</span>
                    </div>
                </div>
                <div class="ticket-actions mt-3">
                    <select class="form-select form-select-sm d-inline-block w-auto me-2 status-select">
                        <option value="open" ${ticket.status === 'open' ? 'selected' : ''}>Open</option>
                        <option value="pending" ${ticket.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="resolved" ${ticket.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>Closed</option>
                    </select>
                    <button class="btn btn-sm btn-outline-danger delete-ticket">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(ticketEl);
    });
}

function setupAdminSearch() {
    const searchInput = document.getElementById('admin-search');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
        
        if (!searchTerm) {
            renderAllTickets(tickets);
            return;
        }
        
        const filteredTickets = tickets.filter(ticket => 
            ticket.subject.toLowerCase().includes(searchTerm) ||
            ticket.description.toLowerCase().includes(searchTerm) ||
            ticket.id.toLowerCase().includes(searchTerm) ||
            ticket.name.toLowerCase().includes(searchTerm) ||
            ticket.email.toLowerCase().includes(searchTerm)
        );
        
        renderAllTickets(filteredTickets);
    });
}

function setupAdminActions() {
    // Status change handler
    document.getElementById('admin-tickets-container').addEventListener('change', function(e) {
        if (e.target.classList.contains('status-select')) {
            const ticketId = e.target.closest('.admin-ticket').dataset.id;
            const newStatus = e.target.value;
            
            let tickets = JSON.parse(localStorage.getItem('tickets'));
            const ticketIndex = tickets.findIndex(t => t.id === ticketId);
            
            if (ticketIndex !== -1) {
                tickets[ticketIndex].status = newStatus;
                tickets[ticketIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('tickets', JSON.stringify(tickets));
                loadAdminDashboard();
            }
        }
    });
    
    // Delete ticket handler
    document.getElementById('admin-tickets-container').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-ticket')) {
            if (confirm('Are you sure you want to delete this ticket?')) {
                const ticketId = e.target.closest('.admin-ticket').dataset.id;
                
                let tickets = JSON.parse(localStorage.getItem('tickets'));
                tickets = tickets.filter(t => t.id !== ticketId);
                localStorage.setItem('tickets', JSON.stringify(tickets));
                loadAdminDashboard();
            }
        }
    });
    
    // Export tickets
    document.getElementById('export-btn').addEventListener('click', function() {
        const tickets = JSON.parse(localStorage.getItem('tickets'));
        const dataStr = JSON.stringify(tickets, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'tickets-export.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });
    
    // Import tickets
    document.getElementById('import-btn').addEventListener('click', function() {
        document.getElementById('import-file').click();
    });
    
    document.getElementById('import-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedTickets = JSON.parse(e.target.result);
                if (Array.isArray(importedTickets)) {
                    localStorage.setItem('tickets', JSON.stringify(importedTickets));
                    alert(`Successfully imported ${importedTickets.length} tickets`);
                    loadAdminDashboard();
                } else {
                    alert('Invalid file format. Expected an array of tickets.');
                }
            } catch (error) {
                alert('Error parsing JSON file: ' + error.message);
            }
        };
        reader.readAsText(file);
    });
    
    // Clear all tickets
    document.getElementById('clear-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to delete ALL tickets? This cannot be undone.')) {
            localStorage.setItem('tickets', JSON.stringify([]));
            loadAdminDashboard();
        }
    });
}
    // Track tickets functionality
    const trackForm = document.getElementById('track-form');
    if (trackForm) {
        trackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('track-email').value.trim().toLowerCase();
            const ticketId = document.getElementById('track-ticket-id').value.trim().toUpperCase();
            
            if (!email) {
                displayResults('Please enter your email address', 'error');
                return;
            }
            
            try {
                const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
                let filteredTickets = tickets.filter(ticket => 
                    ticket.email.toLowerCase() === email
                );
                
                if (ticketId) {
                    filteredTickets = filteredTickets.filter(ticket => 
                        ticket.id.toUpperCase() === ticketId
                    );
                }
                
                if (filteredTickets.length === 0) {
                    displayResults('No tickets found matching your criteria', 'info');
                } else {
                    displayTicketResults(filteredTickets);
                }
            } catch (error) {
                console.error('Error retrieving tickets:', error);
                displayResults('Error retrieving tickets. Please try again.', 'error');
            }
        });
    }

    function displayTicketResults(tickets) {
        const resultsContainer = document.getElementById('ticket-results');
        resultsContainer.innerHTML = '';
        
        tickets.forEach(ticket => {
            const ticketElement = document.createElement('div');
            ticketElement.className = 'card ticket-card mb-3';
            ticketElement.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">${ticket.subject}</h5>
                        <span class="badge ${getStatusClass(ticket.status)}">${ticket.status}</span>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">Ticket ID: ${ticket.id}</h6>
                    <p class="card-text">${ticket.description}</p>
                    <div class="d-flex justify-content-between">
                        <small class="text-muted">Submitted: ${new Date(ticket.createdAt).toLocaleString()}</small>
                        <small class="text-muted">Priority: ${ticket.priority}</small>
                        <small class="text-muted">Department: ${ticket.department}</small>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(ticketElement);
        });
    }

    function displayResults(message, type) {
        const resultsContainer = document.getElementById('ticket-results');
        resultsContainer.innerHTML = `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `;
    }

    function getStatusClass(status) {
        const statusMap = {
            'open': 'bg-primary',
            'pending': 'bg-warning text-dark',
            'resolved': 'bg-success',
            'closed': 'bg-secondary'
        };
        return statusMap[status.toLowerCase()] || 'bg-info';
    }
});
