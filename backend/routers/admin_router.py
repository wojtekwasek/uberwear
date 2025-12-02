from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from models.tables.address import Address
from sqlalchemy.orm import Session

from models.tables.client import Client
from models.tables.courier import Courier
from models.tables.user import User, UserType
from utils.auth import get_current_active_admin
from utils.database import get_db


router = APIRouter()

# Endpoint /admin/clients - zwraca informacje o wszystkich klientach
@router.get("/admin/clients")
def get_clients(
    start_index: int = 0,
    limit: int = 50,
    search: str = None,
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_active_admin)):
    query = db.query(User).filter(User.user_type == "Client")
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (User.name.ilike(search_term)) | 
            (User.surname.ilike(search_term)) |
            (User.email.ilike(search_term))
        )
    
    client_users = query.offset(start_index).limit(limit).all()

    clients_data = []

    for user in client_users:
        user.client = db.query(Client).filter(Client.user_ID == user.user_ID).first()
        clients_data.append(user.__dict__)
    
    return_data = []

    for client_data in clients_data:
        client = {
            "client_ID": client_data['client'].client_ID,
            "user_ID": client_data['user_ID'],
            "name": client_data['name'],
            "surname": client_data['surname'],
            "email": client_data['email'],
            "phone": client_data['phone'],
            "created_at": client_data['created_at'],
            "status": client_data['status'],
            "last_login": client_data['last_login'],
            "loyalty_points": client_data['client'].loyalty_points
        }

        return_data.append(client)
    
    return return_data

@router.get("/admin/clients/{client_id}")
def get_client(client_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_active_admin)):
    client = db.query(Client).filter(Client.client_ID == client_id).first()
    if not client:
        raise HTTPException(status_code=400, detail="Client does not exist")
    
    user = db.query(User).filter(User.user_ID == client.user_ID).first()

    address = db.query(Address).filter(Address.address_ID == client.address_ID).first()

    return_structure = {
        "client_ID": client.client_ID,
        "user_ID": user.user_ID,
        "name": user.name,
        "surname": user.surname,
        "email": user.email,
        "phone": user.phone,
        "created_at": user.created_at,
        "status": user.status,
        "last_login": user.last_login,
        "loyalty_points": client.loyalty_points,
        "address": {
            "address_ID": address.address_ID,
            "street": address.street,
            "city": address.city,
            "postcode": address.postcode,
            "district": address.district
        }
    }

    return return_structure

@router.get("/admin/couriers")
def get_couriers(
    start_index: int = 0,
    limit: int = 50,
    search: str = None,
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_active_admin)):
    query = db.query(User).filter(User.user_type == "Courier")
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (User.name.ilike(search_term)) | 
            (User.surname.ilike(search_term)) |
            (User.email.ilike(search_term))
        )
    
    courier_users = query.offset(start_index).limit(limit).all()

    couriers_data = []

    for user in courier_users:
        user.courier = db.query(Courier).filter(Courier.user_ID == user.user_ID).first()
        couriers_data.append(user.__dict__)
    
    return_data = []

    for courier_data in couriers_data:
        courier = {
            "courier_ID": courier_data['courier'].courier_ID,
            "user_ID": courier_data['user_ID'],
            "name": courier_data['name'],
            "surname": courier_data['surname'],
            "email": courier_data['email'],
            "phone": courier_data['phone'],
            "created_at": courier_data['created_at'],
            "status": courier_data['status'],
            "last_login": courier_data['last_login'],
            "delivery_transport": courier_data['courier'].delivery_transport,
            "license_plate": courier_data['courier'].license_plate
        }

        return_data.append(courier)
    
    return return_data

@router.get("/admin/couriers/{courier_id}")
def get_courier(courier_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_active_admin)):
    courier = db.query(Courier).filter(Courier.courier_ID == courier_id).first()
    if not courier:
        raise HTTPException(status_code=400, detail="Courier does not exist")
    
    user = db.query(User).filter(User.user_ID == courier.user_ID).first()

    return_structure = {
        "courier_ID": courier.courier_ID,
        "user_ID": user.user_ID,
        "name": user.name,
        "surname": user.surname,
        "email": user.email,
        "phone": user.phone,
        "created_at": user.created_at,
        "status": user.status,
        "last_login": user.last_login,
        "delivery_transport": courier.delivery_transport,
        "license_plate": courier.license_plate
    }

    return return_structure

class CreateCourier(BaseModel):
    delivery_transport: str
    license_plate: str

@router.post("/admin/{user_id}/courier")
def assign_courier(user_id: int, courier_data: CreateCourier, 
                   db: Session = Depends(get_db), user: User = Depends(get_current_active_admin)):
    user = db.query(User).filter(User.user_ID == user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User does not exist")
    
    if user.user_type != UserType.Courier:
        user.user_type = UserType.Courier
        db.commit()

    courier = db.query(Courier).filter(Courier.user_ID == user_id).first()
    if courier:
        raise HTTPException(status_code=400, detail="Courier already exists for this user")
    
    new_courier = Courier(
        user_ID=user_id, 
        delivery_transport=courier_data.delivery_transport, 
        license_plate=courier_data.license_plate)
    db.add(new_courier)
    db.commit()
    db.refresh(new_courier)

    return {"detail": "Courier assigned", "courier_id": new_courier.courier_ID}

@router.delete("/admin/{user_id}/courier")
def remove_courier(user_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_active_admin)):
    user = db.query(User).filter(User.user_ID == user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User does not exist")
    if user.user_type == UserType.Courier:
        user.user_type = UserType.Client
        db.commit()

    courier = db.query(Courier).filter(Courier.user_ID == user_id).first()
    if not courier:
        raise HTTPException(status_code=400, detail="Courier does not exist for this user")
    
    db.delete(courier)
    db.commit()

    return {"detail": "Courier removed"}

@router.patch("/admin/{user_id}/activate")
def activate_user(user_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_active_admin)):
    user = db.query(User).filter(User.user_ID == user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User does not exist")
    user.status = "Active"
    db.commit()
    return {"detail": "User activated"}

@router.patch("/admin/{user_id}/deactivate")
def deactivate_user(user_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_active_admin)):
    user = db.query(User).filter(User.user_ID == user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User does not exist")
    user.status = "Inactive"
    db.commit()
    return {"detail": "User deactivated"}