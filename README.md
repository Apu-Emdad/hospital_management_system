# NestJS

## Installations

```bash
yarn global add @nestjs/cli
nest new hospital-management
yarn add -D prisma
yarn add @prisma/client # run after installation - npx prisma init
yarn add @nestjs/config
yarn add bcrypt
yarn add -D @types/bcrypt
yarn add @nestjs/passport passport passport-jwt @nestjs/jwt
yarn add @types/passport-jwt -D

```

## Create NEST project

```
nest new LearningNestWithPostgreSQL
```

choose `yarn`

Delete `app.service` and `app.controller`

Fix the imports in `app.module.ts`

## What is a Module ?

A **module** in NestJS is a way to group related code (like controllers and services) together.

It helps organize the app into small, manageable parts.

Every Nest app starts with a main module called `AppModule`.

You **must import a module** if you want access to its **exported services**.

**_ Example _**:

```javascript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

- A module is a class

## What is a Decorator ?

In **NestJS**, a **decorator** is a special kind of _declaration_ that can attach metadata to classes, methods, properties, or parameters. NestJS uses decorators heavily to define and configure components like controllers, services, routes, middleware, and more.

**_ Example _**:

```tsx
@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return 'This returns all cats';
  }
}
```

Here:

- `@Controller('cats')` tells Nest this class handles `/cats` routes.
- `@Get()` tells Nest this method handles GET requests.

## What is Controller

A **controller** handles incoming requests and sends responses.
It maps routes like GET, POST, etc.

**_ Example _**:

```tsx
@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return 'All cats';
  }
}
```

## What is Provider

A **provider** is a class that contains logic or data access (like a service).
It can be injected into other classes.

**_ Example _**:

```tsx
@Injectable()
export class CatsService {
  getCats() {
    return ['Cat1', 'Cat2'];
  }
}
```

in **NestJS**, a service **must be registered** in some module’s `providers` array to make it injectable.

## Create Module CLI Command

To create a module using NestJS CLI, run:

```tsx
nest generate module <module-name>
```

**Shortcut:**

```tsx
nest g mo <module-name>
```

**Example:**

```tsx
nest g mo cats
```

This will create `cats.module.ts`.

## Create Controller CLI Command

To create a controller using NestJS CLI, run:

```
nest generate controller <controller-name>
```

**Shortcut:**

```
nest g co <controller-name>
```

**Example:**

```
nest g co cats
```

This will create `cats.controller.ts`.

## Create Provider CLI Command

To create a service using NestJS CLI, run:

```
nest generate service <service-name>
```

**Shortcut:**

```
nest g s <service-name>
```

**Example:**

```
nest g s cats
```

This will create `cats.service.ts`.

# Prisma

**Prisma** is an **ORM** (Object-Relational Mapping) tool.
It helps you work with databases using **TypeScript/JavaScript code** instead of writing raw SQL.

**Key Features:**

- Type-safe database queries
- Auto-generated types from your database
- Easy schema definition and migrations

You define your data model in a file called `schema.prisma`.
Then Prisma generates code to query the database.

## Prisma Install Command

With **yarn**:

```
yarn add -D prisma
yarn add @prisma/client
```

## Prisma commands

### **Initialize Prisma:**

```
npx prisma init
```

This creates a `prisma` folder with `schema.prisma`.

### **Set your database URL** in `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### **Run Migrations (create tables):**

```
npx prisma migrate dev --name init
```

- **Creates and applies** a database migration.
- Reads your model definitions in `schema.prisma`
- Generates a migration file (SQL) under `prisma/migrations`
- Updates the actual database schema (creates tables)
- Also runs `prisma generate` at the end

`--name init` gives the migration a label, like a version tag.

### **Generate Prisma Client:**

```
npx prisma generate
```

- Generates code in `node_modules/@prisma/client`
- Creates TypeScript/JS functions to:
  - Run queries: `findMany`, `create`, `update`, `delete`, etc.
  - Use relations (`include`, `select`)
  - Get full IntelliSense and type safety in your editor

### **Use Prisma Studio**

```
npx prisma studio
```

## Prisma Error Codes

| Error Code  | Meaning                                                                 | Example & Handling                                                   |
| ----------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| P2002       | Unique constraint failed                                                | Catch when duplicate fields (e.g. email)                             |
| P2003       | Foreign key constraint failed                                           | Attempt to link to a non-existing record                             |
| P2000–P2019 | Various validation/query errors (e.g. wrong input types, missing value) | Example: P2000 for too-long string, P2012 for missing required value |
| P2025       | Record required by relation not found                                   | Attempt to update or delete a non-existent record                    |
| P1013–P1017 | Schema/config errors (e.g. invalid connection string, missing models)   | Errors related to schema mismatch or configuration                   |
| P6004       | Query timeout                                                           | Query took too long or hit connection pool issues                    |
| P6008       | Connection or engine start error                                        | Unable to reach or start the Prisma engine                           |
| P6009       | Response size limit exceeded                                            | Query response exceeded Prisma’s \~5MB limit                         |
| P5011       | Too many requests                                                       | Exceeded allowed request threshold; Prisma throttled the requests    |

