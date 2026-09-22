from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone

PRODUCTS: list[dict] = [
    {
        "id": 1,
        "name": "Wireless Mouse",
        "sku": "WM-001",
        "price": 29.99,
        "stock": 120,
        "category": "Accessories",
        "customer_can_buy": True,
        "image": "🖱️",
    },
    {
        "id": 2,
        "name": "Mechanical Keyboard",
        "sku": "MK-014",
        "price": 89.5,
        "stock": 45,
        "category": "Accessories",
        "customer_can_buy": True,
        "image": "⌨️",
    },
    {
        "id": 3,
        "name": "USB-C Hub",
        "sku": "UH-203",
        "price": 49.0,
        "stock": 78,
        "category": "Accessories",
        "customer_can_buy": True,
        "image": "🔌",
    },
    {
        "id": 4,
        "name": '27" Monitor',
        "sku": "MN-727",
        "price": 329.99,
        "stock": 22,
        "category": "Displays",
        "customer_can_buy": True,
        "image": "🖥️",
    },
    {
        "id": 5,
        "name": "Noise-Cancel Headphones",
        "sku": "HP-880",
        "price": 199.0,
        "stock": 35,
        "category": "Audio",
        "customer_can_buy": True,
        "image": "🎧",
    },
    {
        "id": 6,
        "name": "Enterprise Server Rack",
        "sku": "SR-900",
        "price": 4999.0,
        "stock": 3,
        "category": "Enterprise",
        "customer_can_buy": False,
        "image": "🗄️",
    },
]

ORDERS: list[dict] = [
    {
        "id": 1040,
        "customer": "Alice Johnson",
        "total": 119.49,
        "status": "Delivered",
        "created_at": "2026-09-01T10:00:00Z",
        "items": [
            {"product_id": 1, "name": "Wireless Mouse", "quantity": 2, "line_total": 59.98},
            {"product_id": 3, "name": "USB-C Hub", "quantity": 1, "line_total": 49.0},
        ],
    },
    {
        "id": 1041,
        "customer": "Bob Smith",
        "total": 49.0,
        "status": "Processing",
        "created_at": "2026-09-10T14:30:00Z",
        "items": [
            {"product_id": 3, "name": "USB-C Hub", "quantity": 1, "line_total": 49.0},
        ],
    },
]

_next_order_id = 1042


def get_product(product_id: int) -> dict | None:
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product
    return None


def create_order(customer: str, line_items: list[dict]) -> dict:
    global _next_order_id

    order_id = _next_order_id
    _next_order_id += 1
    total = round(sum(item["line_total"] for item in line_items), 2)
    order = {
        "id": order_id,
        "customer": customer,
        "total": total,
        "status": "Pending",
        "created_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "items": line_items,
    }
    ORDERS.insert(0, order)
    return deepcopy(order)


def list_orders(customer: str | None = None) -> list[dict]:
    if customer:
        return [deepcopy(o) for o in ORDERS if o["customer"] == customer]
    return [deepcopy(o) for o in ORDERS]
