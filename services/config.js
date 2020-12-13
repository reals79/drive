const AssetsURL =
  process.env.NODE_ENV === 'production'
    ? 'https://s3-us-west-2.amazonaws.com/hcm. .com-assets/'
    : 'https://s3-us-west-2.amazonaws.com/hcm-qa. .com-assets/'

const UserType = [
  { id: 1, label: 'Super Admin', name: 'super admin', alias: 'admin' },
  { id: 2, label: 'Dealership Admin', name: 'admin', alias: 'admin' },
  { id: 3, label: 'Manager', name: 'manager', alias: 'manager' },
  { id: 4, label: 'User', name: 'user', alias: 'user' },
  { id: 5, label: 'Employee', name: 'employee', alias: 'user' },
]

const CompanyType = [
  { id: 1, name: 'Dealership' },
  { id: 2, name: 'Financial' },
  { id: 3, name: 'Services/Consulting' },
  { id: 4, name: 'Software' },
  { id: 5, name: 'Other' },
]

const UserRoles = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  MANAGER: 3,
  USER: 4,
  EMPLOYEE: 5,
}

const KEYS = {
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  SPACE: 32,
}

// "[TOP-2622] removed Document and Questionnarie for now"
const AssignMenu = {
  1: ['Task', 'Program', 'ToDo', 'Training', 'Training Schedule'],
  2: ['Task', 'Program', 'ToDo', 'Training', 'Training Schedule'],
  3: ['Task', 'Program', 'ToDo', 'Training', 'Training Schedule'],
  4: ['Task', 'Training'],
  5: ['Task', 'Training'],
}

const AddMenu = {
  1: ['Employee', 'Company', 'Packet'],
  2: ['Employee', 'Packet'],
  3: [],
  4: [],
  5: [],
}

const CardType = [
  { id: 0, label: 'All', icon: '', alias: '' },
  { id: 1, label: 'Courses', icon: 'graduation', alias: 'fas fa-graduation-cap' },
  { id: 2, label: 'Assessment', icon: 'assessment', alias: 'fas fa-clipboard-list' },
  { id: 3, label: 'Activity', icon: 'activity', alias: 'fas fa-walking' },
  { id: 4, label: 'Scorm', icon: 'scorm', alias: 'far fa-question' },
  { id: 5, label: 'Quiz', icon: 'quiz', alias: 'fas fa-question' },
  { id: 6, label: 'Survey', icon: '', alias: 'far fa-question' },
  { id: 7, label: 'Video', icon: 'video', alias: 'far fa-video' },
  { id: 8, label: 'Task', icon: 'quiz', alias: 'fas fa-question' },
  { id: 9, label: 'Combo', icon: 'quiz', alias: 'fas fa-question' },
  { id: 10, label: 'Community Blog', icon: 'quiz', alias: 'fas fa-question' },
  { id: 11, label: 'Community Forum', icon: 'quiz', alias: 'fas fa-question' },
  { id: 12, label: 'Competency Survey', icon: 'quiz', alias: 'fas fa-question' },
  { id: 13, label: 'Performance', icon: '', alias: '' },
  { id: 14, label: 'Study', icon: 'learn', alias: 'fal fa-book-open' },
  { id: 15, label: 'Presentation', icon: 'learn', alias: 'fal fa-chalkboard-teacher' },
  { id: 16, label: 'Retention Quiz', icon: 'quiz', alias: 'fas fa-question' },
  { id: 17, label: 'Habits Schedule', icon: 'quiz', alias: 'fas fa-question' },
  { id: 20, label: 'Undefined', icon: 'quiz', alias: 'fas fa-question' },
]

const ModuleType = [
  { id: 2, label: 'Assessment', icon: 'assessment', alias: 'fas fa-clipboard-list' },
  { id: 3, label: 'Action', icon: 'action', alias: 'far fa-question' },
  { id: 3, label: 'Activity', icon: 'activity', alias: 'far fa-walking' },
  { id: 4, label: 'Scorm', icon: 'scorm', alias: 'far fa-question' },
  { id: 5, label: 'Quiz', icon: 'quiz', alias: 'far fa-question' },
  { id: 6, label: 'Survey', icon: 'survey', alias: 'far fa-question' },
  { id: 7, label: 'Video', icon: 'video', alias: 'far fa-video' },
  { id: 8, label: 'Task', icon: 'task', alias: 'far fa-question' },
  { id: 9, label: 'Combo', icon: 'combo', alias: 'far fa-question' },
  { id: 12, label: 'Community Survey', icon: 'combo', alias: 'far fa-question' },
  { id: 13, label: 'Performance', icon: 'performance', alias: 'far fa-question' },
  { id: 14, label: 'Study', icon: 'learn', alias: 'fal fa-book-open' },
  { id: 15, label: 'Presentation', icon: 'learn', alias: 'fal fa-chalkboard-teacher' },
]

