from fastapi import APIRouter, Query

from app.store import PRODUCTS

router = APIRouter(tags=["products"])


@router.get("/products")
def list_products(shop_only: bool = Query(False, description="Only products customers may buy")):
    items = PRODUCTS
    if shop_only:
        items = [p for p in PRODUCTS if p["customer_can_buy"]]
    return {"items": items, "total": len(items)}
