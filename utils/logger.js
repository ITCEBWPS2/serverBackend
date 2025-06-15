import Log from "../models/log.model.js";

export default class Logger {
    static async log(type, event, message, user = null, data = {}) {
        try {
            const logEntry = new Log({
                type,
                event,
                user,
                message,
                data,
            });

            await logEntry.save();
            return logEntry;
        } catch (error) {
            console.error("Failed to save log:", error);
            throw error;
        }
    }

    // Convenience methods for different log types
    static async info(event, message, user = null, data = {}) {
        return this.log("info", event, message, user, data);
    }

    static async warn(event, message, user = null, data = {}) {
        return this.log("warn", event, message, user, data);
    }

    static async error(event, message, user = null, data = {}) {
        return this.log("error", event, message, user, data);
    }

    static async debug(event, message, user = null, data = {}) {
        return this.log("debug", event, message, user, data);
    }

    static async critical(event, message, user = null, data = {}) {
        return this.log("critical", event, message, user, data);
    }

    // Search logs with pagination
    static async searchLogs(filters = {}, page = 1, limit = 20) {
        try {
            const query = {};

            // Build query based on filters
            if (filters.type) {
                query.type = filters.type;
            }

            if (filters.event) {
                query.event = new RegExp(filters.event, "i"); // Case-insensitive search
            }

            if (filters.user) {
                query.user = filters.user;
            }

            // Date range filtering
            if (filters.from || filters.to) {
                query.timestamp = {};
                if (filters.from) {
                    query.timestamp.$gte = new Date(filters.from);
                }
                if (filters.to) {
                    query.timestamp.$lte = new Date(filters.to);
                }
            }

            // Calculate pagination
            const skip = (page - 1) * limit;

            // Get total count for pagination info
            const totalItems = await Log.countDocuments(query);
            const totalPages = Math.ceil(totalItems / limit);

            // Fetch logs with pagination
            const logs = await Log.find(query)
                .populate("user", "name email") // Populate user info if needed
                .sort({ timestamp: -1 }) // Sort by newest first
                .skip(skip)
                .limit(limit);

            return {
                data: logs,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            };
        } catch (error) {
            console.error("Failed to search logs:", error);
            throw error;
        }
    }
}