const LearningModule = [
  { id: 3, label: 'Activity', icon: 'activity', alias: 'far fa-walking' },
  { id: 4, label: 'Scorm', icon: 'scorm', alias: 'far fa-question' },
  { id: 5, label: 'Quiz', icon: 'quiz', alias: 'far fa-question' },
  { id: 7, label: 'Video', icon: 'video', alias: 'far fa-video' },
  { id: 14, label: 'Study', icon: 'learn', alias: 'fal fa-book-open' },
  { id: 15, label: 'Presentation', icon: 'learn', alias: 'fal fa-chalkboard-teacher' },
]

const QuizType = [
  { id: 1, label: 'Word Match' },
  { id: 2, label: 'Number Match' },
  { id: 3, label: 'Single choice' },
  { id: 4, label: 'Multiple Choice' },
  { id: 5, label: 'Essay' },
]

const InitQuiz = {
  1: {
    type: 1,
    wording: '',
    timing: '',
    rules: {
      rule: 'equals',
      answer: '',
    },
  },
  2: {
    type: 2,
    wording: '',
    timing: '',
    rules: {
      answer: '',
    },
  },
  3: {
    type: 3,
    wording: '',
    timing: '',
    rules: {
      answer: '',
      options: ['', ''],
    },
  },
  4: {
    type: 4,
    wording: '',
    timing: '',
    rules: {
      answer: [],
      options: ['', ''],
    },
  },
  5: {
    type: 5,
    wording: '',
    timing: '',
    rules: {
      rule: 'contains',
      answer: '',
    },
  },
}

const InitialGlobalSearchResult = {
  search_text: '',
  companies: [],
  peoples: [],
  products: [],
  blogs: [],
  forums: [],
  modules: [],
  courses: [],
  tracks: [],
}

const AssignType = [
  { id: 0, label: 'All Assigned', name: 'all' },
  { id: 1, label: 'Career Assigned', name: 'career' },
  { id: 2, label: 'Manager Assigned', name: 'manager' },
  { id: 3, label: 'Self Assigned', name: 'self' },
]

const RecurringType = {
  day: {
    id: 0,
    label: 'Daily',
    name: 'day',
  },
  week: {
    id: 1,
    label: 'Weekly',
    name: 'week',
  },
  month: {
    id: 2,
    label: 'Monthly',
    name: 'month',
  },
}

const ScheduleTypes = [
  { id: 0, value: 'Daily', key: 'day' },
  { id: 1, value: 'Weekly', key: 'week' },
  { id: 2, value: 'Monthly', key: 'month' },
]

const ToDoTypes = ['habits', 'habitslist', 'quotas', 'scorecards']
const ProgramTypes = ['careers', 'certifications', 'badges']

const LibraryTypes = {
  quotas: {
    id: 0,
    label: 'Quota',
    icon: 'fal fa-location',
  },
  scorecards: {
    id: 1,
    label: 'Scorecard',
    icon: 'fal fa-address-card',
  },
  habits: {
    id: 2,
    label: 'Habit',
    icon: 'fal fa-repeat',
  },
  habitslist: {
    id: 3,
    label: 'Habit Schedule',
    icon: 'fal fa-clock',
  },
  courses: {
    id: 4,
    label: 'Course',
    icon: '',
  },
  tracks: {
    id: 5,
    label: 'Track',
    icon: '',
  },
  powerpoint: {
    id: 6,
    label: 'Power Point',
    icon: 'fal fa-file-powerpoint',
  },
  word: {
    id: 7,
    label: 'Word',
    icon: 'fal fa-file-word',
  },
  pdf: {
    id: 8,
    label: 'PDF',
    icon: 'fal fa-file-pdf',
  },
  careers: {
    id: 9,
    label: 'Career',
    icon: 'fal fa-user-tie',
  },
  certifications: {
    id: 10,
    label: 'Certificate',
    icon: 'fal fa-file-certificate',
  },
  badges: {
    id: 11,
    label: 'Badge',
    icon: 'fal fa-badge-check',
  },
  modules: {
    id: 12,
    label: 'Modules',
    icon: '',
  },
}