## Self Relation in Prisma Model

```typescript

model User {
  id            Int      @id @default(autoincrement())
  created_by    Int?
  createdBy     User?    @relation("UserCreatedBy", fields: [created_by], references: [id])
  createdUsers  User[]   @relation("UserCreatedBy")
  modified_by   Int?
  modifiedBy    User?    @relation("UserModifiedBy", fields: [modified_by], references: [id])
  modifiedUsers User[]   @relation("UserModifiedBy")

  @@map("users")
}

```

```
created_by Int?
```

- This is a **foreign key field**.
- It stores the `id` of the user who created this user.
- It's optional (`Int?`) — meaning a user might not have been created by another user (e.g., first admin).

```txt
createdBy User? @relation("UserCreatedBy", fields: [created_by], references: [id])
```

---

- This is the **relation field** that tells Prisma:
  - “`created_by` refers to a `User` record (their `id`).”
- It allows you to do:

```txt
const user = await prisma.user.findUnique({ include: { createdBy: true } });
```

And access `user.createdBy.name`, etc.

---

```txt
createdUsers User[] @relation("UserCreatedBy")
```

- This is the **inverse relation**.
- It lets a user fetch all the users they’ve created.
- You can do:

```txt
const admin = await prisma.user.findUnique({ include: { createdUsers: true } });
```

**Why All 3 Are Needed**

| Field        | Purpose                                              |
| ------------ | ---------------------------------------------------- |
| created_by   | Stores the FK (just a number)                        |
| createdBy    | Gives Prisma access to the creator user              |
| createdUsers | Gives Prisma access to the users this person created |

All three work together to:

- Create a full one-to-many self-relation
- Allow queries in **both directions**:
  - "Who created this user?"
  - "Which users did I create?"

# @Global Module

The `@Global()` decorator makes a **module's providers available everywhere** in the app — **without needing to import the module** in every other module.

## Example Breakdown

📂 `src/prisma/prisma.module.ts`

