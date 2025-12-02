// Initialize - Set today's date as default for entry date
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('entryDate').value = today;
    
    // Load existing entries from localStorage
    loadEntries();
    
    // Initialize modal event listeners
    const modal = document.getElementById('statusModal');
    const closeBtn = document.querySelector('.close-modal');
    const statusButtons = document.querySelectorAll('.status-option-btn');
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeStatusModal);
    }
    
    // Close on outside click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeStatusModal();
            }
        });
    }
    
    // Status option buttons
    statusButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            if (currentUpdateId && status) {
                updateStatus(currentUpdateId, status);
                closeStatusModal();
            }
        });
    });
    
    // Setup search functionality
    setupSearch();

    // Setup IMEI modal events
    setupImeiModal();

    // Setup Excel export button
    const exportBtn = document.getElementById('exportExcelBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToExcel);
    }

    // Setup Reports
    setupReports();
});

// Setup Reports functionality
function setupReports() {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dailyReportDate').value = today;
    document.getElementById('salesReportStartDate').value = today;
    document.getElementById('salesReportEndDate').value = today;

    // Tab switching
    const tabs = document.querySelectorAll('.report-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.report-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabName}ReportTab`).classList.add('active');
        });
    });

    // Daily Report
    const generateDailyBtn = document.getElementById('generateDailyReport');
    const downloadDailyBtn = document.getElementById('downloadDailyReport');
    
    if (generateDailyBtn) {
        generateDailyBtn.addEventListener('click', generateDailyReport);
    }
    if (downloadDailyBtn) {
        downloadDailyBtn.addEventListener('click', downloadDailyReport);
    }

    // Sales Report
    const generateSalesBtn = document.getElementById('generateSalesReport');
    const downloadSalesBtn = document.getElementById('downloadSalesReport');
    
    if (generateSalesBtn) {
        generateSalesBtn.addEventListener('click', generateSalesReport);
    }
    if (downloadSalesBtn) {
        downloadSalesBtn.addEventListener('click', downloadSalesReport);
    }
}

// Form submission handler
document.getElementById('serviceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        id: Date.now(), // Unique ID
        customerName: document.getElementById('customerName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        deviceType: document.getElementById('deviceType').value,
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        imei: document.getElementById('imei').value,
        color: document.getElementById('color').value,
        password: document.getElementById('password').value,
        serviceType: document.getElementById('serviceType').value,
        priority: document.getElementById('priority').value,
        problemDescription: document.getElementById('problemDescription').value,
        receivedItems: document.getElementById('receivedItems').value,
        estimatedCost: document.getElementById('estimatedCost').value,
        advanceAmount: document.getElementById('advanceAmount').value,
        entryDate: document.getElementById('entryDate').value,
        expectedDelivery: document.getElementById('expectedDelivery').value,
        status: document.getElementById('status').value,
        technicianNotes: document.getElementById('technicianNotes').value,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    saveEntry(formData);
    
    // Display success message
    showNotification('Service entry submitted successfully!', 'success');
    
    // Reset form
    this.reset();
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
    
    // Reload entries (preserve search if any)
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput ? searchInput.value : '';
    loadEntries(searchQuery);
});

