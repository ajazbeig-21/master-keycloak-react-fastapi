from fastapi import APIRouter

from app.store import ORDERS, PRODUCTS

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard")
def get_dashboard():
    revenue = sum(o["total"] for o in ORDERS)
    pending = sum(1 for o in ORDERS if o["status"] == "Pending")
    shop_products = [p for p in PRODUCTS if p["customer_can_buy"]]

    sales_by_month = [
        {"month": "May", "revenue": 4200, "orders": 38},
        {"month": "Jun", "revenue": 5100, "orders": 44},
        {"month": "Jul", "revenue": 4800, "orders": 41},
        {"month": "Aug", "revenue": 6200, "orders": 52},
        {"month": "Sep", "revenue": round(revenue + 2400, 2), "orders": len(ORDERS) + 28},
    ]

    revenue_by_category: dict[str, float] = {}
    for product in PRODUCTS:
        revenue_by_category[product["category"]] = revenue_by_category.get(product["category"], 0.0)
    for order in ORDERS:
        for item in order.get("items", []):
            product = next((p for p in PRODUCTS if p["id"] == item["product_id"]), None)
            if product:
                cat = product["category"]
                revenue_by_category[cat] = revenue_by_category.get(cat, 0.0) + item["line_total"]

    category_chart = [
        {"category": cat, "revenue": round(val, 2)} for cat, val in revenue_by_category.items()
    ]

    return {
        "title": "Store overview",
        "metrics": {
            "revenue": round(revenue, 2),
            "orders": len(ORDERS),
            "products_in_shop": len(shop_products),
            "pending_orders": pending,
        },
        "sales_by_month": sales_by_month,
        "revenue_by_category": category_chart,
        "recent_orders": [
            {
                "id": o["id"],
                "customer": o["customer"],
                "total": o["total"],
                "status": o["status"],
            }
            for o in ORDERS[:5]
        ],
    }
