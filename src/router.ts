import { Express, RequestHandler } from "express";

interface IRoutes {
    route: string;
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "ALL";
    function: RequestHandler;
    middleware?: RequestHandler;
}


const routes: IRoutes[] = []

export function ROUTER(method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "ALL", route: string, middleware?: RequestHandler) {
    return function (target: any, propertyKeys: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            method,
            route,
            middleware
        });
    }
}

export function setupRoutes(app: Express) {
    routes.forEach(r => {
        switch (r.method) {
            case "GET":
                if (r.middleware) app.get(r.route, r.middleware, r.function);
                else app.get(r.route, r.function);
                break;
            case "POST":
                if (r.middleware) app.post(r.route, r.middleware, r.function);
                else app.post(r.route, r.function);
                break;
            case "PUT":
                if (r.middleware) app.put(r.route, r.middleware, r.function);
                else app.put(r.route, r.function);
                break;
            case "PATCH":
                if (r.middleware) app.patch(r.route, r.middleware, r.function);
                else app.patch(r.route, r.function);
                break;
            case "DELETE":
                if (r.middleware) app.delete(r.route, r.middleware, r.function);
                else app.delete(r.route, r.function);
                break;
            case "ALL":
                if (r.middleware) app.all(r.route, r.middleware, r.function);
                else app.all(r.route, r.function);
                break;
        }
    })
}