// Generate job number in format: YYYY/MM/DD/01
function generateJobNumber(entryDate) {
    const date = new Date(entryDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const datePrefix = `${year}/${month}/${day}`;
    
    // Get all entries and find the highest number for this date
    let entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    let maxNumber = 0;
    
    entries.forEach(entry => {
        if (entry.jobNumber && entry.jobNumber.startsWith(datePrefix)) {
            const parts = entry.jobNumber.split('/');
            if (parts.length === 4) {
                const num = parseInt(parts[3], 10);
                if (!isNaN(num) && num > maxNumber) {
                    maxNumber = num;
                }
            }
        }
    });
    
    // Increment for new entry
    const newNumber = String(maxNumber + 1).padStart(2, '0');
    return `${datePrefix}/${newNumber}`;
}

// Save entry to localStorage
function saveEntry(entry) {
    // Generate job number if not already set
    if (!entry.jobNumber) {
        entry.jobNumber = generateJobNumber(entry.entryDate);
    }
    
    let entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    entries.push(entry);
    localStorage.setItem('serviceEntries', JSON.stringify(entries));
}

// Load entries from localStorage
function loadEntries(searchQuery = '') {
    const entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    const entriesList = document.getElementById('entriesList');
    
    if (entries.length === 0) {
        entriesList.innerHTML = '<p class="no-entries">No service entries yet. Submit a form to see entries here.</p>';
        return;
    }
    
    // Sort entries by date (newest first)
    entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Filter entries based on search query
    let filteredEntries = entries;
    if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filteredEntries = entries.filter(entry => {
            return (
                entry.customerName.toLowerCase().includes(query) ||
                entry.phoneNumber.includes(query) ||
                entry.email.toLowerCase().includes(query) ||
                entry.brand.toLowerCase().includes(query) ||
                entry.model.toLowerCase().includes(query) ||
                entry.serviceType.toLowerCase().includes(query) ||
                (entry.problemDescription && entry.problemDescription.toLowerCase().includes(query)) ||
                (entry.technicianNotes && entry.technicianNotes.toLowerCase().includes(query))
            );
        });
    }
    
    if (filteredEntries.length === 0) {
        entriesList.innerHTML = '<p class="no-entries">No entries found matching your search.</p>';
        return;
    }
    
    entriesList.innerHTML = filteredEntries.map(entry => createEntryCard(entry)).join('');
    
    // Add delete, status update, IMEI edit and print job sheet button event listeners
    filteredEntries.forEach(entry => {
        const deleteBtn = document.getElementById(`delete-${entry.id}`);
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteEntry(entry.id));
        }
        
        const updateBtn = document.getElementById(`update-${entry.id}`);
        if (updateBtn) {
            updateBtn.addEventListener('click', () => updateEntryStatus(entry.id));
        }

        const editImeiBtn = document.getElementById(`edit-imei-${entry.id}`);
        if (editImeiBtn) {
            editImeiBtn.addEventListener('click', () => openImeiModal(entry.id));
        }

        const printBtn = document.getElementById(`print-${entry.id}`);
        if (printBtn) {
            printBtn.addEventListener('click', () => printJobSheet(entry.id));
        }

    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchQuery = e.target.value;
            loadEntries(searchQuery);
        });
    }
}

