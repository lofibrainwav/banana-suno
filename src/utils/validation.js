/**
 * Utility functions for data validation
 */
class ValidationUtils {
    /**
     * Check if value is a valid string
     */
    static isValidString(value, minLength = 0, maxLength = Infinity) {
        return typeof value === 'string' && 
               value.length >= minLength && 
               value.length <= maxLength;
    }

    /**
     * Check if value is a valid number
     */
    static isValidNumber(value, min = -Infinity, max = Infinity) {
        return typeof value === 'number' && 
               !isNaN(value) && 
               value >= min && 
               value <= max;
    }

    /**
     * Check if value is a valid email
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return typeof email === 'string' && emailRegex.test(email);
    }

    /**
     * Check if value is a valid URL
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Sanitize string by removing HTML tags
     */
    static sanitizeHtml(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/<[^>]*>/g, '');
    }

    /**
     * Escape special characters for safe output
     */
    static escapeHtml(str) {
        if (typeof str !== 'string') return str;
        
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        };
        
        return str.replace(/[&<>"']/g, match => htmlEscapes[match]);
    }

    /**
     * Validate object schema
     */
    static validateSchema(obj, schema) {
        const errors = [];
        
        for (const [key, rules] of Object.entries(schema)) {
            const value = obj[key];
            
            // Check required fields
            if (rules.required && (value === undefined || value === null)) {
                errors.push(`Field '${key}' is required`);
                continue;
            }
            
            // Skip validation if field is not required and not present
            if (value === undefined || value === null) continue;
            
            // Type validation
            if (rules.type && typeof value !== rules.type) {
                errors.push(`Field '${key}' must be of type ${rules.type}`);
            }
            
            // String length validation
            if (rules.type === 'string') {
                if (rules.minLength && value.length < rules.minLength) {
                    errors.push(`Field '${key}' must be at least ${rules.minLength} characters`);
                }
                if (rules.maxLength && value.length > rules.maxLength) {
                    errors.push(`Field '${key}' must be no more than ${rules.maxLength} characters`);
                }
            }
            
            // Number range validation
            if (rules.type === 'number') {
                if (rules.min !== undefined && value < rules.min) {
                    errors.push(`Field '${key}' must be at least ${rules.min}`);
                }
                if (rules.max !== undefined && value > rules.max) {
                    errors.push(`Field '${key}' must be no more than ${rules.max}`);
                }
            }
            
            // Custom validation
            if (rules.validate && typeof rules.validate === 'function') {
                const customResult = rules.validate(value);
                if (customResult !== true) {
                    errors.push(customResult || `Field '${key}' failed custom validation`);
                }
            }
        }
        
        return errors;
    }
}

module.exports = ValidationUtils;