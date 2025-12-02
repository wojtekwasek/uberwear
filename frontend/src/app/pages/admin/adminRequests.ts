import { baseURL } from "../../requests";

export const getOrderDetails = async (accessToken: string, orderId: string) => {
    const response = await fetch(baseURL + `/orders/${orderId}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}

export const requestCancelOrder = async (accessToken: string, orderId: string) => {
    const response = await fetch(baseURL + `/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}

export const requestDeleteOrder = async (accessToken: string, orderId: string) => {
    const response = await fetch(baseURL + `/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}

export const getCouriers = async (accessToken: string, index: number = 0, limit: number = 50, search: string = '') => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await fetch(baseURL + `/admin/couriers?start_index=${index}&limit=${limit}${searchParam}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}

export const getCourierDetails = async (accessToken: string, courierId: string) => {
    const response = await fetch(baseURL + `/admin/couriers/${courierId}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}


export const getClientDetails = async (accessToken: string, clientId: string) => {
    const response = await fetch(baseURL + `/admin/clients/${clientId}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}

export const requestActivateUser = async (accessToken: string, userId: string) => {
    const response = await fetch(baseURL + `/admin/${userId}/activate`, {
        method: 'PATCH',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}

export const requestDeactivateUser = async (accessToken: string, userId: string) => {
    const response = await fetch(baseURL + `/admin/${userId}/deactivate`, {
        method: 'PATCH',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}

export const getCourierOrders = async (accessToken: string, courierId: string) => {
    const response = await fetch(baseURL + `/courier/${courierId}/orders`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}

export const getClientOrders = async (accessToken: string, clientId: string) => {
    const response = await fetch(baseURL + `/client/${clientId}/orders`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}


export const getClients = async (accessToken: string, index: number = 0, limit: number = 50, search: string = '') => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await fetch(baseURL + `/admin/clients?start_index=${index}&limit=${limit}${searchParam}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}