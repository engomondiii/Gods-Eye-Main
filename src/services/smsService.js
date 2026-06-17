// ========================================
// SMARTSCHOOL MVP - SMS SERVICE
// Africa's Talking SMS Gateway Integration
// ========================================

import axios from 'axios';
import { SIMULATE_SMS_ONLY } from '../utils/apiConfig';

// ============================================================
// SMS CONFIGURATION
// ============================================================

// Get credentials from environment or use placeholders
const SMS_CONFIG = {
  username: process.env.AFRICAS_TALKING_USERNAME || 'YOUR_AT_USERNAME',
  api_key: process.env.AFRICAS_TALKING_API_KEY || 'YOUR_AT_API_KEY',
  sender_id: 'SMARTSCHOOL',
  base_url: 'https://api.africastalking.com/version1/messaging',
};

// SMS Gateway URLs
export const SMS_GATEWAYS = {
  AFRICAS_TALKING: 'africas_talking',
  MOCK: 'mock',
};

// ============================================================
// SMS MESSAGE TEMPLATES
// ============================================================

/**
 * Generate SMS message for attendance notification
 */
export const generateAttendanceSMS = (studentName, status, timeString = null) => {
  const currentTime = timeString || new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  if (status === 'PRESENT') {
    return `SMARTSCHOOL EdTech Alert:\n\n${studentName} arrived at school today at ${currentTime}.\n\nHave a great day.`;
  } else if (status === 'ABSENT') {
    const absentTime = new Date().getHours() + ':00';
    return `SMARTSCHOOL EdTech Alert:\n\n${studentName} has not been marked present at school as of ${absentTime}.\n\nPlease contact the school if necessary.`;
  }

  return `SMARTSCHOOL EdTech Alert:\n\n${studentName} attendance status: ${status}`;
};

// ============================================================
// SEND SMS - MOCK MODE (Development/Testing)
// ============================================================

const sendSMS_Mock = async (phone, message, studentId = null) => {
  try {
    const smsRecord = {
      id: Math.floor(Math.random() * 1000000),
      recipient_phone: phone,
      message,
      student_id: studentId,
      gateway: SMS_GATEWAYS.MOCK,
      status: 'sent',
      sent_at: new Date().toISOString(),
      mock: true,
    };

    // Log to console for debugging
    if (__DEV__) {
      console.log('📱 SMS (MOCK - Not Actually Sent):', {
        to: phone,
        message: message.substring(0, 60) + '...',
        timestamp: smsRecord.sent_at,
      });
    }

    return {
      success: true,
      data: smsRecord,
      message: 'SMS simulated successfully (mock mode)',
    };
  } catch (error) {
    console.error('SMS mock error:', error);
    return {
      success: false,
      error: error.message || 'Failed to simulate SMS',
    };
  }
};

// ============================================================
// SEND SMS - REAL MODE (Production with Africa's Talking)
// ============================================================

const sendSMS_Real = async (phone, message, studentId = null) => {
  try {
    // Validate credentials
    if (!SMS_CONFIG.username || SMS_CONFIG.username === 'YOUR_AT_USERNAME') {
      throw new Error(
        'Africa\'s Talking SMS credentials not configured. ' +
        'Set AFRICAS_TALKING_USERNAME and AFRICAS_TALKING_API_KEY environment variables.'
      );
    }

    // Format phone number for Africa's Talking (should include country code)
    let formattedPhone = phone;
    if (!phone.startsWith('+')) {
      formattedPhone = '+' + phone;
    }

    if (__DEV__) {
      console.log('📤 Sending SMS via Africa\'s Talking:', {
        to: formattedPhone,
        from: SMS_CONFIG.sender_id,
      });
    }

    // Send SMS via Africa's Talking API
    const response = await axios.post(
      SMS_CONFIG.base_url,
      new URLSearchParams({
        username: SMS_CONFIG.username,
        to: formattedPhone,
        message: message,
        from: SMS_CONFIG.sender_id,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'apiKey': SMS_CONFIG.api_key,
        },
        timeout: 10000, // 10 second timeout
      }
    );

    if (__DEV__) {
      console.log('✅ SMS sent successfully:', response.data);
    }

    // Check response for success
    if (response.data?.SMSMessageData?.Recipients?.length > 0) {
      const recipient = response.data.SMSMessageData.Recipients[0];
      
      return {
        success: true,
        data: {
          id: recipient.messageId,
          recipient_phone: formattedPhone,
          message,
          student_id: studentId,
          gateway: SMS_GATEWAYS.AFRICAS_TALKING,
          status: 'sent',
          sent_at: new Date().toISOString(),
          provider_response: recipient,
        },
        message: 'SMS sent successfully',
      };
    } else {
      throw new Error('No recipients in SMS response');
    }
  } catch (error) {
    console.error('❌ SMS send error:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to send SMS',
      details: error.response?.data,
    };
  }
};

