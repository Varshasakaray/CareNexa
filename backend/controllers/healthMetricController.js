import { HealthMetric } from "../models/healthMetricModel.js";

// Add a new health metric
export const addHealthMetric = async (req, res) => {
    try {
        const userId = req.userId;
        const { type, systolic, diastolic, value, unit, notes, recordedAt } = req.body;

        if (!type) {
            return res.status(400).json({
                success: false,
                message: "Metric type is required"
            });
        }

        let metricData = {
            userId,
            type,
            notes: notes || ""
        };

        if (type === "bloodPressure") {
            if (!systolic || !diastolic) {
                return res.status(400).json({
                    success: false,
                    message: "Systolic and diastolic values are required for blood pressure"
                });
            }
            metricData.systolic = systolic;
            metricData.diastolic = diastolic;
        } else if (type === "bloodSugar" || type === "weight") {
            if (!value) {
                return res.status(400).json({
                    success: false,
                    message: "Value is required for this metric type"
                });
            }
            metricData.value = value;
            if (unit) {
                metricData.unit = unit;
            }
        }

        if (recordedAt) {
            metricData.recordedAt = new Date(recordedAt);
        }

        const newMetric = await HealthMetric.create(metricData);

        return res.status(201).json({
            success: true,
            message: "Health metric added successfully",
            data: newMetric
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all health metrics for a user (with optional filtering)
export const getHealthMetrics = async (req, res) => {
    try {
        const userId = req.userId;
        const { type, startDate, endDate } = req.query;

        let query = { userId };

        if (type) {
            query.type = type;
        }

        if (startDate || endDate) {
            query.recordedAt = {};
            if (startDate) {
                query.recordedAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.recordedAt.$lte = new Date(endDate);
            }
        }

        const metrics = await HealthMetric.find(query)
            .sort({ recordedAt: -1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            data: metrics,
            count: metrics.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single health metric by ID
export const getHealthMetricById = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const metric = await HealthMetric.findOne({ _id: id, userId });

        if (!metric) {
            return res.status(404).json({
                success: false,
                message: "Health metric not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: metric
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a health metric
export const updateHealthMetric = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const updateData = req.body;

        const metric = await HealthMetric.findOne({ _id: id, userId });

        if (!metric) {
            return res.status(404).json({
                success: false,
                message: "Health metric not found"
            });
        }

        // Update fields
        if (updateData.systolic !== undefined) metric.systolic = updateData.systolic;
        if (updateData.diastolic !== undefined) metric.diastolic = updateData.diastolic;
        if (updateData.value !== undefined) metric.value = updateData.value;
        if (updateData.unit !== undefined) metric.unit = updateData.unit;
        if (updateData.notes !== undefined) metric.notes = updateData.notes;
        if (updateData.recordedAt !== undefined) metric.recordedAt = new Date(updateData.recordedAt);

        await metric.save();

        return res.status(200).json({
            success: true,
            message: "Health metric updated successfully",
            data: metric
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a health metric
export const deleteHealthMetric = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const metric = await HealthMetric.findOneAndDelete({ _id: id, userId });

        if (!metric) {
            return res.status(404).json({
                success: false,
                message: "Health metric not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Health metric deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
