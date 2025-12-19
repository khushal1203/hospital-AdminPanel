// Fetch all donors
export const fetchDonors = async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, value);
        }
    });

    const response = await fetch(`/api/donors?${params}`);
    return response.json();
};

// Fetch donor by ID
export const fetchDonorById = async (id) => {
    const response = await fetch(`/api/donors/${id}`);
    return response.json();
};

// Update donor
export const updateDonor = async (id, data) => {
    const response = await fetch(`/api/donors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

// Delete donor
export const deleteDonor = async (id) => {
    const response = await fetch(`/api/donors/${id}`, {
        method: 'DELETE'
    });
    return response.json();
};

// Create donor
export const createDonor = async (data) => {
    const response = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};