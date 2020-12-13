export const FRANCHISES = [
  { id: 'acura', label: 'Acura' },
  { id: 'alfa romeo', label: 'Alfa Romeo' },
  { id: 'audi', label: 'Audi' },
  { id: 'bmw', label: 'BMW' },
  { id: 'buick', label: 'Buick' },
  { id: 'candillac', label: 'Candillac' },
  { id: 'chevrolet', label: 'Chevrolet' },
  { id: 'chrysler', label: 'Chrysler' },
  { id: 'dodge', label: 'Dodge' },
  { id: 'fiat', label: 'FIAT' },
  { id: 'ford', label: 'Ford' },
  { id: 'genesys', label: 'Genesys' },
  { id: 'gmc', label: 'GMC' },
  { id: 'honda', label: 'Honda' },
  { id: 'hyundai', label: 'Hyundai' },
  { id: 'infiniti', label: 'Infiniti' },
  { id: 'jaguar', label: 'Jaguar' },
  { id: 'jeep', label: 'Jeep' },
  { id: 'kia', label: 'KIA' },
  { id: 'land rover', label: 'Land Rover' },
  { id: 'lexus', label: 'Lexus' },
  { id: 'lincoln', label: 'Lincoln' },
  { id: 'mazerati', label: 'Mazerati' },
  { id: 'mazda', label: 'Mazda' },
  { id: 'mercedes-benz', label: 'Mercedes-Benz' },
  { id: 'mini', label: 'MINI' },
  { id: 'mitsubishi', label: 'Mitsubishi' },
  { id: 'nissan', label: 'Nissan' },
  { id: 'porsche', label: 'Porsche' },
  { id: 'smart', label: 'Smart' },
  { id: 'subaru', label: 'Subaru' },
  { id: 'toyota', label: 'Toyota' },
  { id: 'volkswagen', label: 'Volkswagen' },
  { id: 'volvo', label: 'Volvo' },
]

export const LICENCES_LIST = [
  {
    id: 'hcm',
    label: 'HCM',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    checks: [
      { label: 'Licenses', value: 'licenses' },
      { label: 'Org chart', value: 'org-chart' },
      { label: 'Library', value: 'library' },
      { label: 'Employees', value: 'employees' },
    ],
  },
  {
    id: 'blogs',
    label: 'Blog',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    checks: [{ label: 'Categories', value: 'categories' }],
  },
  {
    id: 'community',
    label: 'Community',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    checks: [
      { label: 'Followers', value: 'followers' },
      { label: 'Employees', value: 'employees' },
    ],
  },
  {
    id: 'vendor_rating',
    label: 'Vendor Ratings',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    checks: [
      { label: 'All Products', value: 'all-products' },
      { label: 'Grappone CRM', value: 'grappone-crm' },
      { label: 'Grappone Websites', value: 'grappone-websites' },
      { label: 'Automotive DMS', value: 'automotive-dms' },
    ],
  },
  {
    id: 'global_author',
    label: 'Global Author',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    checks: [
      { label: 'Training', value: 'training' },
      { label: 'Programs', value: 'programs' },
      { label: 'ToDo', value: 'todo' },
      { label: 'Documents', value: 'documents' },
      { label: 'Questionaires', value: 'questionaires' },
    ],
  },
  {
    id: 'jobs',
    label: 'Jobs',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    checks: [{ label: 'Work With Us', value: 'work-with-us' }],
  },
]

export const HCM_LICENSES = [
  { id: 0, label: 'Training and Development' },
  { id: 1, label: 'Tasks and Projects' },
  { id: 2, label: 'Performance Reviews' },
  { id: 3, label: 'Reports and Records' },
  { id: 4, label: 'Certification Programs' },
  { id: 5, label: 'Career Programs' },
  { id: 6, label: 'Documents' },
  { id: 7, label: 'eSignatures' },
  { id: 8, label: 'Questionaires' },
]

export const HCM_FEATURES = {
  basic: [
    { id: 0, label: 'Basic' },
    { id: 1, label: 'Tasks' },
    { id: 2, label: 'Training' },
  ],
  plus: [
    { id: 0, label: 'Plus' },
    { id: 1, label: 'Tasks' },
    { id: 2, label: 'Training' },
    { id: 3, label: 'Scorecards' },
  ],
  premium: [
    { id: 0, label: 'Premium' },
    { id: 1, label: 'Tasks' },
    { id: 2, label: 'Training' },
    { id: 3, label: 'Scorecards' },
    { id: 4, label: 'Careers' },
    { id: 5, label: 'Certifications' },
    { id: 6, label: 'New Hire Orientation' },
    { id: 7, label: 'Documents' },
    { id: 8, label: 'eSignatures' },
  ],
}

