from datetime import datetime
import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from models.tables.address import Address
from models.tables.courier import Courier
from models.tables.payment import Payment
from models.tables.product_order import ProductOrder
from models.tables.shop import Shop
from models.tables.user import User, UserType
from utils.auth import get_current_active_admin, get_current_active_client, get_current_active_courier, get_current_active_user
from models.tables.client import Client
from models.tables.order import Order
from utils.database import get_db
from models.tables.product import Product
from sqlalchemy.orm import Session

from utils.logic import choose_courier

# Utworzenie instancji routera API
router = APIRouter()

# Pobieranie listy zamówień z bazy dla danego klienta
@router.get("/client/{client_id}/orders")
def get_orders_by_client(client_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_client = db.query(Client).filter(Client.client_ID == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    if current_user.user_type != UserType.Admin and db_client.user_ID != current_user.user_ID:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    orders = db.query(Order).filter(Order.client_ID == client_id).all()

    return_list = []

    for order in orders:
        products_ordered = db.query(ProductOrder).filter(ProductOrder.order_ID == order.order_ID).all()
        order_payment = db.query(Payment).filter(Payment.payment_ID == order.payment_ID).first()
        order_courier = db.query(Courier).filter(Courier.courier_ID == order.courier_ID).first()
        courier_user = db.query(User).filter(User.user_ID == order_courier.user_ID).first()
        order_address = db.query(Address).filter(Address.address_ID == order.address_ID).first()
        products_list = []
        for product_ordered in products_ordered:
            product = db.query(Product).filter(Product.product_ID == product_ordered.product_ID).first()
            shop = db.query(Shop).filter(Shop.shop_ID == product.shop_ID).first()
            products_list.append({
                'product': {
                    'id': product.product_ID,
                    'name': product.name,
                    'price': product.price,
                    'shop': {
                        'id': shop.shop_ID,
                        'name': shop.name
                    }
                },
                'ordered_amount': product_ordered.amount
            })
        return_list.append({
            'id': order.order_ID,
            'date': order.order_date,
            'status': order.status,
            'payment': {
                'id': order_payment.payment_ID,
                'status': order_payment.status,
                'method': order_payment.payment_method
            },
            'address': {
                'street': order_address.street,
                'city': order_address.city,
                'postcode': order_address.postcode
            },
            'courier': {
                'id': order_courier.courier_ID,
                'name': courier_user.name,
                'surname': courier_user.surname,
                'delivery_transport': order_courier.delivery_transport,
                'license_plate': order_courier.license_plate
            },
            'products': products_list,
        })

    return return_list

@router.get("/courier/{courier_id}/orders")
def get_orders_by_courier(courier_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_courier = db.query(Courier).filter(Courier.courier_ID == courier_id).first()
    if not db_courier:
        raise HTTPException(status_code=404, detail="Courier not found")
    
    if current_user.user_type != UserType.Admin and db_courier.user_ID != current_user.user_ID:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    orders = db.query(Order).filter(Order.courier_ID == courier_id).all()

    return_list = []

    for order in orders:
        products_ordered = db.query(ProductOrder).filter(ProductOrder.order_ID == order.order_ID).all()
        order_client = db.query(Client).filter(Client.client_ID == order.client_ID).first()
        client_user = db.query(User).filter(User.user_ID == order_client.user_ID).first()
        order_payment = db.query(Payment).filter(Payment.payment_ID == order.payment_ID).first()
        order_courier = db.query(Courier).filter(Courier.courier_ID == order.courier_ID).first()
        order_address = db.query(Address).filter(Address.address_ID == order.address_ID).first()
        products_list = []
        for product_ordered in products_ordered:
            product = db.query(Product).filter(Product.product_ID == product_ordered.product_ID).first()
            shop = db.query(Shop).filter(Shop.shop_ID == product.shop_ID).first()
            products_list.append({
                'product': {
                    'id': product.product_ID,
                    'name': product.name,
                    'price': product.price,
                    'shop': {
                        'id': shop.shop_ID,
                        'name': shop.name
                    }
                },
                'ordered_amount': product_ordered.amount
            })
        return_list.append({
            'id': order.order_ID,
            'date': order.order_date,
            'status': order.status,
            'client': {
                'id': order_client.client_ID,
                'name': client_user.name,
                'surname': client_user.surname
            },
            'payment': {
                'id': order_payment.payment_ID,
                'status': order_payment.status,
                'method': order_payment.payment_method
            },
            'address': {
                'street': order_address.street,
                'city': order_address.city,
                'postcode': order_address.postcode
            },
            'products': products_list,
        })

    return return_list


@router.get("/orders")
def get_all_orders(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    total = db.query(Order).count()
    orders = db.query(Order).offset(skip).limit(limit).all()

    return_list = []

    for order in orders:
        products_ordered = db.query(ProductOrder).filter(ProductOrder.order_ID == order.order_ID).all()
        order_client = db.query(Client).filter(Client.client_ID == order.client_ID).first()
        client_user = db.query(User).filter(User.user_ID == order_client.user_ID).first()
        order_payment = db.query(Payment).filter(Payment.payment_ID == order.payment_ID).first()
        order_courier = db.query(Courier).filter(Courier.courier_ID == order.courier_ID).first()
        courier_user = db.query(User).filter(User.user_ID == order_courier.user_ID).first()
        order_address = db.query(Address).filter(Address.address_ID == order.address_ID).first()
        products_list = []
        for product_ordered in products_ordered:
            product = db.query(Product).filter(Product.product_ID == product_ordered.product_ID).first()
            shop = db.query(Shop).filter(Shop.shop_ID == product.shop_ID).first()
            products_list.append({
                'product': {
                    'id': product.product_ID,
                    'name': product.name,
                    'price': product.price,
                    'shop': {
                        'id': shop.shop_ID,
                        'name': shop.name
                    }
                },
                'ordered_amount': product_ordered.amount
            })
        return_list.append({
            'id': order.order_ID,
            'date': order.order_date,
            'status': order.status,
            'client': {
                'id': order_client.client_ID,
                'name': client_user.name,
                'surname': client_user.surname
            },
            'payment': {
                'id': order_payment.payment_ID,
                'status': order_payment.status,
                'method': order_payment.payment_method
            },
            'address': {
                'street': order_address.street,
                'city': order_address.city,
                'postcode': order_address.postcode
            },
            'courier': {
                'id': order_courier.courier_ID,
                'name': courier_user.name,
                'surname': courier_user.surname,
                'delivery_transport': order_courier.delivery_transport,
                'license_plate': order_courier.license_plate
            },
            'products': products_list,
        })

    return {
        'total': total,
        'skip': skip,
        'limit': limit,
        'orders': return_list
    }

@router.get("/orders/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_order = db.query(Order).filter(Order.order_ID == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    products_ordered = db.query(ProductOrder).filter(ProductOrder.order_ID == order_id).all()
    order_client = db.query(Client).filter(Client.client_ID == db_order.client_ID).first()
    client_user = db.query(User).filter(User.user_ID == order_client.user_ID).first()
    order_payment = db.query(Payment).filter(Payment.payment_ID == db_order.payment_ID).first()
    order_courier = db.query(Courier).filter(Courier.courier_ID == db_order.courier_ID).first()
    courier_user = db.query(User).filter(User.user_ID == order_courier.user_ID).first()
    order_address = db.query(Address).filter(Address.address_ID == db_order.address_ID).first()
    products_list = []
    for product_ordered in products_ordered:
        product = db.query(Product).filter(Product.product_ID == product_ordered.product_ID).first()
        shop = db.query(Shop).filter(Shop.shop_ID == product.shop_ID).first()
        products_list.append({
            'product': {
                'id': product.product_ID,
                'name': product.name,
                'price': product.price,
                'shop': {
                    'id': shop.shop_ID,
                    'name': shop.name
                }
            },
            'ordered_amount': product_ordered.amount
        })

    return {
        'id': db_order.order_ID,
        'date': db_order.order_date,
        'status': db_order.status,
        'client': {
            'id': order_client.client_ID,
            'name': client_user.name,
            'surname': client_user.surname
        },
        'payment': {
            'id': order_payment.payment_ID,
            'status': order_payment.status,
            'method': order_payment.payment_method,
            'price': order_payment.price
        },
        'address': {
            'street': order_address.street,
            'city': order_address.city,
            'postcode': order_address.postcode
        },
        'courier': {
            'id': order_courier.courier_ID,
            'name': courier_user.name,
            'surname': courier_user.surname,
            'delivery_transport': order_courier.delivery_transport,
            'license_plate': order_courier.license_plate
        },
        'products': products_list,
    }


class ProductInput(BaseModel):
    id: int
    count: int

class OrderInput(BaseModel):
    products: list[ProductInput]
    payment_method: str

class ReturnOrderInput(BaseModel):
    products: list[ProductInput]

# Utworzenie zamówienia - wymagany zalogowany client
@router.post("/orders")
def make_order(input: OrderInput, db: Session = Depends(get_db), current_client: Client = Depends(get_current_active_client)):
    ordered_products = []

    for product in input.products:
        db_product = db.query(Product).filter(Product.product_ID == product.id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail=f"Product {product.id} not found")
        
        if db_product.amount < product.count:
            raise HTTPException(status_code=400, detail=f"Not enough {db_product.name} in stock")
        
        ordered_products.append({
            'product': db_product.__dict__.copy(),
            'count': product.count
        })

        db_product.amount -= product.count

    # Wybranie kuriera do dostawy
    courier = choose_courier(db)
    if not courier:
        raise HTTPException(status_code=400, detail="No courier available")
    
    # Utworzenie płatności
    new_payment = Payment(
        price = sum([product['product']['price'] * product['count'] for product in ordered_products]),
        status = "Awaits",
        payment_method = input.payment_method
    )

    new_status = "Pending"
    if input.payment_method == "cash":
        new_status = "Shipped"

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    # Utworzenie zamówienia
    new_order = Order(
        order_date=datetime.now(),
        client_ID=current_client.client_ID,
        status=new_status,
        courier_ID=courier.courier_ID,
        payment_ID=new_payment.payment_ID,
        address_ID=current_client.address_ID
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for product in ordered_products:
        new_product_order = ProductOrder(
            order_ID=new_order.order_ID,
            product_ID=product['product']['product_ID'],
            amount=product['count']
        )
        db.add(new_product_order)
        db.commit()

    return {
        "message": "Order created successfully - awaiting payment",
        "created_order_id": new_order.order_ID,
        "payment": {
            "id": new_payment.payment_ID,
            "status": new_payment.status,
            "method": new_payment.payment_method
        },
        "ordered_products": ordered_products,
    }

@router.put("/orders/{order_id}/pay")
def pay_order(order_id: int, db: Session = Depends(get_db), current_client: Client = Depends(get_current_active_client)):
    db_order = db.query(Order).filter(Order.order_ID == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    db_payment = db.query(Payment).filter(Payment.payment_ID == db_order.payment_ID).first()
    if db_payment.status != "Awaits":
        raise HTTPException(status_code=400, detail="Payment already done")

    db_payment.status = "Done"

    if db_order.status != "Shipped" and db_order.status != "Delivered" and db_order.status != "Finalized":
        db_order.status = "Shipped"
    if db_order.status == "Delivered":
        # add loyalty points
        db_client = db.query(Client).filter(Client.client_ID == db_order.client_ID).first()
        db_client.loyalty_points += db_payment.price // 10
        db_order.status = "Finalized"
    db.commit()

    return {
        "message": "Order paid successfully",
        "order": {
            "id": db_order.order_ID,
            "status": db_order.status
        },
        "payment": {
            "id": db_payment.payment_ID,
            "status": db_payment.status,
            "method": db_payment.payment_method
        }
    }

@router.put("/orders/{order_id}/cancel")
def cancel_order(order_id: int, 
                 db: Session = Depends(get_db), 
                 current_client: Client = Depends(get_current_active_client),
                 current_user: User = Depends(get_current_active_user)):
    db_order = db.query(Order).filter(Order.order_ID == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if current_user.user_type != "admin" and db_order.client_ID != current_client.client_ID:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if db_order.status == "Canceled":
        raise HTTPException(status_code=400, detail="Order already canceled")
    
    if db_order.status != "Finalized":
        raise HTTPException(status_code=400, detail="Order already paid and cannot be cancelled")
    
    db_payment = db.query(Payment).filter(Payment.payment_ID == db_order.payment_ID).first()
    db_payment.status = "Canceled"
    db.commit()

    db_order.status = "Canceled"
    db.commit()

    return {
        "message": "Order cancelled successfully",
        "order": {
            "id": db_order.order_ID,
            "status": db_order.status
        }
    }

@router.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_admin)):
    db_order = db.query(Order).filter(Order.order_ID == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db_payment = db.query(Payment).filter(Payment.payment_ID == db_order.payment_ID).first()
    db.query(ProductOrder).filter(ProductOrder.order_ID == order_id).delete()
    db.delete(db_payment)
    db.delete(db_order)
    db.commit()

    return {
        "message": "Order deleted successfully",
        "order_id": order_id
    }

@router.patch("/orders/{order_id}/deliver")
def deliver_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_courier)):

    db_order = db.query(Order).filter(Order.order_ID == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if db_order.status != "Shipped":
        raise HTTPException(status_code=400, detail="Order not shipped yet")
    
    payment = db.query(Payment).filter(Payment.payment_ID == db_order.payment_ID).first()
    if payment.status != "Done":
        db_order.status = "Delivered"
    else:
        # add loyalty points
        db_client = db.query(Client).filter(Client.client_ID == db_order.client_ID).first()
        db_client.loyalty_points += payment.price // 10
        db_order.status = "Finalized"
    
    db.commit()

    return {
        "message": "Order delivered successfully",
        "order": {
            "id": db_order.order_ID,
            "status": db_order.status
        }
    }


# Partially return orders by specifying product IDs and amounts in request body
# The products are removed from order and added back to shop stock
@router.put("/orders/{order_id}/return")
def return_order(order_id: int, input: ReturnOrderInput, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_client)):
    db_order = db.query(Order).filter(Order.order_ID == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if db_order.status == "Canceled":
        raise HTTPException(status_code=400, detail="Order already canceled")
    
    if db_order.status == "Finalized":
        raise HTTPException(status_code=400, detail="Order already finalized")  
    
    for product in input.products:
        db_product_order = db.query(ProductOrder).filter(ProductOrder.order_ID == order_id).filter(ProductOrder.product_ID == product.id).first()
        if not db_product_order:
            raise HTTPException(status_code=404, detail=f"Product {product.id} not found in order")
        
        count = product.count
        if db_product_order.amount < product.count:
            count = db_product_order.amount
        
        # Update the amount of the product in the order (or delete if <=0)
        db_product_order.amount -= count
        if db_product_order.amount <= 0:
            db.delete(db_product_order)

        db_product = db.query(Product).filter(Product.product_ID == product.id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail=f"Product {product.id} not found")
        
        
        # Update the payment amount of the order
        db_payment = db.query(Payment).filter(Payment.payment_ID == db_order.payment_ID).first()
        db_payment.price -= db_product.price * count
        
        # Update the stock of the shop
        db_product.amount += product.count
        db.commit()

    return {
        "message": "Order partially returned successfully",
        "order": {
            "id": db_order.order_ID,
            "status": db_order.status
        }
    }