const FileType = {
  'application/json': {
    label: 'Json file',
    icon: 'JSON',
    alias: 'fas fa-file',
  },
  'image/png': {
    label: 'PNG file',
    icon: 'PNG',
    alias: 'fas fa-file-image',
  },
  'image/jpeg': {
    label: 'JPG file',
    icon: 'JPG',
    alias: 'fas fa-file-image',
  },
  'application/pdf': {
    label: 'PDF file',
    icon: 'PDF',
    alias: 'fas fa-file-pdf',
  },
  'text/xml': {
    label: 'XML file',
    icon: 'XML',
    alias: 'fas fa-file',
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    label: 'WORD file',
    icon: 'WORD',
    alias: 'fas fa-file-word',
  },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    label: 'Excel file',
    icon: 'EXCEL',
    alias: 'fas fa-file-excel',
  },
  'application/msword': {
    label: 'WORD file',
    icon: 'WORD',
    alias: 'fas fa-file-word',
  },
  'application/vnd.ms-excel': {
    label: 'Excel file',
    icon: 'EXCEL',
    alias: 'fas fa-file-excel',
  },
  'application/zip': {
    label: 'Zip file',
    icon: 'Archive',
    alias: 'fas fa-file-archive',
  },
  'video/mp4': {
    label: 'MP4 file',
    icon: 'Video',
    alias: 'fas fa-file-video',
  },
  'video/x-msvideo': {
    label: 'AVI file',
    icon: 'Video',
    alias: 'fas fa-file-video',
  },
  'video/quicktime': {
    label: 'MOV file',
    icon: 'Video',
    alias: 'fas fa-file-video',
  },
  'video/x-ms-wmv': {
    label: 'WMV file',
    icon: 'Video',
    alias: 'fas fa-file-video',
  },
  'audio/mp3': {
    label: 'MP3 file',
    icon: 'Audio',
    alias: 'fas fa-file-audio',
  },
}

const CardStatus = ['not started', 'started', 'past due', 'completed', 'manager approval']

const CareerProgramStatus = ['Admin', 'Assigned', 'Started', 'Stopped', 'Completed', 'Promoted']

const ProgramStatus = {
  ADMIN: 0,
  ASSIGNED: 1,
  STARTED: 2,
  STOPPED: 3,
  COMPLETE: 4,
  PROMOTION: 5,
}

const AdvancedSettings = [
  { id: 0, label: 'Advanced Settings', value: 0 },
  { id: 1, label: '5 min', value: 5 },
  { id: 2, label: '15 min', value: 15 },
  { id: 3, label: '30 min', value: 30 },
  { id: 4, label: '60 min', value: 60 },
  { id: 5, label: '120 min', value: 120 },
]

const TimeIntervals = [
  { id: 0, label: '15 min', value: 15 },
  { id: 1, label: '30 min', value: 30 },
  { id: 2, label: '1 hour', value: 60 },
  { id: 3, label: '2 hours', value: 120 },
  { id: 4, label: '4 hours', value: 240 },
  { id: 5, label: '1 day', value: 1440 },
  { id: 6, label: '2 days', value: 2880 },
  { id: 7, label: '4 days', value: 5760 },
  { id: 8, label: '7 days', value: 10080 },
  { id: 9, label: '10 days', value: 14400 },
]

const YesNo = [
  { id: 0, label: 'Yes', value: true },
  { id: 1, label: 'No', value: false },
]

const WeekSelectors = [
  'Select',
  '1 Week',
  '2 Weeks',
  '3 Weeks',
  '4 Weeks',
  '5 Weeks',
  '6 Weeks',
  '7 Weeks',
  '8 Weeks',
  '9 Weeks',
  '10 Weeks',
  '11 Weeks',
  '12 Weeks',
  '13 Weeks',
  '14 Weeks',
  '15 Weeks',
  '16 Weeks',
  '17 Weeks',
  '18 Weeks',
  '19 Weeks',
  '20 Weeks',
  '21 Weeks',
  '22 Weeks',
  '23 Weeks',
  '24 Weeks',
  '25 Weeks',
  '26 Weeks',
]

const MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const LibraryExpires = [...Array(37)].map((e, id) => {
  let value = `${id} Months`
  if (id === 0) value = 'Never'
  if (id === 1) value = '1 Month'
  return { id, value }
})

const LibraryLevels = [...Array(10)].map((e, index) => {
  return {
    id: index + 1,
    value: `Level ${index + 1}`,
  }
})

// Type of Quota Target
const QuotaType = [
  { id: 0, name: 'Dollar' },
  { id: 1, name: 'Number' },
  { id: 2, name: 'Percentage' },
]

const QuotaDirections = [
  { id: 0, name: 'Higher is better', value: 1 },
  { id: 1, name: 'Lower is better', value: 2 },
]

