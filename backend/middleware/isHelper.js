import { Helper } from '../models/helperModel.js';

export const isHelper = async (req, res, next) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const helper = await Helper.findById(userId);
        
        if (!helper) {
            return res.status(404).json({
                success: false,
                message: 'Helper not found'
            });
        }

        if (!helper.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Helper account is not active'
            });
        }

        req.helper = helper;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
