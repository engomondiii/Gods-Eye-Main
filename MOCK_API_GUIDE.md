# 🧪 SMARTSCHOOL MVP - MOCK API SETUP GUIDE

## Overview

The mock API system allows you to:
- ✅ Test the app **without a backend** during development
- ✅ Work **offline** with realistic test data
- ✅ Simulate **2,000 learners** with 20 classes
- ✅ Test SMS notifications **without sending real SMS**
- ✅ Toggle between **mock and real API** in one setting

## Quick Start

### 1. Mock API is **ENABLED BY DEFAULT** in development

```javascript
// src/utils/apiConfig.js
export const USE_MOCK_API = __DEV__; // true in development, false in production
```

### 2. On app startup, mock data is automatically loaded:

```
📋 Initializing mock database for 2,000 learners...
✅ Mock database loaded: 20 classes, 2,000 students
🔧 API Configuration:
   - Using 📦 MOCK API
   - SMS: 📝 Simulated (logged)
   - Mock API Delay: 300ms
```

### 3. No code changes needed - just use the app!

The API interceptor in `src/services/api.js` automatically routes calls to the mock API.

---

## Architecture

### Files Created

```
src/
├── services/
│   ├── mockData.js          # Mock data generator (2,000 learners)
│   ├── mockApi.js           # Mock API endpoints
│   └── api.js               # (UPDATED) API client with mock interceptor
└── utils/
    └── apiConfig.js         # Configuration (toggle mock/real)
```

### How It Works

```
User Action
    ↓
API Call (axios)
    ↓
Request Interceptor (api.js)
    ↓
Check: USE_MOCK_API?
    ├─ YES → Route to Mock API (mockApi.js)
    │        └─ Simulate 300ms delay
    │        └─ Return mock data
    └─ NO  → Send to real backend
```

---

## Configuration

### Toggle Between Mock and Real API

```javascript
// src/utils/apiConfig.js

// Use MOCK API for development
export const USE_MOCK_API = __DEV__; // true

// Use REAL BACKEND for production
export const USE_MOCK_API = false;
```

### Configure Simulated Network Delay

```javascript
// Simulate realistic network latency
export const MOCK_API_DELAY = 300; // milliseconds
```

### Toggle SMS Simulation

```javascript
// Simulate SMS (log only, don't send)
export const SIMULATE_SMS_ONLY = __DEV__; // true

// Send real SMS via Africa's Talking
export const SIMULATE_SMS_ONLY = false;
```

---

## Mock Data

### Generated Data

The mock API generates realistic test data for:

| Resource | Count | Details |
|----------|-------|---------|
| **Teachers** | 3 | Pre-defined test teachers |
| **Classes** | 20 | Grade 1-6, Streams A-C |
| **Students** | 2,000 | 100 per class |
| **Guardians** | 2,000+ | 1-2 per student |
| **Phone Numbers** | Realistic | +254, +255, +256 country codes |

### Test Credentials

**Teacher Login:**
```
Username: teacher1
Password: (any password)

Username: teacher2
Username: teacher3
```

**Test Data:**
- First Teacher (ID: 1) has all 20 classes assigned
- Each class has exactly 100 students
- Each student has 1-2 guardians with real-looking phone numbers

---

## Mock API Endpoints

### Authentication

```javascript
// POST /api/auth/login/
{
  "username": "teacher1",
  "password": "any_password"
}

// Response
{
  "success": true,
  "data": {
    "access": "mock_jwt_token_...",
    "refresh": "mock_refresh_token_...",
    "user": {
      "id": 1,
      "username": "teacher1",
      "role": "teacher",
      ...
    }
  }
}
```

### Classes

```javascript
// GET /api/classes/
// GET /api/classes/?teacher_id=1
// Response: List of 20 classes

// GET /api/classes/1/
// Response: Single class details
```

### Students

```javascript
// GET /api/students/?class_id=1&page=1&page_size=100
// Response: Students in class (paginated)

// GET /api/students/1001/
// Response: Single student details

// POST /api/students/
{
  "class": 1,
  "first_name": "John",
  "last_name": "Mwangi",
  ...
}
```

### Attendance

```javascript
// POST /api/attendance/mark/
{
  "student_id": 1001,
  "student_name": "John Mwangi",
  "class_id": 1,
  "status": "PRESENT"  // or "ABSENT"
}

// Response: Attendance record + SMS logged

// GET /api/attendance/today/
// GET /api/attendance/today/?class_id=1
// Response: Today's attendance records

// GET /api/attendance/report/?start_date=2024-01-01&end_date=2024-01-31
// Response: Attendance report with stats
```

