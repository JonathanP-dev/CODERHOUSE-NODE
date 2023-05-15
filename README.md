# POSTMAN FACILITIES

## PRODUCTS
get products 

url: http://localhost:8080/api/products/

#
get product by id

url: http://localhost:8080/api/products/1684166435304-9

#
post product

url: http://localhost:8080/api/products/

body:
{
  "code": 10009,
  "title": "prod10",
  "desc": "te ingles",
  "price": 900,
  "category": "Bebida",
  "stock": 15
}

#
put product

url: http://localhost:8080/api/products/1684166435300-5

body:
{
  "code": 11440,
  "title": "prod4",
  "desc": "te ingles",
  "price": 900,
  "category": "Bebida",
  "stock": 15
}
#

delete product

url: http://localhost:8080/api/products/1684166435300-5

## CARTS
get carts

url: http://localhost:8080/api/carts/

#
get carts con limit
#
url: http://localhost:8080/api/carts?limit=1

#
get cart products by id

url: http://localhost:8080/api/carts/1684172023667-1

#
post cart

url: http://localhost:8080/api/carts/

body:
[
    {
        "id": "1684166435303-8",
        "quantity": 10
    }
]
#

post product to cart by id

url: http://localhost:8080/api/carts/1684171837914-0/product/1684166435300-5