```typescript
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

📂 `src/prisma/prisma.service.ts`

```typescript
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
```

**Example Usage**

`src\auth\auth.module.ts`

```tsx
@Module({
  imports: [JwtModule.register({})], // you don't have to import PrismaModule here
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
```

`src\prisma\prisma.service.ts`

```tsx
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client'; // you can directly import the service here

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
```

# Pipe

A **pipe** is a class that **transforms** or **validates** incoming data **before** it reaches your controller.

## What it does:

- Changes the input value (transform)
- Checks if the input is valid (validate)

## Simple Example:

```tsx
@Get(':id')
getById(@Param('id', ParseIntPipe) id: number) {
  return `ID is ${id}`;
}

```

Here:

- `id` comes as a **string** (e.g., "5")
- `ParseIntPipe` converts it to a **number**
- If it’s not a number, it throws an error

## Key Points:

- Pipes run **before** the controller method
- You can use **built-in** pipes like `ParseIntPipe`, `ValidationPipe`
- You can also create **custom pipes**

## Built-in Pipes in NestJS

| Pipe Name        | Usage                                              | Purpose                                    | Example Use Case                              |
| ---------------- | -------------------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| ParseIntPipe     | `@Param('id', ParseIntPipe)`                       | Converts input string to an integer        | `'5'` → `5` in route params                   |
| ParseBoolPipe    | `@Query('flag', ParseBoolPipe)`                    | Converts `'true'` or `'false'` to boolean  | `'false'` → `false` in query                  |
| ParseFloatPipe   | `@Query('amount', ParseFloatPipe)`                 | Converts input string to a float           | `'12.5'` → `12.5`                             |
| ParseEnumPipe    | `@Body('role', new ParseEnumPipe(Role))`           | Validates input value is a valid enum      | Checks if `role` is `'ADMIN'`, `'USER'`, etc. |
| DefaultValuePipe | `@Query('page', new DefaultValuePipe(1))`          | Provides default value if input is missing | If `page` not given, uses `1`                 |
| ValidationPipe   | `@Body() ValidationPipe` (used globally or inline) | Validates input using DTO + decorators     | Ensures required fields, types, patterns      |

# Class Validator

In **NestJS**, `class-validator` is a library used for **validating object properties using decorators**. It helps you enforce rules (like required fields, string length, email format, etc.) on DTO (Data Transfer Object) classes.

NestJS integrates it with `@nestjs/class-validator` and `@nestjs/common` using the `ValidationPipe`.

## Basic Usage

**Install dependencies**:

```tsx
npm install class-validator class-transformer
```

**Enable global validation pipe** in `main.ts`:

```tsx
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

Note: `new ValidationPipe({ whitelist: true, })` automatically strips any properties not defined in the DTO from incoming requests, ensuring only validated and expected data is processed.

**Create a DTO** with validation rules:

```tsx
import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 20)
  name: string;

  @IsEmail()
  email: string;
}
```

**Use the DTO in a controller**:

```tsx
@Post('create')
createUser(@Body() createUserDto: CreateUserDto) {
  // If validation fails, Nest will throw a 400 error automatically
  return this.userService.create(createUserDto);
}
```

## **Example Validations (Decorators):**

| Decorator     | Description                 | Example                         |
| ------------- | --------------------------- | ------------------------------- |
| @IsString()   | Checks if value is a string | @IsString() name: string;       |
| @IsEmail()    | Validates email format      | @IsEmail() email: string;       |
| @IsInt()      | Checks for integer value    | @IsInt() age: number;           |
| @MinLength(n) | Minimum string length       | @MinLength(5) password: string; |
| @Max(n)       | Max numeric value           | @Max(100) score: number;        |
| @IsOptional() | Field is optional           | @IsOptional() age?: number;     |

# Global Exception Handler

`src\errors\exceptionHandler.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalErrorHandler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = `Duplicate value for unique field: ${exception.meta?.target?.[0]}`;
      }
      // Handle more Prisma error codes if needed
    }

    console.log('exception.message', exception.message);

    response.status(status).json({
      status: 'failed',
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      details:
        process.env.NODE_ENV === 'DEVELOPMENT'
          ? { message: exception.message, exception: exception }
          : undefined,
    });
  }
}
```

`main.ts`

```typescript
//global error handler
app.useGlobalFilters(new GlobalErrorHandler());
```

# Setting Up middleware

`src\user\middlewares\hashPassword.ts`

```typescript
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
    );

    req.body.password = hashedPassword;

    next();
  }
}
```

**_ Apply the middleware _**
`src\user\user.module.ts`

```typescript
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HashPasswordMiddleware } from './middlewares/hashPassword';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HashPasswordMiddleware)
      .forRoutes({ path: 'users/create-admin', method: RequestMethod.POST });
  }
}
```

# Setting up JWT AuthGuard in NestJS with Passport

Here’s how to implement a JWT-based `AuthGuard` in NestJS using Passport, excluding the password in the JWT payload and validating based on the user’s role.

## Setup Dependencies

Install the required packages if not already installed:

```
yarn add @nestjs/passport passport passport-jwt @nestjs/jwt
```

## JWT Strategy

<u>Create the `auth/strategy/jwt.strategy.ts` file:</u>
what it basically does is - it runs `jwt.veryfy` under the hood. And after decrypting the token it sets the decrypted data in `req.user`

```tsx
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    id: number;
    username: string;
    email: string;
    role: 'Admin' | 'User';
  }) {
    // password is NOT included in payload
    return payload; // injected as req.user
  }
}
```

## JWT Module Registration

Inside `auth.module.ts`:

```tsx
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
```

## Sign Token Without Password

In `auth.service.ts`:

```tsx
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async generateToken(user: {
    id: number;
    username: string;
    email: string;
    role: 'Admin' | 'User';
    password?: string;
  }) {
    const { id, username, email, role } = user;
    const payload = { id, username, email, role };
    return this.jwt.sign(payload);
  }
}

// use this.generateToken in signUp and signIn methods
```

## AuthGuard

To protect routes, use Nest’s built-in `AuthGuard` with the `'jwt'` strategy:

```tsx
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Usage in controller:

```tsx
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
```

# Role-Based JWT AuthGuard in NestJS (Step-by-Step Guide)

This guide assumes:

- You already have a basic JWT auth setup
- You want **Admins** to access `/users` (get all)
- You want **Users** to access `/users/profile` (update self)

## `/src/common/enums/role.enum.ts`

```tsx
export enum Role {
  Admin = 'Admin',
  User = 'User',
}
```

> This defines your valid roles.

## `/src/common/decorators/roles.decorator.ts`

```tsx
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

// Apply like @Roles(Role.Admin)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

> Custom decorator to attach roles metadata to route handlers.

## `/src/common/guards/roles.guard.ts`

```tsx
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles required → allow access
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: insufficient role');
    }

    return true;
  }
}
```

> Checks if the logged-in user has a role matching the route.

## `/src/auth/jwt.strategy.ts`

Assumes you're already returning user data (without password):

```tsx
async validate(payload: {
  id: number;
  username: string;
  email: string;
  role: 'Admin' | 'User';
}) {
  return payload; // Available as req.user
}

```

> This makes the user role available to the RolesGuard.

## `/src/auth/jwt-auth.guard.ts`

```tsx
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

> Basic JWT guard for protecting routes.

## `/src/users/users.controller.ts`

```tsx
import { Controller, Get, Patch, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  @Roles(Role.Admin)
  @Get()
  getAllUsers() {
    // Only Admins can access
    return {
      msg: 'Admin-only: all users returned',
    };
  }

  @Roles(Role.User)
  @Patch('profile')
  updateOwnProfile(@Request() req) {
    // Only the logged-in User can access
    const user = req.user;
    return {
      msg: `Profile updated for ${user.username}`,
    };
  }
}
```

> Route-level control using both `JwtAuthGuard` and `RolesGuard`.

# Task

Create a nest project. create module, controller, service manuall. set them up. return text output

# Install

- nest js
- nest cli
- argon
- class validator
- @nest/passport
- @nest/jwt
- @types/passport-jwt
