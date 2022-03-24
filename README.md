# Store BackEnd Project

This Project is a nodejs, Postgres and express authenticated endpoinds tested with jasmine and supertest, encrypted with bcrypt for mangaing stores.

## Description:

Store is a postgres, express/nodejs project tested with [jasmine](https://www.npmjs.com/package/jasmine)/[supertest](https://www.npmjs.com/package/supertest), protected with [jwt](https://www.npmjs.com/package/jsonwebtoken), [bcrypt](https://www.npmjs.com/package/bcrypt) and suported by eslint/prittier, it manage/stores orders and products.

## Installation

### Database:

    1- Install Postgres.
    2- Open sql shell(psql) and login as PostgreSQL superuser
    3- Create databse for Development.
    ```
    CREATE DATABASE store;
    ```
    4- Create database for testing.
     ```
    CREATE DATABASE store_test;
    ```
    5- Create user.
    ```
     create user store_user with encrypted password 'mypassword';
    ```
    6- Grant all database privileges to user in both databases.
    ```
    GRANT ALL PRIVILEGES ON DATABASE store TO store_user;
    GRANT ALL PRIVILEGES ON DATABASE store_test TO store_user;
    ```

### App:

1- Clone Repository.

```
git clone https://github.com/Ahmed121221/nd0067-c2-creating-an-api-with-postgresql-and-express-project-starter.git
```

2- Use [npm](https://www.npmjs.com) to install dependencies.

```
npm i
```

3- Create [.env](https://github.com/motdotla/dotenv) file to store environment variables
as the following names and data types(after equal operator):

```
// database name for developing.
// (ex:store).
DB_NAME =String

// database name for testing.
// (ex:store_test).
DB_TEST_NAME =string

// postgress user: username and password
// (USERNAME.ex: store_user)
// (PASSWORD.ex: mypassword)
USERNAME =String
PASSWORD =String

// your host domain
// (ex: localhost).
HOST =String

// database port
//(should be 5432).
PORT =Number


// this variable indicate wich database the app will work with.
// it should be (test) or (dev).
NODE_ENV =String


// for hashing data
SALT_ROUNDS =Number
BCRYPT_PASSWORD =String

// for JWT prefer Long String.
TOKEN_KEY =String
```

### Ports:

    1- DataBase = 5432
    2- App(server) = 3000

## Run:

### For Test run :

    ```
    npm run test
    ```

### For Development:

        1- Run:
            npm run migrate-build

            // this command will run migrations, create the schema then build the app.

        2- Run:
            npm run start-build

            // this command will start the server and
            // server will create status for orders to use it latter.

        3- Create Categories for products using this end point.
            ```
             "post: /product/categories : body = {id:number, name:string}"
            ```
        4- Create Product.
            ```
             "post: /product/categories : body = {id:number, name:string"
            ```
        5- Create order.
            ```
            "post: /orders : body =  {
                                user_id: number,
                                product_id: number,
                                quantity: number
                                }
            ```
        6- Explore APIs section for more functionality.

## DataBase Schema:

![store_schema](https://user-images.githubusercontent.com/24965900/159927525-d15fa251-0f5b-44d1-b18f-9643cc7cd06a.png)

## APIs:

### To send Token:

```
1-add key 'token' to rquest header.
2-assign key's value to your token(jwt).
```

### 1- Product Categories EndPoints:

```
  "post: /product/categories : body = {id:number, name:string} => {
                                                                    "category": {
                                                                        id: number,
                                                                        name:string
                                                                    }
                                                                }",

  "get: /product/categories/:id => {
                                        id: number ,
                                        name: string
                                    }"
```

### 2- User EndPoints:

```
    # login
    "post: /user/login : body =  {
                                    email: string,
                                    password: string
                                    } => Token",

    #to create User:
	"post: /user : body = {
                            email: string,
                            password: string,
                            firstname: string,
                            lastname: string
                            } => Token",

    # get all users:
    // require token.
	"get: /users : => [] users",

    # get user by email.
    // require token.
	"get: /users/:email => user"


```

### 3- Product EndPoints:

```
    // require token
   "post: /products : {
                        name: string,
                        price: number,
                        category_id: number
                        } => []product",

	"get: /products : => []product",
	"get: /products/:id => product",

```

### 4- Order EndPoints:

```
    #create order with product.
    // require token
    "post: /orders : body =  {
                                user_id: number,
                                product_id: number,
                                quantity: number
                                } => {"order_id": number}",

    # add product to an order
	"post: /orders/add : {
                            order_id: number,
                            product_id: number,
                            quantity: number
                            } => {
                                    id: number,
                                    product_id: number,
                                    order_id: number,
                                    quantity: number
                                                    }

    # get orders for a user filterd by order state (complete or active)
    //require token
	"get: /orders/:user_id/:status :  => []order",
```

## scripts:

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

build and run migrations on ${NODE_ENV} database.

```
npm run migrate-build
```

start builded server.

```
npm run start-build
```
