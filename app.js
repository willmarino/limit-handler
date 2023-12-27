const cors = require("cors");
const express = require("express");
const context = require("express-context-store");

const REDIS_WRAPPER = require("./src/util/redis_connection_wrapper");
const serverHealthRouter = require("./src/routers/server_health");
const organizationsRouter = require("./src/routers/organizations");
const subTiersRouter = require("./src/routers/subscription_tiers");
const subscriptionsRouter = require("./src/routers/subscriptions");
const usersRouter = require("./src/routers/users");
const membershipsRouter = require("./src/routers/memberships");
const sessionsRouter = require("./src/routers/sessions");

const { logger } = require("./src/util/logger");
const { morganLog } = require("./src/helpers/logging");
const customMiddleware = require("./src/helpers/middleware");
require("./src/helpers/array_extensions");

const app = express();

// 3rd party middleware
app.set('etag', false);
app.use(cors());
app.use(express.json({ limit: Infinity }));
app.use(express.urlencoded({ extended: false }));
app.use(context());
if (process.env.NODE_ENV !== "test") app.use(morganLog);

// Custom middelware - add in request logger and unique tag
app.use(customMiddleware.addRequestContext);


// Declare subrouters
app.use("/organizations", organizationsRouter);
app.use("/subscription_tiers", subTiersRouter);
app.use("/subscriptions", subscriptionsRouter);
app.use("/users", usersRouter);
app.use("/memberships", membershipsRouter);
app.use("/sessions", sessionsRouter);
app.use("/server_health", serverHealthRouter);


// Custom middelware - catch-all error handler
app.use(customMiddleware.errorHandler);

// Initiate express server
let server;
if (process.env.NODE_ENV !== "test") {
    server = app.listen(
        process.env.EXPRESS_PORT,
        async () => {
            await REDIS_WRAPPER.setClient();
            logger.info("Express server initiated on port " + process.env.EXPRESS_PORT + "...");
        }
    );
}

module.exports = {
    app,
    server
}