// Create entry card HTML
function createEntryCard(entry) {
    const serviceTypeLabels = {
        'screen-repair': 'Screen Repair/Replacement',
        'battery': 'Battery Replacement',
        'charging-port': 'Charging Port Repair',
        'software': 'Software Issue',
        'water-damage': 'Water Damage Repair',
        'camera': 'Camera Repair',
        'speaker': 'Speaker/Microphone Repair',
        'button': 'Button Repair',
        'fingerprint': 'Fingerprint',
        'simtray': 'SIM Tray',
        'stripe': 'Stripe',
        'unlocking': 'Unlocking',
        'data-recovery': 'Data Recovery',
        'dead': 'Dead',
        'motherboard-issue': 'Motherboard issue',
        'ic-work': 'IC work',
        'other': 'Other'
    };
    
    const statusClass = `status-${entry.status.replace('-', '-')}`;
    const priorityClass = `priority-${entry.priority}`;
    
    const jobNumber = entry.jobNumber || generateJobNumber(entry.entryDate);
    
    return `
        <div class="entry-card">
            <div class="entry-header">
                <div>
                    <span class="entry-title">${entry.customerName}</span>
                    <span class="priority-badge ${priorityClass}">${entry.priority}</span>
                </div>
                <span class="status-badge ${statusClass}">${entry.status}</span>
            </div>
            <div class="entry-details">
                <div class="detail-item">
                    <span class="detail-label">Job No</span>
                    <span class="detail-value">${jobNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Phone</span>
                    <span class="detail-value">${entry.phoneNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Device</span>
                    <span class="detail-value">${entry.brand} ${entry.model}</span>
                </div>
                ${entry.imei ? `
                <div class="detail-item">
                    <span class="detail-label">IMEI</span>
                    <span class="detail-value">${entry.imei}</span>
                </div>
                ` : ''}
                <div class="detail-item">
                    <span class="detail-label">Service Type</span>
                    <span class="detail-value">${serviceTypeLabels[entry.serviceType] || entry.serviceType}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Entry Date</span>
                    <span class="detail-value">${formatDate(entry.entryDate)}</span>
                </div>
                ${entry.expectedDelivery ? `
                <div class="detail-item">
                    <span class="detail-label">Expected Delivery</span>
                    <span class="detail-value">${formatDate(entry.expectedDelivery)}</span>
                </div>
                ` : ''}
                ${entry.estimatedCost ? `
                <div class="detail-item">
                    <span class="detail-label">Estimated Cost</span>
                    <span class="detail-value">₹${parseFloat(entry.estimatedCost).toFixed(2)}</span>
                </div>
                ` : ''}
                ${entry.advanceAmount ? `
                <div class="detail-item">
                    <span class="detail-label">Advance Paid</span>
                    <span class="detail-value">₹${parseFloat(entry.advanceAmount).toFixed(2)}</span>
                </div>
                ` : ''}
            </div>
            ${entry.problemDescription ? `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                <span class="detail-label">Product Condition:</span>
                <p style="margin-top: 5px; color: #555;">${entry.problemDescription}</p>
            </div>
            ` : ''}
            ${entry.receivedItems ? `
            <div style="margin-top: 10px;">
                <span class="detail-label">Received Items:</span>
                <p style="margin-top: 5px; color: #555;">${entry.receivedItems}</p>
            </div>
            ` : ''}
            ${entry.technicianNotes ? `
            <div style="margin-top: 10px;">
                <span class="detail-label">Technician Notes:</span>
                <p style="margin-top: 5px; color: #666; font-style: italic;">${entry.technicianNotes}</p>
            </div>
            ` : ''}
            <div class="button-group">
                <button class="update-btn" id="update-${entry.id}">Update Status</button>
                ${(entry.status === 'completed' || entry.status === 'delivered') ? `
                <button class="edit-btn" id="edit-imei-${entry.id}">Edit IMEI</button>
                ` : ''}
                <button class="print-btn" id="print-${entry.id}">Print Job Sheet</button>
                <button class="delete-btn" id="delete-${entry.id}">Delete Entry</button>
            </div>
        </div>
    `;
}

// Update entry status
let currentUpdateId = null;
let currentEditId = null;

function updateEntryStatus(id) {
    currentUpdateId = id;
    const modal = document.getElementById('statusModal');
    modal.classList.add('show');
}

// Close modal
function closeStatusModal() {
    const modal = document.getElementById('statusModal');
    modal.classList.remove('show');
    currentUpdateId = null;
}

// IMEI modal setup
function setupImeiModal() {
    const imeiModal = document.getElementById('imeiModal');
    const closeImeiBtn = document.getElementById('closeImeiModal');
    const cancelImeiBtn = document.getElementById('cancelImeiUpdate');
    const saveImeiBtn = document.getElementById('saveImeiUpdate');

    if (!imeiModal) return;

    // Close actions
    if (closeImeiBtn) {
        closeImeiBtn.addEventListener('click', closeImeiModal);
    }
    if (cancelImeiBtn) {
        cancelImeiBtn.addEventListener('click', closeImeiModal);
    }

    // Outside click closes modal
    imeiModal.addEventListener('click', function(e) {
        if (e.target === imeiModal) {
            closeImeiModal();
        }
    });

    // Save IMEI
    if (saveImeiBtn) {
        saveImeiBtn.addEventListener('click', saveImeiUpdate);
    }
}

