from sqlalchemy.orm import Session

from models.tables.courier import Courier
import random


# Wybranie kuriera do dostawy nowego zamowienia
def choose_courier(db: Session):
    # choose randomly
    available_couriers = db.query(Courier).all()
    if not available_couriers:
        return None
    #random.shuffle(available_couriers)
    return available_couriers[-1]