### SMS

```javascript
// POST /api/sms/send/
{
  "recipient_phone": "+254712345678",
  "message": "SMS text here",
  "student_id": 1001,
  "status": "PRESENT"
}

// GET /api/sms/log/?limit=50
// Response: List of recent SMS logs
```

---

## Testing Workflow

### 1. **Test Login**

```
1. Open app
2. See splash screen (mock data loading)
3. Go to login screen
4. Enter: teacher1 / any_password
5. Should see dashboard
```

### 2. **Test Attendance Marking**

```
1. Go to "Mark Attendance"
2. Select a class
3. See 100 students loaded
4. Mark some students Present/Absent
5. Tap "Submit"
6. See success message + SMS logged
```

### 3. **View SMS Logs**

```
Open DevTools or Xcode console:
📱 SMS logged: {
  to: "+254712345678",
  message: "SMARTSCHOOL EdTech Alert: John Mwangi arrived at school...",
  status: "sent"
}
```

### 4. **Test Reports**

```
1. Go to "Attendance Reports"
2. Select date range
3. See attendance summary
4. Stats show: Total, Present, Absent, Percentage
```

---

## Switching to Real Backend

### When Backend is Ready:

**Step 1:** Update configuration

```javascript
// src/utils/apiConfig.js
export const USE_MOCK_API = false; // Disable mock API
export const SIMULATE_SMS_ONLY = false; // Enable real SMS
```

**Step 2:** Add Africa's Talking credentials

```javascript
// src/utils/constants.js
export const SMS_CONFIG = {
  username: 'YOUR_AT_USERNAME',
  api_key: 'YOUR_AT_API_KEY',
  sender_id: 'SMARTSCHOOL',
};
```

**Step 3:** Deploy to real backend

All API calls will automatically route to the real backend.

---

## Debugging

### View Mock API Logs

In React Native debugger or Expo logs, you'll see:

```
🔀 Routing POST /api/auth/login/ to MOCK API
📋 Initializing mock database for 2,000 learners...
✅ Mock database loaded: 20 classes, 2,000 students
📱 SMS logged: { to: "+254712345678", ... }
```

### Check API Configuration

```javascript
// In app code
import { logApiConfiguration } from '../utils/apiConfig';
logApiConfiguration();
```

Output:
```
🔧 API Configuration:
   - Using 📦 MOCK API (or 🌐 REAL BACKEND)
   - SMS: 📝 Simulated (or 📱 Real)
   - Mock API Delay: 300ms
```

### View Mock Database

```javascript
// In console/debugger
import mockApi from '../services/mockApi';
console.log(mockApi.database);
```

Shows:
- All classes, students, guardians, attendance records, SMS logs

---

## Performance Considerations

### For 2,000 Learners

- **App Start:** ~1-2 seconds (mock data generation)
- **API Calls:** ~300ms (simulated) vs ~100-200ms real
- **Memory:** ~10-15MB for mock database in RAM
- **Class List:** 20 items → instant load
- **Student List:** 100 items per class → paginated in UI

### Optimization Tips

If performance is slow:
1. Reduce `MOCK_API_DELAY` to 0ms
2. Reduce classes/students in `mockData.js`
3. Use virtual scrolling in FlatList for large lists

---

## Common Issues

### Q: Mock API not working?

**A:** Check:
1. `USE_MOCK_API = __DEV__` is `true`
2. App is in development mode
3. Check console for initialization logs

### Q: Where are SMS being sent?

**A:** SMS are logged to console only (not actually sent). Search logs for `"📱 SMS"` marker.

### Q: Can I test with real phone numbers?

**A:** Yes! The mock API generates realistic +254/+255/+256 phone numbers. To test with specific numbers, edit `src/services/mockData.js`.

### Q: How do I reset test data?

**A:** Mock data reloads on app restart. No persist mechanism (intentional for testing).

---

## Next Steps

1. ✅ Mock API is ready
2. → Build Teacher UI screens
3. → Test attendance marking flow
4. → Integrate real SMS (Africa's Talking)
5. → Deploy to pilot school

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/services/mockData.js` | Mock data generator |
| `src/services/mockApi.js` | Mock API endpoints |
| `src/utils/apiConfig.js` | Configuration |
| `src/services/api.js` | API client (updated) |

---

## Questions?

Refer to the inline comments in each file for detailed documentation.