export const COMPANY_FEATURES = [
  { id: 'vendor_ratings', label: 'Products' },
  { id: 'blog', label: 'Blog' },
  { id: 'community', label: 'Community' },
  { id: 'global_author', label: 'Global Author' },
  { id: 'hcm', label: 'HCM' },
]

export const FEATURE_OPTIONS = [
  { label: 'Enable', value: 'enable' },
  { label: 'Disable', value: 'disable' },
]

export const VENDOR_CATEGORIES = [
  {
    shortName: 'DMS',
    name: 'DMS',
  },
  {
    shortName: 'CRM',
    name: 'CRM - Sales Dept.',
  },
  {
    shortName: 'Websites',
    name: 'Websites',
  },
  {
    shortName: 'Inventory',
    name: 'Inventory Merchandising',
  },
  {
    shortName: 'HCM',
    name: 'Employee Management',
  },
  {
    shortName: 'PPC',
    name: 'SEM - Paid Search',
  },
  {
    shortName: 'SEO',
    name: 'SEO Tools & Services',
  },
]

export const EXPOSURE_LEVELS = [
  { label: 'Basic', value: 'wiki' },
  { label: 'Plus', value: 'silver' },
  { label: 'Premium', value: 'gold' },
]

export const SHOW_CASES = [
  { value: 'wiki', label: 'Basic' },
  { value: 'silver', label: 'Plus' },
  { value: 'gold', label: 'Premium' },
]

export const USA_TIMEZONES = [
  { id: 0, label: 'UTC-10: Adak', value: 'America/Adak' },
  { id: 1, label: 'UTC-9: Anchorage', value: 'America/Anchorage' },
  { id: 2, label: 'UTC-7: Boise', value: 'America/Boise' },
  { id: 3, label: 'UTC-6: Chicago', value: 'America/Chicago' },
  { id: 4, label: 'UTC-7: Denver', value: 'America/Denver' },
  { id: 5, label: 'UTC-5: Detroit', value: 'America/Detroit' },
  { id: 6, label: 'UTC-5: Indiana/Indianapolis', value: 'America/Indiana/Indianapolis' },
  { id: 7, label: 'UTC-6: Indiana/Knox', value: 'America/Indiana/Knox' },
  { id: 8, label: 'UTC-5: Indiana/Marengo', value: 'America/Indiana/Marengo' },
  { id: 9, label: 'UTC-5: Indiana/Petersburg', value: 'America/Indiana/Petersburg' },
  { id: 10, label: 'UTC-5: Indiana/Tell City', value: 'America/Indiana/Tell_City' },
  { id: 11, label: 'UTC-5: Indiana/Vevay', value: 'America/Indiana/Vevay' },
  { id: 12, label: 'UTC-5: Indiana/Vincennes', value: 'America/Indiana/Vincennes' },
  { id: 13, label: 'UTC-5: Indiana/Winamac', value: 'America/Indiana/Winamac' },
  { id: 14, label: 'UTC-9: Juneau', value: 'America/Juneau' },
  { id: 15, label: 'UTC-5: Kentucky/Louisville', value: 'America/Kentucky/Louisville' },
  { id: 16, label: 'UTC-5: Kentucky/Monticello', value: 'America/Kentucky/Monticello' },
  { id: 17, label: 'UTC-8: Los Angeles', value: 'America/Los_Angeles' },
  { id: 18, label: 'UTC-6: Menominee', value: 'America/Menominee' },
  { id: 19, label: 'UTC-8: Metlakatla', value: 'America/Metlakatla' },
  { id: 20, label: 'UTC-5: New York', value: 'America/New_York' },
  { id: 21, label: 'UTC-9: Nome', value: 'America/Nome' },
  { id: 22, label: 'UTC-5: North_Dakota/Beulah', value: 'America/North_Dakota/Beulah' },
  { id: 23, label: 'UTC-6: North_Dakota/Center', value: 'America/North_Dakota/Center' },
  { id: 24, label: 'UTC-6: North_Dakota/New_Salem', value: 'America/North_Dakota/New_Salem' },
  { id: 25, label: 'UTC-7: Phoenix', value: 'America/Phoenix' },
  { id: 26, label: 'UTC-9: Sitka', value: 'America/Sitka' },
  { id: 27, label: 'UTC-9: Yakutat', value: 'America/Yakutat' },
  { id: 28, label: 'UTC-10: Honolulu', value: 'America/Honolulu' },
]

export const RATING_STATUS = [null, 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export const VARIANT_TYPE = { high: 'contained', medium: 'outlined', low: 'text', link: 'text' }
