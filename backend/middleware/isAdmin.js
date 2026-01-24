import { User } from '../models/userModel.js';

// Admin email whitelist
const ADMIN_EMAILS = [
    'shashirekhasakaray@gmail.com',
    'sakaray.20233241@mnnit.ac.in'
];

export const isAdmin = async (req, res, next) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user email is in admin whitelist
        if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        req.adminUser = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