// Quota source
const QuotaSource = [
  { id: 0, name: 'Automatic' },
  { id: 1, name: 'Manual' },
  { id: 2, name: 'HCM' },
]

const PerformanceReviewType = [
  { id: 0, value: 'Monthly' },
  { id: 1, value: 'Quarterly' },
]

const QuotaCalcTypes = {
  MONTH: {
    id: 0,
    label: 'One Month Achievement',
  },
  QUARTER: {
    id: 1,
    label: 'Quarter Achievement',
  },
  TOTAL: {
    id: 2,
    label: 'Total Achievement',
  },
  MONTHLY_AVERAGE: {
    id: 3,
    label: 'Average X Months ach.',
  },
  QUARTERLY_AVERAGE: {
    id: 4,
    label: 'Average for Quarter',
  },
}

const QuotaCalcs = {
  MONTH: 0,
  QUARTER: 1,
  TOTAL: 2,
  MONTHLY_AVERAGE: 3,
  QUARTERLY_AVERAGE: 4,
}

const QuotaRequirement = [
  { id: 1, name: 'Greater/Equal', value: 1 },
  { id: 2, name: 'Less/Equal', value: 2 },
]

const QuestionType = [
  { id: 1, name: 'TEXT' },
  { id: 2, name: 'NUMBER' },
  { id: 3, name: 'MULTIPLE_CHOICE' },
  { id: 4, name: 'CHECKBOX' },
  { id: 5, name: 'TEXTAREA' },
]

const RatingType = [
  { id: 0, name: 'Outstanding' },
  { id: 1, name: 'Good' },
  { id: 2, name: 'Standard' },
  { id: 3, name: 'Minimum' },
  { id: 4, name: 'Poor' },
  { id: 5, name: 'Under Scale' },
]

const DocumentType = [
  { id: 0, name: 'Power Point' },
  { id: 1, name: 'Word' },
  { id: 2, name: 'PDF' },
  // { id: 3, name: 'Envelope' }, Hiding envelope
]

const MenuItems = [
  { id: 0, value: 'Archive' },
  { id: 1, value: 'Edit' },
  { id: 2, value: 'Delete' },
]

const EmployeeMenuItems = {
  1: ['Edit', 'Terminate', 'Delete'],
  2: ['Edit', 'Terminate', 'Delete'],
  3: ['Edit'],
  4: ['Edit'],
  5: ['Edit'],
}

const CompanyMenuItems = {
  1: ['Archive', 'Edit', 'Delete'],
  2: ['Archive', 'Edit', 'Delete'],
  3: ['Archive'],
  4: ['Archive'],
  5: ['Archive'],
}

const TaskDotsType = {
  1: ['Detail View', 'Edit', 'Delete'],
  2: ['Detail View', 'Edit', 'Delete'],
  3: ['Detail View', 'Edit', 'Delete'],
  4: ['Detail View'],
  5: ['Detail View'],
}

const AdminDotsType = ['Assign', 'Detail View', 'Edit', 'Preview View', 'Quick Assign', 'Bulk Unassign']

const UserDotsType = ['Detail View', 'Preview View']

const TrainingDotType = [
  { id: 2, value: 'Assign' },
  { id: 1, value: 'Detail View' },
  { id: 3, value: 'Preview View' },
]

const ToDoDotTypeAdmin = [
  { id: 1, value: 'Assign' },
  { id: 2, value: 'Detail View' },
  { id: 3, value: 'Edit View' },
]

const ToDoDotTypeUser = [
  { id: 1, value: 'Assign' },
  { id: 2, value: 'Detail View' },
]

const CompanyDevelopDotType = [
  { id: 1, value: 'Assign' },
  { id: 2, value: 'View' },
]

const CompanyDevelopTabs = [
  { id: 0, name: 'overall', label: 'Total Assigned' },
  { id: 1, name: 'career', label: 'Career' },
  { id: 2, name: 'manager', label: 'Manager' },
  { id: 3, name: 'self', label: 'Self' },
]

const SPECIALOPTIONS = {
  ALL: -1, // Select All
  NONE: -2, // Select None
  SELFASSIGNED: -3, // Select tasks I assigned
  LIST: -4, // List Companies
}

const LibraryTrackMenu = {
  1: ['Assign', 'Delete', 'Detail View', 'Edit', 'Preview View', 'Quick Assign'],
  2: ['Assign', 'Delete', 'Detail View', 'Edit', 'Preview View', 'Quick Assign'],
  3: ['Assign', 'Detail View', 'Preview View', 'Quick Assign'],
  4: ['Detail View', 'Preview View', 'Quick Assign'],
  5: ['Detail View', 'Preview View', 'Quick Assign'],
}

