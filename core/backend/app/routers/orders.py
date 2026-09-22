from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.store import create_order, get_product, list_orders

router = APIRouter(tags=["orders"])


class OrderLineIn(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, le=99)


class CreateOrderIn(BaseModel):
    customer: str = Field(min_length=1, max_length=80)
    items: list[OrderLineIn] = Field(min_length=1)


@router.get("/orders")
def get_orders(customer: str | None = Query(None)):
    items = list_orders(customer)
    return {"items": items, "total": len(items)}


@router.post("/orders")
def place_order(body: CreateOrderIn):
    line_items: list[dict] = []

    for line in body.items:
        product = get_product(line.product_id)
        if product is None:
            raise HTTPException(status_code=404, detail=f"Product {line.product_id} not found")
        if not product["customer_can_buy"]:
            raise HTTPException(
                status_code=400,
                detail=f"{product['name']} is not available for customer purchase",
            )
        if product["stock"] < line.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product['name']}")

        line_total = round(product["price"] * line.quantity, 2)
        line_items.append(
            {
                "product_id": product["id"],
                "name": product["name"],
                "quantity": line.quantity,
                "line_total": line_total,
            }
        )
        product["stock"] -= line.quantity

    order = create_order(body.customer, line_items)
    return order
