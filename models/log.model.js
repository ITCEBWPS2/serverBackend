import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["info", "warn", "error", "debug", "critical"],
            index: true,
        },
        event: {
            type: String,
            required: true,
            index: true,
        },
        user: {
            type: String,
            default: null,
            index: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
        message: {
            type: String,
            required: true,
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: false,
    },
);

logSchema.index({ type: 1, event: 1 });
logSchema.index({ timestamp: -1 });
logSchema.index({ user: 1, timestamp: -1 });

const Log = mongoose.model("Log", logSchema);
export default Log;
