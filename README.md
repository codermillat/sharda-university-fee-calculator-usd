# Sharda University Fee & Scholarship Calculator 2025

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://sharda-university-fee-calculator-us.vercel.app/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A comprehensive, modern fee calculator for **Sharda University** designed for international students worldwide. Calculate fees in **USD** for 200+ courses across 13 schools, with detailed year-wise breakdowns and scholarship options (50%, 20%).

## 🌐 Live Application

**🔗 Visit the live demo:** [https://sharda-university-fee-calculator-us.vercel.app/](https://sharda-university-fee-calculator-us.vercel.app/)

**📱 GitHub Repository:** [https://github.com/codermillat/sharda-university-fee-calculator-usd](https://github.com/codermillat/sharda-university-fee-calculator-usd)

---

## ✨ Key Features

### 🎓 Course Discovery
- **200+ Courses**: Comprehensive coverage of all programmes including Certificate, Graduate, Post Graduate, Integrated, Medical, Dental, Nursing, Pharmacy, Design, Media, and Allied Health Sciences
- **Advanced Search**: Search by course name, abbreviation (e.g., "CSE", "MBA", "BDS"), or school
- **Programme & Stream Filters**: Filter by Programme (Certificate, Graduate, Post Graduate, Integrated) and Stream (Engineering, Management, Law, Medical, Nursing, etc.)
- **13 Schools Covered**: All Sharda University schools including Computing Science & Engineering, Business Studies, Medical Sciences, Dental Sciences, Nursing, Pharmacy, and more

### 💰 Fee Calculation
- **USD Currency**: All fees displayed in United States Dollars for international students
- **Year-wise Breakdown**: Detailed annual fee structure showing tuition, scholarships, and mandatory fees
- **Multiple Scholarship Options**: View all available scholarship percentages (50%, 20%, or No Scholarship) simultaneously
- **Accurate Calculations**: 
  - First Year: USD 500 (Admission & Procedural Charges)
  - Subsequent Years: USD 250 (Annual Administrative Charges)
- **Grand Total**: Complete program cost calculation with scholarship savings

### 📋 Additional Information
- **Hostel Fees**: Complete hostel accommodation pricing (USD 2,350 - USD 4,050/year)
- **Payment Information**: Bank details for USD and INR payments
- **Copy to Clipboard**: WhatsApp-optimized fee breakdown export
- **Mobile Responsive**: Fully functional on all devices

### 🌍 International SEO
- **95+ Countries**: Optimized for students from Bangladesh, Nepal, Sri Lanka, Nigeria, Kenya, Ghana, UAE, Saudi Arabia, Kazakhstan, Uzbekistan, Myanmar, Vietnam, Pakistan, Afghanistan, and more
- **Hreflang Tags**: Country-specific language targeting
- **Structured Data**: Rich snippets for better search visibility
- **Analytics**: Google Analytics GA4 with enhanced measurement

---

## 📖 How to Use

### For Students

1. **Filter Courses** (Optional):
   - Select a **Programme** (Certificate, Graduate, Post Graduate, or Integrated)
   - Select a **Stream** (Engineering, Management, Law, Medical, etc.)

2. **Search for a Course**:
   - Type the course name (e.g., "B.Tech CSE", "MBA", "BDS", "B.Sc Nursing")
   - Or use abbreviations (e.g., "CSE", "AI", "Blockchain")
   - Browse courses grouped by school

3. **Select the Course**:
   - Click on your desired course from the list
   - Or use keyboard navigation (Arrow keys + Enter)

4. **View Fee Breakdowns**:
   - See all available scholarship options (50%, 20%, or No Scholarship)
   - Each panel shows:
     - Year-wise tuition fees
     - Scholarship deductions
     - Mandatory fees (Admission/Other charges)
     - Yearly totals
     - Grand total for entire program

5. **Copy Fee Structure**:
   - Click the **Copy** button on any scholarship panel
   - Paste into WhatsApp, email, or document
   - Formatted for easy sharing

---

## 💻 For Developers

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/codermillat/sharda-university-fee-calculator-usd.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd sharda-university-fee-calculator-usd
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

### Project Structure

```
sharda-university-fee-calculator-usd/
├── src/
│   ├── components/
│   │   ├── CourseSearch.tsx      # Course search and filtering component
│   │   ├── ScholarshipPanel.tsx  # Individual scholarship breakdown panel
│   │   ├── FeeCalculator.tsx     # Main fee calculator component
│   │   └── Header.tsx             # Application header
│   ├── data/
│   │   ├── courses.ts            # 200+ courses with fee structures
│   │   └── fees.ts               # Mandatory fee constants (USD 500, USD 250)
│   ├── utils/
│   │   ├── calcFees.ts          # Core fee calculation logic
│   │   └── analytics.ts          # Google Analytics tracking
│   ├── types.ts                  # TypeScript type definitions
│   ├── App.tsx                   # Root component with footer
│   └── index.tsx                 # Application entry point
├── public/
│   ├── 404.html                  # Custom 404 page
│   └── llms.txt                  # LLM documentation
├── index.html                    # Main HTML with SEO meta tags
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Data Schema

#### Course Interface (`src/types.ts`)

```typescript
export interface Course {
  id: string;                    // Unique identifier (e.g., "btech-cse")
  title: string;                 // Full course name
  group: string;                 // School abbreviation (e.g., "SSCSE")
  durationYears: number;         // Course duration in years
  years: number[];               // Annual tuition fees in USD
  scholarships: number[];        // Available scholarship percentages (e.g., [50, 20])
  notes?: string;                // Optional notes (e.g., "4+1 Years")
}
```

#### Example Course Entry

```typescript
{
  id: 'btech-cse',
  title: 'B.Tech. Computer Science & Engineering (CSE)',
  group: 'SSCSE',
  durationYears: 4,
  years: [4000, 4000, 4000, 4000],  // USD per year
  scholarships: [20],               // 20% scholarship available
}
```

#### Mandatory Fees (`src/data/fees.ts`)

```typescript
export const MANDATORY_FEES = {
  firstYear: 500,        // USD - Admission & Procedural Charges
  subsequentYears: 250, // USD - Annual Administrative Charges
};
```

### Adding or Updating Courses

1. Open `src/data/courses.ts`
2. Add or modify course entries following the `Course` interface
3. Ensure fees are in USD
4. Update scholarship array based on eligibility
5. Save and test locally

### Key Components

- **CourseSearch**: Handles course filtering, search, and selection
- **ScholarshipPanel**: Displays fee breakdown for a specific scholarship percentage
- **FeeCalculator**: Main orchestrator component
- **calcFees**: Core calculation utilities (formatCurrency, generateCopyText)

---

## 🎯 Course Coverage

### Programme Categories

- ✅ **Certificate Courses**: English Proficiency (6 months, 1 year)
- ✅ **Graduate Courses**: B.Tech (20+ specializations), BBA (7 specializations), B.Sc (20+ specializations), BCA, B.Com, B.A, B.Design, BPT, B.Sc Nursing, B.Sc Allied Health Sciences, B.Pharm
- ✅ **Post Graduate Courses**: MBA (8 specializations), M.Tech, M.Sc (15+ specializations), MCA, M.Com, M.A, M.Design, MPT, M.Sc Nursing, M.Pharm, LL.M
- ✅ **Integrated Courses**: B.B.A. LL.B., B.A. LL.B.
- ✅ **Medical & Dental**: BDS, MDS

### Scholarship Structure

- **50% Scholarship**: B.Sc Computer Science, B.Sc IT, MCA, M.Sc, M.Tech, B.Com, M.Com, B.A, M.A, Ph.D
- **20% Scholarship**: B.Tech (all specializations), BBA (all specializations), MBA (all specializations), BCA, B.Sc Nursing, BPT, Design courses, Media courses
- **No Scholarship**: BDS, MDS, Post Basic B.Sc Nursing, M.Sc Nursing, B.Pharm, D.Pharm, Certificate courses

---

## 🌍 International Students

### Target Countries

Sharda University welcomes students from **95+ countries**, including:

- **South Asia**: Bangladesh, Nepal, Sri Lanka, Pakistan, Afghanistan
- **Africa**: Nigeria, Kenya, Ghana, Tanzania, and more
- **Middle East**: UAE, Saudi Arabia, and more
- **Central Asia**: Kazakhstan, Uzbekistan, and more
- **Southeast Asia**: Myanmar, Vietnam, and more

### Fee Structure

- **Admission Fee**: USD 500 (one-time, first year)
- **Annual Charges**: USD 250 (recurring, from 2nd year onwards)
- **Tuition Fees**: Varies by course (see calculator)
- **Hostel Fees**: USD 2,350 - USD 4,050/year (optional)
- **Hostel Security Deposit**: USD 200-300 (refundable, one-time)

### Payment Methods

- **USD Payments**: ICICI Bank Account No. 025406000017
- **INR Payments**: ICICI Bank Account No. 025405005507
- **Swift Code**: ICICINBBCTS
- **Contact**: su.finance.info@sharda.ac.in, global@sharda.ac.in

---

## 🔧 Technology Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS (via CDN)
- **Analytics**: Google Analytics GA4
- **Hosting**: Vercel
- **Testing**: Vitest

---

## 📊 SEO & Analytics

### SEO Features

- ✅ Comprehensive meta tags (title, description, keywords)
- ✅ Open Graph and Twitter Card tags
- ✅ Structured data (JSON-LD) for:
  - WebApplication
  - EducationalOrganization
  - FAQPage
  - Course
  - HowTo
  - CollegeOrUniversity
- ✅ Hreflang tags for 15+ target countries
- ✅ Canonical URLs
- ✅ Mobile-optimized meta tags

### Analytics

- Google Analytics GA4 with enhanced measurement
- Page view tracking
- Course search tracking
- Scholarship view tracking
- External link click tracking
- Copy button usage tracking

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚠️ Disclaimer

This is an **unofficial fee calculator** created to help prospective international students estimate their education costs at Sharda University. 

- All fees are **indicative** and subject to change
- Fees are displayed in **USD** for international students
- Scholarship eligibility is based on academic performance (GPA)
- For official and final fee structures, admission procedures, and scholarship details, please refer to the [official Sharda University website](https://www.sharda.ac.in/)
- For admissions, visit [global.sharda.ac.in](https://global.sharda.ac.in/)

---

## 📞 Contact & Support

- **University Contact**: global@sharda.ac.in
- **Phone**: +91-8448896176, +91-8800998881
- **Official Website**: [www.sharda.ac.in](https://www.sharda.ac.in/)
- **Application Portal**: [global.sharda.ac.in](https://global.sharda.ac.in/)

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**MD MILLAT HOSEN** ([@codermillat](https://github.com/codermillat))

- GitHub: [codermillat](https://github.com/codermillat)
- Project: [Sharda University Fee Calculator USD](https://github.com/codermillat/sharda-university-fee-calculator-usd)

---

## 🙏 Acknowledgments

- Sharda University for providing comprehensive course and fee information
- All international students who use this calculator
- Open source community for amazing tools and libraries

---

**⭐ If you find this project helpful, please consider giving it a star on GitHub!**
