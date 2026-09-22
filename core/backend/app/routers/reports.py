from fastapi import APIRouter

from app.store import ORDERS, PRODUCTS

router = APIRouter(tags=["reports"])


@router.get("/reports")
def get_reports():
    total_revenue = round(sum(o["total"] for o in ORDERS), 2)
    avg_order = round(total_revenue / len(ORDERS), 2) if ORDERS else 0.0

    product_sales: dict[int, dict] = {}
    for order in ORDERS:
        for item in order.get("items", []):
            pid = item["product_id"]
            if pid not in product_sales:
                product_sales[pid] = {
                    "product_id": pid,
                    "name": item["name"],
                    "units_sold": 0,
                    "revenue": 0.0,
                }
            product_sales[pid]["units_sold"] += item["quantity"]
            product_sales[pid]["revenue"] = round(
                product_sales[pid]["revenue"] + item["line_total"], 2
            )

    top_products = sorted(
        product_sales.values(), key=lambda x: x["revenue"], reverse=True
    )

    low_stock = [
        {"id": p["id"], "name": p["name"], "stock": p["stock"]}
        for p in PRODUCTS
        if p["customer_can_buy"] and p["stock"] < 30
    ]

    return {
        "summary": {
            "total_revenue": total_revenue,
            "order_count": len(ORDERS),
            "average_order_value": avg_order,
            "catalog_size": len(PRODUCTS),
        },
        "top_products": top_products,
        "low_stock": low_stock,
        "orders_by_status": _orders_by_status(),
    }


def _orders_by_status() -> list[dict]:
    counts: dict[str, int] = {}
    for order in ORDERS:
        counts[order["status"]] = counts.get(order["status"], 0) + 1
    return [{"status": status, "count": count} for status, count in counts.items()]
