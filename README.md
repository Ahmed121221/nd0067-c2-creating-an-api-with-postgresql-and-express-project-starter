# Store BackEnd Project

This Project is a nodejs, Postgres and express authenticated endpoinds tested with jasmine and supertest, encrypted with bcrypt for mangaing stores.

## Installation

Clone Repository.

```
git clone https://github.com/Ahmed121221/nd0067-c2-creating-an-api-with-postgresql-and-express-project-starter.git
```

Use [npm](https://www.npmjs.com) to install dependencies.

```bash
npm i
```

create .env file to store environment variables
as the following names and data types(after equal operator) :

```
// database name for developing.
DB_NAME =String
// database name for testing.
DB_TEST_NAME =String

// postgress username and password.
USERNAME =String
PASSWORD =String

// your host domain.
HOST =String
// defualt for postgres is 5432.
POSRT =Number

// this variable indicate which database the app will work with.
// it must be test or dev.
NODE_ENV =String

// for hashing data
SALT_ROUNDS =Number
BCRYPT_PASSWORD =String

// for JWT prefer Long String.
TOKEN_KEY =String
```
## Ports:
	database : 5432
	project(server): 3000
	
## Description:

Store is a postgres,express/nodejs project tested with [jasmine](https://www.npmjs.com/package/jasmine)/[supertest](https://www.npmjs.com/package/supertest), protected with [jwt](https://www.npmjs.com/package/jsonwebtoken),[bcrypt](https://www.npmjs.com/package/bcrypt) and suported by eslint/prittier, it manage stores orders and products.


## API:

#To send Token:

```
1-add key token to rquest header.
2-assign key's value to your token(jwt).
```

#User EndPoints:

```
    # login
    "post: /user/login : req.body =  (email: string, password: string) => Token",

    #to create User :
    // require token.
	"post: /user : (email, password, firstName, lastName) => Token",

    # get all users:
    // require token.
	"get: /users : => [] users",

    # get user by email.
	"get: /users/:email => user"


```

#Product EndPoints:

```
    // require token
   "post: /products : (name, price, category_id ) => []product",

	"get: /products : => []product",
	"get: /products/:id => product",

```

#Order EndPoints:

```
    #create order with product.
    "post: /orders : (user_id,product_id,quantity) => product",

    # add product to an order
	"post: /orders/add : (order_id,product_id,quantity) => order_id ",

    # get orders for a user filterd by order state (complete or active)
    //require token
	"get: /orders/:user_id/:status :  => []order",
```

#Product Categories EndPoints:

```
  "post: /product/categories : (id:number, name:string)",
   "get: /product/categories/:id"
```

## scripts

fromat and organize TS project:

```
npm run clean-code
```

run nodemon in developing (.ts):

```
npm run start
```

build and test project:

```
npm run test
```

build from typescript to javascript:

```
npm run build
```

build and run migrations on ${NODE_ENV} database.

```
npm run migrate-build
```