function openImeiModal(id) {
    currentEditId = id;
    const imeiModal = document.getElementById('imeiModal');
    const newImeiInput = document.getElementById('newImei');

    let entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    const entry = entries.find(e => e.id === id);

    if (entry && newImeiInput) {
        newImeiInput.value = entry.imei || '';
    }

    imeiModal.classList.add('show');
}

function closeImeiModal() {
    const imeiModal = document.getElementById('imeiModal');
    const newImeiInput = document.getElementById('newImei');
    if (imeiModal) {
        imeiModal.classList.remove('show');
    }
    if (newImeiInput) {
        newImeiInput.value = '';
    }
    currentEditId = null;
}

function saveImeiUpdate() {
    const newImeiInput = document.getElementById('newImei');
    if (!newImeiInput) return;

    const newImei = newImeiInput.value.trim();
    if (!newImei) {
        alert('Please enter a valid IMEI number.');
        return;
    }

    let entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    const entryIndex = entries.findIndex(entry => entry.id === currentEditId);

    if (entryIndex !== -1) {
        entries[entryIndex].imei = newImei;
        localStorage.setItem('serviceEntries', JSON.stringify(entries));

        // Preserve search query when reloading
        const searchInput = document.getElementById('searchInput');
        const searchQuery = searchInput ? searchInput.value : '';
        loadEntries(searchQuery);

        showNotification('IMEI updated successfully!', 'success');
    }

    closeImeiModal();
}


// Print Job Sheet for an entry
function printJobSheet(id) {
    const entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    // Fill job sheet fields
    // Use jobNumber if available, otherwise generate from id
    const jobNumber = entry.jobNumber || generateJobNumber(entry.entryDate);
    document.getElementById('jsJobNo').textContent = jobNumber;
    document.getElementById('jsEntryDate').textContent = formatDate(entry.entryDate);
    document.getElementById('jsCustomerName').textContent = entry.customerName || 'N/A';
    document.getElementById('jsPhoneNumber').textContent = entry.phoneNumber || 'N/A';
    document.getElementById('jsAddress').textContent = entry.address || 'N/A';

    document.getElementById('jsDeviceType').textContent = entry.deviceType || 'N/A';
    const brandModel = `${entry.brand || ''} ${entry.model || ''}`.trim();
    document.getElementById('jsBrandModel').textContent = brandModel || 'N/A';
    document.getElementById('jsImei').textContent = entry.imei || 'N/A';
    document.getElementById('jsColor').textContent = entry.color || 'N/A';
    document.getElementById('jsPassword').textContent = entry.password || 'N/A';

    // Service type labels mapping
    const serviceTypeLabels = {
        'screen-repair': 'Screen Repair/Replacement',
        'battery': 'Battery Replacement',
        'charging-port': 'Charging Port Repair',
        'software': 'Software Issue',
        'water-damage': 'Water Damage Repair',
        'camera': 'Camera Repair',
        'speaker': 'Speaker/Microphone Repair',
        'button': 'Button Repair',
        'fingerprint': 'Fingerprint',
        'simtray': 'SIM Tray',
        'stripe': 'Stripe',
        'unlocking': 'Unlocking',
        'data-recovery': 'Data Recovery',
        'dead': 'Dead',
        'motherboard-issue': 'Motherboard issue',
        'ic-work': 'IC work',
        'other': 'Other'
    };
    
    const serviceTypeText = serviceTypeLabels[entry.serviceType] || entry.serviceType || 'N/A';
    document.getElementById('jsServiceType').textContent = serviceTypeText;

    document.getElementById('jsProductCondition').textContent = entry.problemDescription || 'N/A';
    document.getElementById('jsReceivedItems').textContent = entry.receivedItems || 'None';

    const est = parseFloat(entry.estimatedCost || '0') || 0;
    const adv = parseFloat(entry.advanceAmount || '0') || 0;
    const bal = est - adv;
    document.getElementById('jsEstimatedCost').textContent = est.toFixed(2);
    document.getElementById('jsAdvanceAmount').textContent = adv.toFixed(2);
    document.getElementById('jsBalance').textContent = bal.toFixed(2);

    // Trigger print (print styles will only show the job sheet)
    window.print();
}

