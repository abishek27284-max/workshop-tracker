const API_PATH = '/api/tools';
let cachedInventory = [];

const toolForm = document.getElementById('toolForm');
const formHeading = document.getElementById('formHeading');
const editItemIdInput = document.getElementById('editItemId');
const toolLabelInput = document.getElementById('toolLabelInput');
const storageSpotInput = document.getElementById('storageSpotInput');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const searchInput = document.getElementById('searchInput');
const catalogContainer = document.getElementById('catalogContainer');

async function loadInventory() {
    const response = await fetch(API_PATH);
    cachedInventory = await response.json();
    updateDashboardCounters();
    renderCatalogList();
}

function updateDashboardCounters() {
    const total = cachedInventory.length;
    const borrowed = cachedInventory.filter(item => item.checkedOut).length;
    const available = total - borrowed;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('availableCount').textContent = available;
    document.getElementById('borrowedCount').textContent = borrowed;
}

function renderCatalogList() {
    const query = searchInput.value.trim().toLowerCase();
    catalogContainer.innerHTML = '';

    const filtered = cachedInventory.filter(item =>
        item.label.toLowerCase().includes(query) ||
        item.storageSpot.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        catalogContainer.innerHTML = '<div class="empty-state">No matching equipment found.</div>';
        return;
    }

    filtered.forEach(item => {
        const statusClass = item.checkedOut ? 'badge-borrowed' : 'badge-available';
        const statusText = item.checkedOut ? 'Checked Out' : 'In Stock';
        const toggleText = item.checkedOut ? 'Return' : 'Check Out';

        const row = document.createElement('div');
        row.className = 'tool-row';
        row.innerHTML = `
            <div>
                <span class="tool-title">${escapeHtml(item.label)}</span>
                <span class="badge-status ${statusClass}">${statusText}</span>
                <div class="spot-tag">Location: ${escapeHtml(item.storageSpot)}</div>
            </div>
            <div class="actions">
                <button class="btn btn-secondary" data-action="toggle" data-id="${item.itemId}">${toggleText}</button>
                <button class="btn btn-secondary" data-action="edit" data-id="${item.itemId}">Edit</button>
                <button class="btn btn-danger" data-action="delete" data-id="${item.itemId}">Delete</button>
            </div>
        `;
        catalogContainer.appendChild(row);
    });
}

toolForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
        label: toolLabelInput.value.trim(),
        storageSpot: storageSpotInput.value.trim()
    };

    const editingId = editItemIdInput.value;

    if (editingId) {
        await fetch(`${API_PATH}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else {
        await fetch(API_PATH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, checkedOut: false })
        });
    }

    resetFormState();
    await loadInventory();
});

catalogContainer.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === 'toggle') {
        await fetch(`${API_PATH}/${id}/toggle`, { method: 'PATCH' });
        await loadInventory();
    } else if (action === 'delete') {
        await fetch(`${API_PATH}/${id}`, { method: 'DELETE' });
        await loadInventory();
    } else if (action === 'edit') {
        const target = cachedInventory.find(item => item.itemId === id);
        if (!target) return;

        editItemIdInput.value = target.itemId;
        toolLabelInput.value = target.label;
        storageSpotInput.value = target.storageSpot;
        formHeading.textContent = 'Edit Equipment';
        submitBtn.textContent = 'Update Equipment';
        cancelEditBtn.classList.remove('hidden');
        toolLabelInput.focus();
    }
});

cancelEditBtn.addEventListener('click', resetFormState);
searchInput.addEventListener('input', renderCatalogList);

function resetFormState() {
    editItemIdInput.value = '';
    toolLabelInput.value = '';
    storageSpotInput.value = '';
    formHeading.textContent = 'Add New Equipment';
    submitBtn.textContent = 'Save Equipment';
    cancelEditBtn.classList.add('hidden');
}

function escapeHtml(text) {
    return text.replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

loadInventory();