const LibraryTrainingMenu = {
  1: ['Assign', 'Delete', 'Detail View', 'Edit', 'Group Training', 'Preview View', 'Quick Assign'],
  2: ['Assign', 'Delete', 'Detail View', 'Edit', 'Group Training', 'Preview View', 'Quick Assign'],
  3: ['Assign', 'Detail View', 'Group Training', 'Preview View', 'Quick Assign'],
  4: ['Detail View', 'Preview View', 'Quick Assign'],
  5: ['Detail View', 'Preview View', 'Quick Assign'],
}

const LibraryModuleMenu = {
  1: ['Delete', 'Detail View', 'Edit', 'Preview View'],
  2: ['Delete', 'Detail View', 'Edit', 'Preview View'],
  3: ['Detail View', 'Preview View'],
  4: ['Detail View', 'Preview View'],
  5: ['Detail View', 'Preview View'],
}

const LibraryCardDetailMenu = {
  1: ['Edit', 'Preview view'],
  2: ['Edit', 'Preview view'],
  3: ['Edit', 'Preview view'],
  4: ['Preview view'],
  5: ['Preview view'],
}

const LibraryProgramMenu = {
  1: ['Assign', 'Delete', 'Detail View', 'Duplicate', 'Edit', 'Quick Assign'],
  2: ['Assign', 'Delete', 'Detail View', 'Duplicate', 'Edit', 'Quick Assign'],
  3: ['Assign', 'Detail View', 'Quick Assign'],
  4: ['Detail view'],
  5: ['Detail view'],
}

const LibraryCardEditMenu = {
  1: ['Detail view', 'Preview view'],
  2: ['Detail view', 'Preview view'],
  3: ['Detail view', 'Preview view'],
  4: ['Detail view', 'Preview view'],
  5: ['Detail view', 'Preview view'],
}

const LibraryQuotaMenu = {
  1: ['Attach To Program', 'Attach To Scorecard', 'Delete', 'Detail view', 'Edit'],
  2: ['Attach To Program', 'Attach To Scorecard', 'Delete', 'Detail view', 'Edit'],
  3: ['Detail view'],
  4: ['Detail view'],
  5: ['Detail view'],
}

const LibraryAttachMenu = {
  1: ['Detail view', 'Move up', 'Move Down', 'Remove', 'Preview view'],
  2: ['Detail view', 'Move up', 'Move Down', 'Remove', 'Preview view'],
  3: ['Detail view', 'Move up', 'Move Down', 'Remove', 'Preview view'],
  4: ['Detail view', 'Preview view'],
  5: ['Detail view', 'Preview view'],
}

const ManageReportMenu = {
  1: ['Assign Career', 'View Career', 'Edit Career', 'Save Actuals'],
  2: ['Assign Career', 'View Career', 'Edit Career', 'Save Actuals'],
  3: ['Assign Career', 'View Career', 'Edit Career', 'Save Actuals'],
  4: ['View Career', 'Save Actuals'],
  5: ['View Career', 'Save Actuals'],
}

const CertificationReportMenu = {
  1: ['Assign Certification', 'View Certification', 'Edit Certification', 'Save Actuals'],
  2: ['Assign Certification', 'View Certification', 'Edit Certification', 'Save Actuals'],
  3: ['Assign Certification', 'View Certification', 'Edit Certification', 'Save Actuals'],
  4: ['View Certification', 'Save Actuals'],
  5: ['View Certification', 'Save Actuals'],
}

const PerforamnceCommitMenu = {
  1: ['Detail View', 'Edit', 'Delete'],
  2: ['Detail View', 'Edit', 'Delete'],
  3: ['Detail View', 'Edit', 'Delete'],
  4: ['Detail View'],
  5: ['Detail View'],
}

const ManageAssignments = {
  1: ['Assign', 'Detail View', 'Edit', 'Edit Actuals', 'Quick Assign'],
  2: ['Assign', 'Detail View', 'Edit', 'Edit Actuals', 'Quick Assign'],
  3: ['Assign', 'Detail View', 'Edit', 'Edit Actuals', 'Quick Assign'],
  4: ['Detail View', 'Edit Actuals'],
  5: ['Detail View', 'Edit Actuals'],
}

const NewHireReportMenu = {
  1: ['Detail View', 'Edit Assignement'],
  2: ['Detail View', 'Edit Assignement'],
  3: ['Detail View', 'Edit Assignement'],
  4: ['Detail View'],
  5: ['Detail View'],
}

