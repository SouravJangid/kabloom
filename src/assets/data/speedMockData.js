const speedMockData = {
    "speed": {
        "0": {
            "speed_id": 1,
            "name": "1 Hour Delivery",
            "description": "1 Hour Delivery",
            "retailers": [
                {
                    "id": "608",
                    "name": "Keystone Wine and Spirits",
                    "phone": "9179699180 ",
                    "address": "Malviya Nagar ,Jaipur,Rajasthan,302022",
                    "product_total": 151.46,
                    "delivery_fee": "0.00",
                    "pickup_date": "2020-07-31T21:22:47+05:30"
                }
            ],
            "ship_methods": [
                [
                    {
                        "id": "PP0001259825",
                        "fee": "0.00",
                        "duration": "1 Hour",
                        "dropoff_eta": "2020-08-01T02:22:47+05:30"
                    }
                ]
            ]
        },
        "2": {
            "speed_id": 3,
            "name": "Store Pickup",
            "description": "Pickup (Store)",
            "retailers": [
                {
                    "id": "608",
                    "name": "Keystone Wine and Spirits",
                    "desc": "Jaipur",
                    "address": "Malviya Nagar ,Jaipur,Rajasthan,302022",
                    "distance": "0miles",
                    "product_total": 151.46,
                    "delivery_fee": "0.00",
                    "ready_time": "05 AM",
                    "pickup_date": "2020-07-31T21:22:48+05:30"
                }
            ]
        }
    }
};
export {
    speedMockData,
};
