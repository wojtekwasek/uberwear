import { UserData } from "./redux/userSlice";

//export const baseURL = 'https://quickfit.villyware.com/api';
export const baseURL = 'http://localhost:8015';

export const getClientID = async (accessToken: string) => {
  const response = await fetch(baseURL + '/user/me', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.client_id;
}


export const loginRequest = async (email: string, 
  password: string 
) => {
  const response = await fetch(baseURL + '/login', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const status = response.status;
  const data = await response.json();
  return { status, data };
};

export const createAccount = async (
  email: string, 
  password: string,
  name: string,
  surname: string,
  phone: string,
  street: string,
  city: string,
  postcode: string,
  district: string
) => {
  const response = await fetch(baseURL + '/register', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name, surname, phone, street, city, postcode, district }),
  });
  const status = response.status;
  const data = await response.json();
  return { status, data };
};

export const makeOrderRequest = async (accessToken: string,
  products: {id: number, count: number}[],
  payment_method: string 
) => {
  const response = await fetch(baseURL + '/orders', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ products, payment_method }),
  });
  const status = response.status;
  const data = await response.json();
  return { status, data };
};

export const getUserInfo = async (accessToken: string) => {
  const response = await fetch(baseURL + '/user/me', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

export const updateUserInfo = async (accessToken: string, formData: any) => {
  const body = {
    name: formData.firstName ?? formData.Imię,
    surname: formData.lastName ?? formData.Nazwisko,
    email: formData.email ?? formData.Email,
    phone: formData.phone ?? formData['Numer Telefonu'],
    password: formData.password ?? formData.Hasło,
  }

  const response = await fetch(baseURL + '/user/me', {
    method: 'PATCH',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
  return response.json();
};

export const getOrders = async (accessToken: string) => {
  const response = await fetch(baseURL + '/orders', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.json();
}

// Account

export const createAdminRequest = async (accessToken: string, email: string, password: string) => {
  const response = await fetch(baseURL + '/user/admin', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};



export const getLoyaltyPoints = async (accessToken: string) => {
  const response = await fetch(baseURL + '/user/LoyaltyPoints', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.loyalty_points;
};

// Shop
export const getShops = async () => {
  const response = await fetch(baseURL + '/shops', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const getCategories = async (shopId: string) => {
  const response = await fetch(baseURL + `/shop/${shopId}/categories`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const getColors = async (shopId: string, category: string) => {
  const response = await fetch(baseURL + `/shop/${shopId}/category/${category}/colors`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const getProductsByCategoryColor = async (shopId: string, category: string, color: string) => {
  const response = await fetch(baseURL + `/shop/${shopId}/category/${category}/colors/${color}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const getShop = async (shopId: string) => {
  const response = await fetch(baseURL + `/shop/${shopId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const updateShop = async (shopId: string, shopData: any) => {
  const response = await fetch(baseURL + `/shop/${shopId}`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shopData),
  });
  return response.json();
};

export const deleteShop = async (shopId: string) => {
  const response = await fetch(baseURL + `/shop/${shopId}`, {
    method: 'DELETE',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const addShop = async (shopData: any) => {
  const response = await fetch(baseURL + '/shop', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shopData),
  });
  return response.json();
};

// Product
export const getProducts = async () => {
  const response = await fetch(baseURL + '/products', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const getProduct = async (productId: string) => {
  const response = await fetch(baseURL + `/product/${productId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const updateProduct = async (productId: string, productData: any) => {
  const response = await fetch(baseURL + `/product/${productId}`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const deleteProduct = async (productId: string) => {
  const response = await fetch(baseURL + `/product/${productId}`, {
    method: 'DELETE',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const addProduct = async (shopId: string, productData: any) => {
  const response = await fetch(baseURL + `/shop/${shopId}/product`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const getOrderById = async (accessToken: string,orderId: string) => {
  const response = await fetch(baseURL + `/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

// Order
export const getOrdersByClient = async (accessToken: string,client_id: string) => {
  const response = await fetch(baseURL + `/client/${client_id}/orders`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

export const getCourierID = async (accessToken: string) => {
  const response = await fetch(baseURL + '/user/me', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.courier;
}

export const getOrdersByCourier = async (accessToken:string,courierId: string) => {
  const response = await fetch(baseURL + `/courier/${courierId}/orders`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

export const getAllOrders = async () => {
  const response = await fetch(baseURL + '/orders', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const payOrder = async (access: string, orderId: string) => {
  const response = await fetch(baseURL + `/orders/${orderId}/pay`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${access}`,
    },
  });
  return response.json();
};

export const cancelOrder = async (orderId: string) => {
  const response = await fetch(baseURL + `/orders/${orderId}/cancel`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const deleteOrder = async (orderId: string) => {
  const response = await fetch(baseURL + `/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const deliverOrder = async (accessToken:string,orderId: number) => {
  const response = await fetch(baseURL + `/orders/${orderId}/deliver`, {
    method: 'PATCH',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

export const getCouriers = async () => {
  const response = await fetch(baseURL + '/admin/couriers', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const assignCourier = async (userId: string) => {
  const response = await fetch(baseURL + `/admin/${userId}/courier`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};

export const removeCourier = async (userId: string) => {
  const response = await fetch(baseURL + `/admin/${userId}/courier`, {
    method: 'DELETE',
    headers: {
      'accept': 'application/json',
    },
  });
  return response.json();
};