const LibraryProgramDetailMenu = {
  1: ['Assign', 'Detail View', 'Edit', 'Quick Assign'],
  2: ['Assign', 'Detail View', 'Edit', 'Quick Assign'],
  3: ['Assign', 'Detail View', 'Quick Assign'],
  4: ['Detail View'],
  5: ['Detail View'],
}

const CompanyPerformanceMenu = {
  1: [
    'Assign Scorecard',
    'Employee Profile',
    'Performance Report',
    'Preview Scorecard',
    'Save Actuals',
    'Start Review',
    'Unassign Scorecard',
  ],
  2: [
    'Assign Scorecard',
    'Employee Profile',
    'Performance Report',
    'Preview Scorecard',
    'Save Actuals',
    'Start Review',
    'Unassign Scorecard',
  ],
  3: [
    'Assign Scorecard',
    'Employee Profile',
    'Performance Report',
    'Preview Scorecard',
    'Save Actuals',
    'Start Review',
    'Unassign Scorecard',
  ],
  4: ['Employee Profile', 'Performance Report', 'Preview Scorecard', 'Save Actuals', 'Start Review'],
  5: ['Employee Profile', 'Performance Report', 'Preview Scorecard', 'Save Actuals', 'Start Review'],
}

const CompanyPerformanceReportMenu = {
  1: [
    'Assign Scorecard',
    'Save Actuals',
    'Preview Scorecard',
    'Start Review',
    'Unassign Scorecard',
    'View individual report',
  ],
  2: [
    'Assign Scorecard',
    'Save Actuals',
    'Preview Scorecard',
    'Start Review',
    'Unassign Scorecard',
    'View individual report',
  ],
  3: [
    'Assign Scorecard',
    'Save Actuals',
    'Preview Scorecard',
    'Start Review',
    'Unassign Scorecard',
    'View individual report',
  ],
  4: ['Save Actuals', 'Preview Scorecard', 'Start Review', 'View individual report'],
  5: ['Save Actuals', 'Preview Scorecard', 'Start Review', 'View individual report'],
}

const VendorMenu = {
  1: ['Edit', 'Detail View'],
  2: ['Edit', 'Detail View'],
  3: ['Edit', 'Detail View'],
  4: ['Detail View'],
  5: ['Detail View'],
}

const LibraryToDoQuotaDetailMenu = {
  1: ['Edit', 'Delete'],
  2: ['Edit', 'Delete'],
}

const LibraryToDoHabitDetailMenu = {
  1: ['Detail View', 'Edit'],
  2: ['Detail View', 'Edit'],
  3: ['Detail View'],
  4: ['Detail View'],
  5: ['Detail View'],
}

const LibraryToDoHabitScheduleDetailMenu = {
  1: ['Assign', 'Detail View', 'Edit'],
  2: ['Assign', 'Detail View', 'Edit'],
  3: ['Assign', 'Detail View'],
  4: ['Detail View'],
  5: ['Detail View'],
}

const LibraryToDoScorecardMenu = {
  1: ['Assign', 'Detail View', 'Edit'],
  2: ['Assign', 'Detail View', 'Edit'],
  3: ['Assign', 'Detail View'],
  4: ['Detail View'],
  5: ['Detail View'],
}

const NotificationSettings = {
  'Approval Task': ['Assigned', 'Approved', 'Denied', 'Commented', 'Past Due'],
  Career: ['Assigned', 'Unassigned', 'Date Changed', 'Past Due'],
  Certification: ['Assigned', 'Unassigned', 'Date Changed', 'Past Due'],
  Course: ['Assigned', 'Unassigned', 'Date Changed', 'Past Due'],
  'Habit Schedule': ['Assigned', 'Unassigned'],
  'Training Schedule': ['Assigned', 'Unassigned'],
  Quota: ['Assigned', 'Unassigned'],
  Scorecard: ['Assigned', 'Unassigned'],
  Task: ['Assigned', 'Date Changed', 'Unassigned', 'Edited', 'Commented', 'Past Due'],
}

const NotificationTypes = [
  { id: 1, label: 'In App', value: 'app' },
  { id: 2, label: 'Email', value: 'email' },
  { id: 3, label: 'Text', value: 'text' },
]

const NotificationPeriod = [
  { id: 1, label: 'Daily', value: 'daily' },
  { id: 2, label: 'Monthly', value: 'monthly' },
  { id: 3, label: 'Weekly', value: 'weekly' },
]

