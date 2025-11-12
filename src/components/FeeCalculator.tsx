import React, { useState, useEffect } from 'react';
import { Course } from '../../types';
import CourseSearch from './CourseSearch';
import ScholarshipPanel from './ScholarshipPanel';
import { trackCourseSelection, trackScholarshipView, trackExternalLink, trackSocialLink } from '../utils/analytics';

// School full names mapping
const schoolNames: { [key: string]: string } = {
  'SSCSE': 'Sharda School of Computing Science & Engineering',
  'SSBT': 'Sharda School of Bio-Science & Technology',
  'SSES': 'Sharda School of Engineering & Science',
  'SBS': 'Sharda School of Business Studies',
  'SHSS': 'Sharda School of Humanities & Social Sciences',
  'SOL': 'Sharda School of Law',
  'SDAP': 'Sharda School of Design, Architecture & Planning',
  'SMFE': 'Sharda School of Media, Film and Entertainment',
  'SMSR': 'Sharda School of Medical Sciences & Research',
  'SNSR': 'Sharda School of Nursing Science & Research',
  'SDS': 'Sharda School of Dental Sciences',
  'SAHS': 'Sharda School of Allied Health Sciences',
  'SSP': 'Sharda School of Pharmacy',
};

const FeeCalculator: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    // Track course selection
    trackCourseSelection(course.title, course.id, course.group);
  };

  const handleClear = () => {
    setSelectedCourse(null);
  };

  // Get all scholarship options for the course (including "No Scholarship")
  const getAllScholarshipOptions = (course: Course): number[] => {
    const options = [0]; // Always include "No Scholarship"
    // Add all scholarship percentages
    course.scholarships.forEach(scholarship => {
      if (!options.includes(scholarship)) {
        options.push(scholarship);
      }
    });
    // Sort in descending order (50, 30, 25, 20, 0)
    return options.sort((a, b) => b - a);
  };

  // Track scholarship views when course is selected
  useEffect(() => {
    if (selectedCourse) {
      const scholarshipOptions = getAllScholarshipOptions(selectedCourse);
      scholarshipOptions.forEach(scholarship => {
        trackScholarshipView(selectedCourse.title, scholarship);
      });
    }
  }, [selectedCourse]);

  const scholarshipOptions = selectedCourse ? getAllScholarshipOptions(selectedCourse) : [];
  const numCards = scholarshipOptions.length;

  const handleExternalLinkClick = (url: string, linkText: string) => {
    trackExternalLink(url, linkText);
  };

  const handleSocialLinkClick = (platform: string, url: string) => {
    trackSocialLink(platform, url);
  };

  return (
    <main className="w-full" role="main">
            {/* Course Search Section - Wider container */}
            <section aria-label="Course Search and Filter" className="flex justify-center">
              <div className="w-full max-w-[1400px]">
          <CourseSearch 
            onCourseSelect={handleCourseSelect} 
            selectedCourse={selectedCourse}
            onClear={handleClear}
          />
        </div>
      </section>

      {/* Course Selection Prompt - Centered */}
      {!selectedCourse && (
        <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
          <div className="text-center text-slate-500 px-4 w-full max-w-[1400px]">
            <p className="text-2xl mb-2">🎓</p>
            <p className="text-sm sm:text-base md:text-lg mb-4">
              Please select a course to see the detailed fee breakdown.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              Calculate fees for B.Tech CSE, BDS, B.Sc Nursing, BBA, MBA and other courses at Sharda University. 
              Get instant fee breakdown with scholarship options for international students worldwide.
            </p>
          </div>
        </div>
      )}

      {/* Fee Breakdown - Centered */}
      {selectedCourse && (
              <section aria-label={`Fee structure for ${selectedCourse.title}`} className="flex flex-col items-center mt-6 sm:mt-8 md:mt-12 animate-fade-in w-full px-4">
                <div id="fee-structure" className="text-center mb-4 sm:mb-6 md:mb-8 w-full scroll-mt-24">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 sm:mb-3 md:mb-4 text-slate-800">
            Fee Structure for: <span className="text-blue-600">{selectedCourse.title}</span>
          </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-500">
              Duration: {selectedCourse.durationYears} Years · School: {schoolNames[selectedCourse.group] || selectedCourse.group}
            </p>
          </div>

          {/* Scholarship Panels Grid - Centered */}
          <div className="flex justify-center w-full">
            <div className={`grid gap-3 sm:gap-4 md:gap-6 ${
              numCards === 1 ? 'grid-cols-1 max-w-md' :
              numCards === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl'
            } w-full`}>
              {scholarshipOptions.map(scholarshipPercent => (
              <ScholarshipPanel
                key={scholarshipPercent}
                course={selectedCourse}
                scholarship={scholarshipPercent}
              />
            ))}
          </div>
        </div>

          {/* Additional SEO Content - Centered */}
          <aside aria-label="Additional Information" className="flex justify-center mt-8 w-full">
            <div className="w-full max-w-[1400px] p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
              <p className="mb-2">
                <strong>Ready to Apply?</strong>{' '}
                <a 
                  href="https://global.sharda.ac.in/?utm_source=studyatsharda_youtube&utm_medium=StudyAtShardaBD&utm_campaign=SU_Admissions_2025&utm_content=organic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline font-semibold"
                  onClick={() => handleExternalLinkClick('https://global.sharda.ac.in/?utm_source=studyatsharda_youtube&utm_medium=StudyAtShardaBD&utm_campaign=SU_Admissions_2025&utm_content=organic', 'Apply Now - Direct Application')}
                >
                  Apply directly to Sharda University
                </a>
                {' '}or get support via{' '}
                <a 
                  href="https://wa.me/918800996151" 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  className="text-green-600 hover:underline font-semibold"
                  onClick={() => handleSocialLinkClick('WhatsApp', 'https://wa.me/918800996151')}
                >
                  WhatsApp: +918800996151
                </a>
                .
              </p>
              <p>
                Explore career opportunities after B.Tech Computer Science, B.Sc Computer Science future scope, and learn about 
                high-paying jobs in software development, data science, AI/ML, cyber security, and cloud computing. 
                Sharda University offers world-class education with industry-aligned curriculum and excellent placement opportunities 
                for international students worldwide.
              </p>
            </div>
          </aside>
        </section>
      )}

      {/* SEO-friendly visible content for search engines - Centered at bottom */}
      <section aria-label="About Sharda University Fee Calculator" className="flex justify-center mt-12 mb-6">
        <div className="w-full max-w-[1400px] px-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h2 className="text-xl font-bold text-slate-800 mb-3 text-center">Sharda University Fee & Scholarship Calculator for International Students</h2>
            <p className="text-sm text-slate-700 mb-3">
              Calculate Sharda University fees in USD for B.Tech Computer Science Engineering (CSE), BDS, B.Sc Nursing, BBA, MBA, and other courses. 
              Get detailed year-wise fee breakdown with scholarship calculator. Check admission process, course fees, and scholarship eligibility 
              for international students worldwide. Explore career options after B.Tech CSE, B.Sc Computer Science future scope, and high paying jobs 
              after computer science engineering. Find best college in Greater Noida for B.Tech, Sharda University admission process 2025, 
              and scholarship information for global students.
            </p>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Sharda University</strong> - No.1 University in India with the highest number of international students. Located in Greater Noida, Uttar Pradesh, 
              Sharda University is NAAC A+ Accredited and ranked among the Top 4% universities in Asia by QS University Rankings. With students from 95+ countries, 
              300+ global academic partnerships, and 30,000+ successful alumni worldwide, Sharda University offers a truly international learning environment. 
              The university offers over 135+ UGC recognized programs including B.Tech in Computer Science Engineering, BDS, B.Sc Nursing, BBA, MBA, Pharmacy, and many more. 
              This fee calculator helps you estimate the total cost of education including tuition fees, admission fees, and other mandatory charges. 
              You can also calculate potential scholarships (up to 50% available) based on your GPA and see how much you can save on your education costs.
            </p>
            <p className="text-sm text-slate-700 mb-3">
              Understanding the fee structure is crucial for planning your education abroad. Our calculator provides detailed breakdowns for each 
              year of your program, showing tuition fees, scholarship discounts, admission fees, and other charges. This helps you make informed 
              decisions about your education investment and plan your finances accordingly. Whether you're interested in computer science, medicine, 
              business, or nursing, this tool helps you compare costs and scholarship options for different programs.
            </p>
            <p className="text-sm text-slate-700 mb-3">
              Use this planner to review Sharda University B.Tech CSE fees, BDS fees, Sharda University BSc Nursing costs, and other course fee structures. 
              It supports international students researching living costs, Sharda University Greater Noida hostel fees, and study opportunities with scholarship options.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Key Features:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>B.Tech CSE Fee Calculator with Scholarship Options</li>
                  <li>BDS Fee Structure for International Students</li>
                  <li>B.Sc Nursing Fees and Admission Process</li>
                  <li>BBA and MBA Course Fees</li>
                  <li>Year-wise Fee Breakdown in USD</li>
                  <li>Grand Total Calculation</li>
                  <li>Scholarship Comparison Tool</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Additional Services:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Scholarship Calculator based on GPA</li>
                  <li>Career Guidance for Computer Science Students</li>
                  <li>International Student Admission Support</li>
                  <li>Copy Fee Breakdown to Clipboard</li>
                  <li>Compare Multiple Scholarship Options</li>
                  <li>Mobile-Friendly Interface</li>
                  <li>USD Currency Format</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h3 className="font-semibold text-slate-800 mb-2">About Sharda University</h3>
              <p className="text-sm text-slate-700 mb-2">
                <strong>Sharda University</strong> is India's truly global university, recognized as No.1 in India with the highest number of international students. 
                With NAAC A+ accreditation and QS University Rankings Asia placing it in the Top 4% universities in Asia, Sharda University offers world-class education 
                on a 63-acre campus in Greater Noida. The university hosts 17,000+ students from 95+ countries, 1,100+ global faculty members, and maintains 
                300+ global academic partnerships. For international students, Sharda University offers up to 50% scholarship based on academic performance, 
                with 7,515 students currently studying with scholarships worth 44.5 Million USD.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3 text-xs">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-bold text-blue-700">95+</div>
                  <div className="text-slate-600">Countries</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="font-bold text-green-700">300+</div>
                  <div className="text-slate-600">Global Partnerships</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-bold text-purple-700">30,000+</div>
                  <div className="text-slate-600">Alumni Worldwide</div>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <div className="font-bold text-orange-700">63 Acres</div>
                  <div className="text-slate-600">Campus Size</div>
                </div>
              </div>
              <p className="text-sm text-slate-700 mb-2">
                <strong>Key Achievements:</strong> Ranked 59th in World University Rankings by Times Higher Education, 86th in NIRF University Category, 
                3rd in North India for Engineering, and 14th overall in Research. The university features 1800+ bedded super-specialty teaching and research hospital, 
                NVIDIA DGX H100 Super Computer for AI research, and state-of-the-art infrastructure including AC classrooms, hi-tech labs, and comprehensive sports facilities.
              </p>
              <p className="text-sm text-slate-700">
                The university offers programs across 14 schools in Engineering, Management, Basic Science, Media, Law, Architecture, Design, Medical, Dental, 
                Nursing, Pharmacy, Allied Health, Humanities, and Education. With 600+ MNCs visiting for placements and highest package of 1.62 Cr. in 2024-25, 
                Sharda University provides excellent career opportunities for international students.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Computer Science Scope & Careers</h3>
                <p className="mb-2">
                  Discover computer science scope in future industries, career options after B.Tech Computer Science, and best career options for computer science students.
                  Learn what to do after B.Tech in Computer Science, the top jobs after B.Tech Computer Science, and how to secure high-paying roles in AI, data science, and cyber security.
                  Explore career opportunities and how a degree from Sharda University can enhance your job prospects globally.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Career opportunities after B.Tech Computer Science</li>
                  <li>Best career options after B.Tech CSE for international students</li>
                  <li>Steps to get high paying jobs after B.Tech</li>
                  <li>Guidance on internships, placements, and global tech roles</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Popular Course Searches</h3>
                <p className="mb-2">
                  Find detailed guides covering bsc computer science course details, b tech computer science course details, and bsc computer science future scope.
                  Compare bsc computer science subjects list, bsc computer science course details 2025, and bsc computer science 1st year classes to plan your academic journey.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Sharda University B.Tech CSE fees & course outline</li>
                  <li>B.Sc Computer Science subjects list and syllabus roadmap</li>
                  <li>M.Sc Computer Science course details for specialization</li>
                  <li>Information about Sharda University B.Pharm and paramedical courses</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-sm text-slate-700 space-y-2">
              <h3 className="font-semibold text-slate-800">Hostel Accommodation Fees (Annual)</h3>
              <div className="bg-slate-50 p-3 rounded-lg mb-3">
                <p className="font-semibold mb-2">Girls Hostel Options (All include Non-Veg Food):</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>2 Seater AC Room (Attached Washroom, Without Balcony) - $4,050/year</li>
                  <li>2 Seater Non-AC Room (Attached Washroom, Without Balcony) - $3,050/year</li>
                  <li>3 Seater AC Room (Attached Washroom, With Balcony) - $3,350/year</li>
                  <li>3 Seater Non-AC Room (Attached Washroom, With Balcony) - $2,550/year</li>
                </ul>
                <p className="font-semibold mb-2 mt-3">Boys Hostel Options (All include Non-Veg Food):</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>2 Seater AC Room (Attached Washroom, Without Balcony) - $4,050/year</li>
                  <li>2 Seater AC Room - $3,300/year</li>
                  <li>2 Seater Non-AC Room (Attached Washroom, Without Balcony) - $3,050/year</li>
                  <li>2 Seater Non-AC Room - $2,500/year</li>
                  <li>3 Seater AC Room - $3,100/year</li>
                  <li>3 Seater Non-AC Room - $2,350/year</li>
                </ul>
                <p className="text-xs mt-2 text-slate-600">
                  <strong>Security Deposit (One-time, Refundable):</strong> $300 for AC rooms and/or rooms with attached washroom; $200 for Non-AC rooms without attached washroom. 
                  Complimentary laundry service (20 washes, 8kg each) available. Room allocation on first-come-first-serve basis. For more details, visit the university website.
                </p>
              </div>
              <h3 className="font-semibold text-slate-800 mt-4">Admissions & Support for International Students</h3>
              <p>
                Stay updated on Sharda University admission process 2025, Sharda University BDS admission guidelines, and Sharda University BSc Nursing placement records.
                Explore cost of living in Noida for students, Sharda University Greater Noida hostel options, and how to study abroad with scholarships.
                Learn how to get admission in Indian universities and colleges as an international student, including step-by-step procedures, visa requirements, and scholarship opportunities.
              </p>
              <p>
                <strong>Ready to start your journey?</strong>{' '}
                <a 
                  href="https://global.sharda.ac.in/?utm_source=studyatsharda_youtube&utm_medium=StudyAtShardaBD&utm_campaign=SU_Admissions_2025&utm_content=organic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline font-semibold"
                  onClick={() => handleExternalLinkClick('https://global.sharda.ac.in/?utm_source=studyatsharda_youtube&utm_medium=StudyAtShardaBD&utm_campaign=SU_Admissions_2025&utm_content=organic', 'Apply Now - Direct Application')}
                >
                  Apply directly to Sharda University
                </a>
                {' '}or get instant support via{' '}
                <a 
                  href="https://wa.me/918800996151" 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  className="text-green-600 hover:underline font-semibold"
                  onClick={() => handleSocialLinkClick('WhatsApp', 'https://wa.me/918800996151')}
                >
                  WhatsApp: +918800996151
                </a>
                {' '}or call{' '}
                <a 
                  href="tel:+918448896176" 
                  className="text-blue-600 hover:underline font-semibold"
                >
                  +91-8448896176
                </a>
                {' '}/{' '}
                <a 
                  href="tel:+918800998881" 
                  className="text-blue-600 hover:underline font-semibold"
                >
                  +91-8800998881
                </a>
                .
              </p>
              <p>
                Sharda University provides comprehensive support for international students covering application procedures, visa processing, accommodation, and settling into campus life. 
                The university offers credit transfer programs, semester exchange programs at zero tuition fee, and pathways to global degrees through 300+ partner universities.
              </p>
              
              <h3 className="font-semibold text-slate-800 mt-6 mb-3">Fee Payment Information</h3>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-700 mb-3">
                  <strong>Important:</strong> After remitting funds, students must email payment details (System ID, Student Name, Program, Amount, Swift Advice/Receipt) to both{' '}
                  <a href="mailto:su.finance.info@sharda.ac.in" className="text-blue-600 hover:underline">su.finance.info@sharda.ac.in</a> and{' '}
                  <a href="mailto:global@sharda.ac.in" className="text-blue-600 hover:underline">global@sharda.ac.in</a> for payment to be credited to their account.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-2">Payment in USD</h4>
                    <ul className="space-y-1 text-slate-600">
                      <li><strong>Bank:</strong> ICICI Bank</li>
                      <li><strong>Account No:</strong> 025406000017</li>
                      <li><strong>Swift Code:</strong> ICICINBBCTS</li>
                      <li><strong>IFSC Code:</strong> ICIC0000254</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-2">Payment in INR</h4>
                    <ul className="space-y-1 text-slate-600">
                      <li><strong>Bank:</strong> ICICI Bank</li>
                      <li><strong>Account No:</strong> 025405005507</li>
                      <li><strong>Swift Code:</strong> ICICINBBCTS</li>
                      <li><strong>IFSC Code:</strong> ICIC0000254</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FeeCalculator;