function updateStatus(id, newStatus) {
    let entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    const entryIndex = entries.findIndex(entry => entry.id === id);
    
    if (entryIndex !== -1) {
        entries[entryIndex].status = newStatus;
        localStorage.setItem('serviceEntries', JSON.stringify(entries));
        // Preserve search query when reloading
        const searchInput = document.getElementById('searchInput');
        const searchQuery = searchInput ? searchInput.value : '';
        loadEntries(searchQuery);
        showNotification(`Service status updated to ${newStatus}!`, 'success');
    }
}

// Delete entry
function deleteEntry(id) {
    if (confirm('Are you sure you want to delete this service entry?')) {
        let entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
        entries = entries.filter(entry => entry.id !== id);
        localStorage.setItem('serviceEntries', JSON.stringify(entries));
        // Preserve search query when reloading
        const searchInput = document.getElementById('searchInput');
        const searchQuery = searchInput ? searchInput.value : '';
        loadEntries(searchQuery);
        showNotification('Service entry deleted successfully!', 'success');
    }
}


// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Show notification
function showNotification(message, type) {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export to Excel function
function exportToExcel() {
    try {
        // Get all entries from localStorage
        const entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
        
        if (entries.length === 0) {
            showNotification('No entries to export!', 'error');
            return;
        }

        // Service type labels mapping
        const serviceTypeLabels = {
            'screen-repair': 'Screen Repair/Replacement',
            'battery': 'Battery Replacement',
            'charging-port': 'Charging Port Repair',
            'software': 'Software Issue',
            'water-damage': 'Water Damage Repair',
            'camera': 'Camera Repair',
            'speaker': 'Speaker/Microphone Repair',
            'button': 'Button Repair',
            'fingerprint': 'Fingerprint',
            'simtray': 'SIM Tray',
            'stripe': 'Stripe',
            'unlocking': 'Unlocking',
            'data-recovery': 'Data Recovery',
            'dead': 'Dead',
            'motherboard-issue': 'Motherboard issue',
            'ic-work': 'IC work',
            'other': 'Other'
        };

        // Prepare data for Excel
        const excelData = entries.map(entry => {
            const balance = (parseFloat(entry.estimatedCost || 0) - parseFloat(entry.advanceAmount || 0)).toFixed(2);
            
            return {
                'Job No': entry.jobNumber || generateJobNumber(entry.entryDate),
                'Entry Date': entry.entryDate ? formatDateForExcel(entry.entryDate) : '',
                'Customer Name': entry.customerName || '',
                'Phone Number': entry.phoneNumber || '',
                'Email': entry.email || '',
                'Address': entry.address || '',
                'Device Type': entry.deviceType || '',
                'Brand': entry.brand || '',
                'Model': entry.model || '',
                'IMEI': entry.imei || '',
                'Color': entry.color || '',
                'Password': entry.password || '',
                'Service Type': serviceTypeLabels[entry.serviceType] || entry.serviceType || '',
                'Priority': entry.priority || '',
                'Product Condition': entry.problemDescription || '',
                'Received Items': entry.receivedItems || '',
                'Estimated Cost (₹)': parseFloat(entry.estimatedCost || 0).toFixed(2),
                'Advance Amount (₹)': parseFloat(entry.advanceAmount || 0).toFixed(2),
                'Balance (₹)': balance,
                'Expected Delivery Date': entry.expectedDelivery ? formatDateForExcel(entry.expectedDelivery) : '',
                'Status': entry.status || '',
                'Technician Notes': entry.technicianNotes || '',
                'Created At': entry.createdAt ? formatDateForExcel(entry.createdAt.split('T')[0]) : ''
            };
        });

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        const colWidths = [
            { wch: 12 }, // Job No
            { wch: 12 }, // Entry Date
            { wch: 20 }, // Customer Name
            { wch: 15 }, // Phone Number
            { wch: 25 }, // Email
            { wch: 30 }, // Address
            { wch: 12 }, // Device Type
            { wch: 15 }, // Brand
            { wch: 20 }, // Model
            { wch: 18 }, // IMEI
            { wch: 12 }, // Color
            { wch: 15 }, // Password
            { wch: 25 }, // Service Type
            { wch: 10 }, // Priority
            { wch: 40 }, // Product Condition
            { wch: 30 }, // Received Items
            { wch: 15 }, // Estimated Cost
            { wch: 15 }, // Advance Amount
            { wch: 15 }, // Balance
            { wch: 18 }, // Expected Delivery
            { wch: 15 }, // Status
            { wch: 40 }, // Technician Notes
            { wch: 15 }  // Created At
        ];
        ws['!cols'] = colWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Service Entries');

        // Generate filename with current date
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        const filename = `New_Mobiles_Elite_Service_Entries_${dateStr}.xlsx`;

        // Write and download file
        XLSX.writeFile(wb, filename);
        
        showNotification(`Excel file "${filename}" downloaded successfully!`, 'success');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showNotification('Error exporting to Excel. Please try again.', 'error');
    }
}

// Generate Daily Report
function generateDailyReport() {
    const selectedDate = document.getElementById('dailyReportDate').value;
    
    if (!selectedDate) {
        showNotification('Please select a date', 'error');
        return;
    }

    const entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    const filteredEntries = entries.filter(entry => {
        const entryDate = entry.entryDate ? entry.entryDate.split('T')[0] : '';
        return entryDate === selectedDate;
    });

    displayDailyReport(filteredEntries, selectedDate);
}

// Display Daily Report
function displayDailyReport(entries, date) {
    const reportContent = document.getElementById('dailyReportContent');
    
    if (entries.length === 0) {
        reportContent.innerHTML = `<p class="no-entries">No entries found for ${formatDate(date)}.</p>`;
        return;
    }

    const totalAmount = entries.reduce((sum, entry) => sum + parseFloat(entry.estimatedCost || 0), 0);
    const totalAdvance = entries.reduce((sum, entry) => sum + parseFloat(entry.advanceAmount || 0), 0);
    const totalBalance = totalAmount - totalAdvance;

    let html = `
        <div class="report-summary">
            <h3>Daily Report - ${formatDate(date)}</h3>
            <div class="summary-stats">
                <div class="stat-card">
                    <span class="stat-label">Total Entries</span>
                    <span class="stat-value">${entries.length}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">Total Amount</span>
                    <span class="stat-value">₹${totalAmount.toFixed(2)}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">Total Advance</span>
                    <span class="stat-value">₹${totalAdvance.toFixed(2)}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">Total Balance</span>
                    <span class="stat-value">₹${totalBalance.toFixed(2)}</span>
                </div>
            </div>
        </div>
        <div class="report-entries">
            <h4>Entries Details</h4>
            ${entries.map(entry => createReportEntryCard(entry)).join('')}
        </div>
    `;

    reportContent.innerHTML = html;
}

// Generate Sales Report
function generateSalesReport() {
    const startDate = document.getElementById('salesReportStartDate').value;
    const endDate = document.getElementById('salesReportEndDate').value;
    const statusFilter = document.getElementById('salesReportStatus').value;

    if (!startDate || !endDate) {
        showNotification('Please select start and end dates', 'error');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        showNotification('Start date cannot be after end date', 'error');
        return;
    }

    const entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    let filteredEntries = entries.filter(entry => {
        const entryDate = entry.entryDate ? entry.entryDate.split('T')[0] : '';
        return entryDate >= startDate && entryDate <= endDate;
    });

    // Apply status filter
    if (statusFilter !== 'all') {
        filteredEntries = filteredEntries.filter(entry => entry.status === statusFilter);
    }

    // Filter only completed/delivered for sales
    filteredEntries = filteredEntries.filter(entry => 
        entry.status === 'completed' || entry.status === 'delivered'
    );

    displaySalesReport(filteredEntries, startDate, endDate, statusFilter);
}

// Display Sales Report
function displaySalesReport(entries, startDate, endDate, statusFilter) {
    const reportContent = document.getElementById('salesReportContent');
    
    if (entries.length === 0) {
        reportContent.innerHTML = `<p class="no-entries">No sales found for the selected period.</p>`;
        return;
    }

    const totalSales = entries.reduce((sum, entry) => sum + parseFloat(entry.estimatedCost || 0), 0);
    const totalAdvance = entries.reduce((sum, entry) => sum + parseFloat(entry.advanceAmount || 0), 0);
    const totalBalance = totalSales - totalAdvance;

    let html = `
        <div class="report-summary">
            <h3>Sales Report - ${formatDate(startDate)} to ${formatDate(endDate)}</h3>
            <div class="summary-stats">
                <div class="stat-card">
                    <span class="stat-label">Total Sales</span>
                    <span class="stat-value">${entries.length}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">Total Revenue</span>
                    <span class="stat-value">₹${totalSales.toFixed(2)}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">Total Advance</span>
                    <span class="stat-value">₹${totalAdvance.toFixed(2)}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">Pending Balance</span>
                    <span class="stat-value">₹${totalBalance.toFixed(2)}</span>
                </div>
            </div>
        </div>
        <div class="report-entries">
            <h4>Sales Details</h4>
            ${entries.map(entry => createReportEntryCard(entry)).join('')}
        </div>
    `;

    reportContent.innerHTML = html;
}

// Create report entry card
function createReportEntryCard(entry) {
    const serviceTypeLabels = {
        'screen-repair': 'Screen Repair/Replacement',
        'battery': 'Battery Replacement',
        'charging-port': 'Charging Port Repair',
        'software': 'Software Issue',
        'water-damage': 'Water Damage Repair',
        'camera': 'Camera Repair',
        'speaker': 'Speaker/Microphone Repair',
        'button': 'Button Repair',
        'fingerprint': 'Fingerprint',
        'simtray': 'SIM Tray',
        'stripe': 'Stripe',
        'unlocking': 'Unlocking',
        'data-recovery': 'Data Recovery',
        'dead': 'Dead',
        'motherboard-issue': 'Motherboard issue',
        'ic-work': 'IC work',
        'other': 'Other'
    };

    return `
        <div class="report-entry-card">
            <div class="report-entry-header">
                <span><strong>${entry.customerName}</strong> - ${entry.phoneNumber}</span>
                <span class="status-badge status-${entry.status.replace('-', '-')}">${entry.status}</span>
            </div>
            <div class="report-entry-details">
                <div><strong>Device:</strong> ${entry.brand} ${entry.model}</div>
                <div><strong>Service:</strong> ${serviceTypeLabels[entry.serviceType] || entry.serviceType}</div>
                <div><strong>Date:</strong> ${formatDate(entry.entryDate)}</div>
                <div><strong>Amount:</strong> ₹${parseFloat(entry.estimatedCost || 0).toFixed(2)} | <strong>Advance:</strong> ₹${parseFloat(entry.advanceAmount || 0).toFixed(2)}</div>
            </div>
        </div>
    `;
}

// Download Daily Report to Excel
function downloadDailyReport() {
    const selectedDate = document.getElementById('dailyReportDate').value;
    
    if (!selectedDate) {
        showNotification('Please select a date first', 'error');
        return;
    }

    const entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    const filteredEntries = entries.filter(entry => {
        const entryDate = entry.entryDate ? entry.entryDate.split('T')[0] : '';
        return entryDate === selectedDate;
    });

    if (filteredEntries.length === 0) {
        showNotification('No entries found for the selected date', 'error');
        return;
    }

    exportEntriesToExcel(filteredEntries, `Daily_Report_${selectedDate.replace(/-/g, '')}`);
}

// Download Sales Report to Excel
function downloadSalesReport() {
    const startDate = document.getElementById('salesReportStartDate').value;
    const endDate = document.getElementById('salesReportEndDate').value;
    const statusFilter = document.getElementById('salesReportStatus').value;

    if (!startDate || !endDate) {
        showNotification('Please select start and end dates first', 'error');
        return;
    }

    const entries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    let filteredEntries = entries.filter(entry => {
        const entryDate = entry.entryDate ? entry.entryDate.split('T')[0] : '';
        return entryDate >= startDate && entryDate <= endDate;
    });

    if (statusFilter !== 'all') {
        filteredEntries = filteredEntries.filter(entry => entry.status === statusFilter);
    }

    filteredEntries = filteredEntries.filter(entry => 
        entry.status === 'completed' || entry.status === 'delivered'
    );

    if (filteredEntries.length === 0) {
        showNotification('No sales found for the selected period', 'error');
        return;
    }

    exportEntriesToExcel(filteredEntries, `Sales_Report_${startDate.replace(/-/g, '')}_${endDate.replace(/-/g, '')}`);
}

// Export specific entries to Excel
function exportEntriesToExcel(entries, filenamePrefix) {
    try {
        const serviceTypeLabels = {
            'screen-repair': 'Screen Repair/Replacement',
            'battery': 'Battery Replacement',
            'charging-port': 'Charging Port Repair',
            'software': 'Software Issue',
            'water-damage': 'Water Damage Repair',
            'camera': 'Camera Repair',
            'speaker': 'Speaker/Microphone Repair',
            'button': 'Button Repair',
            'fingerprint': 'Fingerprint',
            'simtray': 'SIM Tray',
            'stripe': 'Stripe',
            'unlocking': 'Unlocking',
            'data-recovery': 'Data Recovery',
            'dead': 'Dead',
            'motherboard-issue': 'Motherboard issue',
            'ic-work': 'IC work',
            'other': 'Other'
        };

        const excelData = entries.map(entry => {
            const balance = (parseFloat(entry.estimatedCost || 0) - parseFloat(entry.advanceAmount || 0)).toFixed(2);
            
            return {
                'Job No': entry.jobNumber || generateJobNumber(entry.entryDate),
                'Entry Date': entry.entryDate ? formatDateForExcel(entry.entryDate) : '',
                'Customer Name': entry.customerName || '',
                'Phone Number': entry.phoneNumber || '',
                'Email': entry.email || '',
                'Address': entry.address || '',
                'Device Type': entry.deviceType || '',
                'Brand': entry.brand || '',
                'Model': entry.model || '',
                'IMEI': entry.imei || '',
                'Color': entry.color || '',
                'Password': entry.password || '',
                'Service Type': serviceTypeLabels[entry.serviceType] || entry.serviceType || '',
                'Priority': entry.priority || '',
                'Product Condition': entry.problemDescription || '',
                'Received Items': entry.receivedItems || '',
                'Estimated Cost (₹)': parseFloat(entry.estimatedCost || 0).toFixed(2),
                'Advance Amount (₹)': parseFloat(entry.advanceAmount || 0).toFixed(2),
                'Balance (₹)': balance,
                'Expected Delivery Date': entry.expectedDelivery ? formatDateForExcel(entry.expectedDelivery) : '',
                'Status': entry.status || '',
                'Technician Notes': entry.technicianNotes || '',
                'Created At': entry.createdAt ? formatDateForExcel(entry.createdAt.split('T')[0]) : ''
            };
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        const colWidths = [
            { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 20 },
            { wch: 25 }, { wch: 30 }, { wch: 12 }, { wch: 15 }, { wch: 20 },
            { wch: 18 }, { wch: 12 }, { wch: 15 }, { wch: 25 }, { wch: 10 },
            { wch: 40 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 },
            { wch: 15 }, { wch: 40 }, { wch: 15 }
        ];
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, 'Report');

        const filename = `${filenamePrefix}.xlsx`;
        XLSX.writeFile(wb, filename);
        
        showNotification(`Excel file "${filename}" downloaded successfully!`, 'success');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showNotification('Error exporting to Excel. Please try again.', 'error');
    }
}

// Format date for Excel (YYYY-MM-DD format)
function formatDateForExcel(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0];
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