const InitialNotificationSettings = {
  id: 1,
  user_id: 0,
  created_at: '',
  updated_at: '',
  success: true,
  data: {
    Task: {
      edited: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      deleted: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      assigned: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'past due': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      commented: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'date changed': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
    },
    Quota: {
      deleted: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      assigned: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
    },
    Track: {
      deleted: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      assigned: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'past due': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'date changed': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
    },
    Career: {
      deleted: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      assigned: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'past due': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'date changed': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
    },
    Course: {
      deleted: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      assigned: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'past due': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'date changed': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
    },
    Scorecard: {
      deleted: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      assigned: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'past due': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
    },
    'Approval Task': {
      denied: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      approved: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      assigned: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'past due': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      commented: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
    },
    Certification: {
      deleted: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      assigned: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'past due': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'date changed': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
    },
    'Habit Schedule': {
      deleted: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      assigned: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'past due': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
    },
    'Training Schedule': {
      deleted: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      assigned: {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
      'past due': {
        newsletters: {
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
        notifications: {
          app: 0,
          text: 0,
          email: 0,
        },
      },
    },
  },
}

const SearchSections = [{ id: 1, value: 'Vendor Ratings' }]

const SearchOptions = [
  { id: 1, label: 'Exact match', value: 'exact' },
  { id: 2, label: 'All words', value: 'all' },
  { id: 3, label: 'One word', value: 'one' },
]

const NotificationIcons = {
  task: {
    id: 1,
    label: 'Task',
    icon: 'fal fa-check-circle',
  },
  career: {
    id: 2,
    label: 'Career',
    icon: 'fal fa-user-tie',
  },
  certification: {
    id: 3,
    label: 'Certification',
    icon: 'fal fa-file-certificate',
  },
  course: {
    id: 4,
    label: 'Course',
    icon: 'fal fa-graduation-cap',
  },
  track: {
    id: 5,
    label: 'Track',
    icon: 'fal fa-graduation-cap',
  },
  scorecard: {
    id: 6,
    label: 'Scorecard',
    icon: 'fal fa-address-card',
  },
  'habit schedule': {
    id: 7,
    label: 'Habit Schedule',
    icon: 'fal fa-clock',
  },
  schedule: {
    id: 8,
    label: 'Schedule',
    icon: 'fal fa-repeat',
  },
  quota: {
    id: 9,
    label: 'Quota',
    icon: 'fal fa-location',
  },
  'approval task': {
    id: 10,
    label: 'Approval Task',
    icon: 'fal fa-check-circle',
  },
  'training schedule': {
    id: 11,
    label: 'Training Schedule',
    icon: 'fal fa-business-time',
  },
}

const NOTIFICATION_TYPES = {
  INFO: 1,
  ACTION: 2,
  PROBLEM: 3,
  TASK: 4,
  TRAINING: 5,
}

const NOTIFICATION_STATUSES = {
  NEW: 1,
  VIEWED: 2,
}

const TARGET_UNIT = {
  Integer: '',
  Percentage: '%',
  Dollar: '$',
}

const SortOptions = [
  {
    id: 1,
    value: 'Date',
  },
]

const AssignmentTabs = [
  { id: 0, name: 'courses', label: 'Training' },
  { id: 1, name: 'habits', label: 'To Do' },
  { id: 2, name: 'programs', label: 'Programs' },
]

const DocumentTabs = [
  { id: 0, name: 'powerpoint', label: 'Power Point' },
  { id: 1, name: 'word', label: 'Word' },
  { id: 2, name: 'excel', label: 'Excel' },
  { id: 3, name: 'pdf', label: 'PDF' },
  { id: 4, name: 'esign', label: 'eSign' },
  { id: 5, name: 'packets', label: 'Packets' },
]

const EngagementTabs = [
  { id: 0, name: 'trainings', label: 'Training' },
  { id: 1, name: 'newhires', label: 'New Hire' },
  { id: 2, name: 'performances', label: 'Performance' },
  { id: 3, name: 'tasks', label: 'Tasks & Projects' },
  { id: 4, name: 'careers', label: 'Career Mapping' },
  { id: 5, name: 'records', label: 'Records' },
  { id: 6, name: 'users', label: 'Users' },
]

const CompanyPerforamceTabs = [
  { id: 0, name: 'employees', label: 'Employees' },
  { id: 1, name: 'chart', label: 'OrgCharts' },
]

const LibraryProgramTabs = [
  { id: 0, name: 'careers', label: 'Careers' },
  { id: 1, name: 'certifications', label: 'Certifications' },
]

const LibraryTodoTabs = [
  { id: 0, name: 'habits', label: 'Habit' },
  { id: 1, name: 'habitslist', label: 'Habit Schedule' },
  { id: 2, name: 'quotas', label: 'Quota' },
  { id: 3, name: 'scorecards', label: 'Scorecard' },
]

const LibraryTrainingTabs = [
  { id: 0, name: 'tracks', label: 'Tracks' },
  { id: 1, name: 'courses', label: 'Courses' },
  { id: 2, name: 'modules', label: 'Modules' },
]

const QuotaReportTabs = [
  { name: 'all', label: 'All' },
  { name: 'scorecard', label: 'Scorecard Quotas' },
  { name: 'program', label: 'Program Quotas' },
]

const IndividualQuotaReportMenu = {
  1: ['Edit Actuals', 'Edit Program Assignment', 'Edit Scorecard Assignment'],
  2: ['Edit Actuals', 'Edit Program Assignment', 'Edit Scorecard Assignment'],
  3: ['Edit Actuals', 'Edit Program Assignment', 'Edit Scorecard Assignment'],
  4: ['View Scorecards', 'View Programs'],
  5: ['View Scorecards', 'View Programs'],
}

const ScorecardTaskType = {
  1: ['Assign Scorecard', 'Save actuals', 'Start review', 'Unassign Scorecard'],
  2: ['Assign Scorecard', 'Save actuals', 'Start review', 'Unassign Scorecard'],
  3: ['Assign Scorecard', 'Save actuals', 'Start review', 'Unassign Scorecard'],
  4: ['Save actuals', 'Start review'],
  5: ['Save actuals', 'Start review'],
}

// Community
const ForumDepartmentIcons = {
  8: 'far fa-key',
  9: 'far fa-shield-check',
  10: 'far fa-wrench',
  11: 'fal fa-solar-panel',
  12: 'fal fa-megaphone',
  13: 'fal fa-wifi',
  14: 'fal fa-motorcycle',
  15: 'fal fa-car',
  16: 'fal fa-car-side',
}

const ForumManageMenu = ['Edit']

export {
  UserType,
  CompanyType,
  UserRoles,
  KEYS,
  CardType,
  ModuleType,
  LibraryTypes,
  LearningModule,
  QuizType,
  InitQuiz,
  InitialGlobalSearchResult,
  AssetsURL,
  CardStatus,
  FileType,
  AssignType,
  ToDoTypes,
  ProgramTypes,
  RecurringType,
  ScheduleTypes,
  CareerProgramStatus,
  ProgramStatus,
  AdvancedSettings,
  TimeIntervals,
  YesNo,
  WeekSelectors,
  LibraryExpires,
  LibraryLevels,
  USERS,
  QuotaType,
  QuotaDirections,
  QuotaSource,
  QuotaCalcTypes,
  QuotaCalcs,
  QuotaRequirement,
  QuestionType,
  DocumentType,
  MenuItems,
  EmployeeMenuItems,
  PerformanceReviewType,
  RatingType,
  TrainingDotType,
  TaskDotsType,
  AdminDotsType,
  UserDotsType,
  ToDoDotTypeAdmin,
  ToDoDotTypeUser,
  CompanyDevelopDotType,
  CompanyDevelopTabs,
  AssignMenu,
  AddMenu,
  SPECIALOPTIONS,
  MonthNames,
  LibraryProgramMenu,
  LibraryCardDetailMenu,
  LibraryTrackMenu,
  LibraryTrainingMenu,
  LibraryModuleMenu,
  LibraryCardEditMenu,
  LibraryAttachMenu,
  LibraryQuotaMenu,
  ManageReportMenu,
  CertificationReportMenu,
  PerforamnceCommitMenu,
  ManageAssignments,
  NewHireReportMenu,
  LibraryProgramDetailMenu,
  CompanyPerformanceMenu,
  CompanyPerformanceReportMenu,
  VendorMenu,
  LibraryToDoQuotaDetailMenu,
  LibraryToDoHabitDetailMenu,
  LibraryToDoHabitScheduleDetailMenu,
  LibraryToDoScorecardMenu,
  InitialNotificationSettings,
  NotificationSettings,
  NotificationTypes,
  NotificationPeriod,
  SearchSections,
  SearchOptions,
  CompanyMenuItems,
  NotificationIcons,
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUSES,
  TARGET_UNIT,
  SortOptions,
  AssignmentTabs,
  DocumentTabs,
  EngagementTabs,
  CompanyPerforamceTabs,
  LibraryProgramTabs,
  LibraryTodoTabs,
  LibraryTrainingTabs,
  QuotaReportTabs,
  IndividualQuotaReportMenu,
  // Community
  ForumDepartmentIcons,
  ForumManageMenu,
  ScorecardTaskType,
}