// ============================================================
// PUBLIC SEND SMS FUNCTION
// ============================================================

/**
 * Send SMS to guardian about student attendance
 * @param {string} phoneNumber - Guardian phone number (with country code)
 * @param {string} studentName - Student's name
 * @param {string} attendanceStatus - 'PRESENT' or 'ABSENT'
 * @param {number} studentId - Student ID (optional, for logging)
 * @returns {Promise<Object>} SMS send response
 */
export const sendAttendanceSMS = async (phoneNumber, studentName, attendanceStatus, studentId = null) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Generate message
    const message = generateAttendanceSMS(studentName, attendanceStatus);

    // Choose gateway based on configuration
    if (SIMULATE_SMS_ONLY) {
      return await sendSMS_Mock(phoneNumber, message, studentId);
    } else {
      return await sendSMS_Real(phoneNumber, message, studentId);
    }
  } catch (error) {
    console.error('Send attendance SMS error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send custom SMS
 * @param {string} phoneNumber - Guardian phone number
 * @param {string} message - SMS message text
 * @param {number} studentId - Student ID (optional)
 * @returns {Promise<Object>} SMS send response
 */
export const sendCustomSMS = async (phoneNumber, message, studentId = null) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }
    if (!message) {
      throw new Error('Message text is required');
    }

    if (SIMULATE_SMS_ONLY) {
      return await sendSMS_Mock(phoneNumber, message, studentId);
    } else {
      return await sendSMS_Real(phoneNumber, message, studentId);
    }
  } catch (error) {
    console.error('Send custom SMS error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Bulk send SMS to multiple guardians
 * @param {Array} recipients - Array of {phone, studentName, status, studentId}
 * @returns {Promise<Object>} Results of bulk SMS send
 */
export const sendBulkSMS = async (recipients) => {
  try {
    if (!Array.isArray(recipients) || recipients.length === 0) {
      throw new Error('Recipients array is required and must not be empty');
    }

    if (__DEV__) {
      console.log(`📱 Sending SMS to ${recipients.length} recipients...`);
    }

    const results = await Promise.all(
      recipients.map(recipient =>
        sendAttendanceSMS(
          recipient.phone,
          recipient.studentName,
          recipient.status,
          recipient.studentId
        )
      )
    );

    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    if (__DEV__) {
      console.log(`✅ SMS Results: ${successful} sent, ${failed} failed`);
    }

    return {
      success: failed === 0,
      results,
      summary: {
        total: results.length,
        successful,
        failed,
      },
    };
  } catch (error) {
    console.error('Bulk SMS error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone) => {
  // Must start with + and contain at least 10 digits
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Format phone number to include country code if missing
 */
export const formatPhoneNumber = (phone, defaultCountryCode = '+254') => {
  if (!phone) return null;

  let cleaned = phone.replace(/\D/g, '');
  
  // Remove leading 0 if country code is Kenya
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Add country code if missing
  if (!cleaned.startsWith(defaultCountryCode.replace('+', ''))) {
    cleaned = defaultCountryCode.replace('+', '') + cleaned;
  }

  return '+' + cleaned;
};

/**
 * Get SMS gateway status
 */
export const getSMSStatus = () => {
  return {
    gateway: SIMULATE_SMS_ONLY ? SMS_GATEWAYS.MOCK : SMS_GATEWAYS.AFRICAS_TALKING,
    mode: SIMULATE_SMS_ONLY ? 'SIMULATION' : 'PRODUCTION',
    configured: !SIMULATE_SMS_ONLY && SMS_CONFIG.username !== 'YOUR_AT_USERNAME',
    message: SIMULATE_SMS_ONLY 
      ? 'SMS messages are being simulated (development mode)'
      : 'SMS messages are being sent via Africa\'s Talking',
  };
};

// ============================================================
// LEGACY EXPORTS (Backward Compatibility)
// ============================================================

export const sendSMS = async (phone, message) => {
  return sendCustomSMS(phone, message);
};

export default {
  sendSMS,
  sendAttendanceSMS,
  sendCustomSMS,
  sendBulkSMS,
  isValidPhoneNumber,
  formatPhoneNumber,
  getSMSStatus,
  SMS_GATEWAYS,
};