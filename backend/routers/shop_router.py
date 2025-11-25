from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from models.tables.product import Product
from sqlalchemy.orm import Session

from models.tables.address import Address
from models.tables.shop import Shop
from utils.auth import get_current_active_admin
from utils.database import get_db


# Utworzenie instancji routera API
router = APIRouter()

class ShopCreate(BaseModel):
    name: str
    phone: str
    street: str
    city: str
    postcode: str

class ShopUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    postcode: Optional[str] = None


# Pobieranie listy sklepów z bazy
@router.get("/shops")
def get_shops(db: Session = Depends(get_db)):
    shops = db.query(Shop).limit(1).all()
    shops_list = [shop.__dict__.copy() for shop in shops]

    for shop_dict in shops_list:
        products_count = db.query(Product).filter(Product.shop_ID == shop_dict['shop_ID']).count()
        shop_dict['products_count'] = products_count

    return shops_list

# Pobieranie sklepu po ID
@router.get("/shop/{shop_id}")
def get_shop(shop_id: int, 
             expand_address: Optional[bool] = True, 
             show_products: Optional[bool] = True,
            db: Session = Depends(get_db)):
    
    shop = db.query(Shop).filter(Shop.shop_ID == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    
    shop_dict = shop.__dict__.copy()
    if expand_address:
        address = db.query(Address).filter(Address.address_ID == shop.address_ID).first()
        if address:
            shop_dict['address'] = address.__dict__.copy()
    
    if show_products:
        products = db.query(Product).filter(Product.shop_ID == shop_id).all()
        products_list = [product.__dict__.copy() for product in products]
        shop_dict['products'] = products_list

    return shop_dict
   

# * Wymaganie autoryzacji [Admin] dla endpointów poniżej

# Dodanie nowego sklepu do bazy
@router.post("/shop", dependencies=[Depends(get_current_active_admin)])
def add_shop(form: ShopCreate, db: Session = Depends(get_db)):
    db_user = db.query(Shop).filter(Shop.name == form.name).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Shop with that name already exists")
    
    new_address = Address(
        street=form.street,
        city=form.city,
        postcode=form.postcode
    )

    # Add new address to database
    db.add(new_address)
    db.commit()
    db.refresh(new_address)

    new_shop = Shop(
        name=form.name,
        phone=form.phone,
        address_ID=new_address.address_ID
    )

    # Add new shop to database
    db.add(new_shop)
    db.commit()
    db.refresh(new_shop)

    return {
        "message": "Shop created successfully",
        "created_shop_id": new_shop.shop_ID
    }


# Aktualizacja danych sklepu
@router.put("/shop/{shop_id}", dependencies=[Depends(get_current_active_admin)])
def update_shop(shop_id: int, form: ShopUpdate, db: Session = Depends(get_db)):
    shop = db.query(Shop).filter(Shop.shop_ID == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")

    if form.name:
        shop.name = form.name
    if form.phone:
        shop.phone = form.phone
    
    address = db.query(Address).filter(Address.address_ID == shop.address_ID).first()
    if address:
        if form.street:
            address.street = form.street
        if form.city:
            address.city = form.city
        if form.postcode:
            address.postcode = form.postcode

    db.commit()
    db.refresh(shop)

    return {
        "message": "Shop updated successfully",
        "updated_shop_id": shop.shop_ID
    }

# Usunięcie sklepu z bazy
@router.delete("/shop/{shop_id}", dependencies=[Depends(get_current_active_admin)])
def delete_shop(shop_id: int, db: Session = Depends(get_db)):
    shop = db.query(Shop).filter(Shop.shop_ID == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    
    db.delete(shop)
    db.commit()

    return {
        "message": "Shop deleted successfully",
        "deleted_shop_id": shop_id
    }