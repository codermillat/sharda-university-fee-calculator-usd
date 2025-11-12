import { Course } from '../../types';
import { MANDATORY_FEES } from '../../data/fees';

/**
 * Formats a number into the US Dollar currency format (e.g., $1,234).
 * @param amount The number to format.
 * @returns The formatted currency string.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

/**
 * Generates the detailed, WhatsApp-optimized fee breakdown text for copying.
 * @param course The selected course object.
 * @param scholarshipPercentage The scholarship percentage to apply (e.g., 50 for 50%).
 * @returns A formatted string ready for clipboard.
 */
export const generateCopyText = (course: Course, scholarshipPercentage: number): string => {
  let text = `*Estimate for: ${course.title}*\n`;
  text += `*Duration:* ${course.durationYears} years\n`;
  text += `*Option:* ${scholarshipPercentage > 0 ? `${scholarshipPercentage}% Scholarship` : 'No Scholarship'}\n\n`;

  let grandTotalWithoutScholarship = 0;
  let grandTotalWithScholarship = 0;

  course.years.forEach((yearTuition, index) => {
    const year = index + 1;
    const scholarshipAmount = (yearTuition * scholarshipPercentage) / 100;
    const netTuition = yearTuition - scholarshipAmount;
    const mandatoryFee = year === 1 ? MANDATORY_FEES.firstYear : MANDATORY_FEES.subsequentYears;

    const yearTotalWithScholarship = netTuition + mandatoryFee;
    const yearTotalWithoutScholarship = yearTuition + mandatoryFee;

    grandTotalWithScholarship += yearTotalWithScholarship;
    grandTotalWithoutScholarship += yearTotalWithoutScholarship;

    text += `*Year ${year}*\n`;
    text += `Tuition Fee: ${formatCurrency(yearTuition)}\n`;
    if (scholarshipPercentage > 0) {
      text += `Scholarship (${scholarshipPercentage}%): –${formatCurrency(scholarshipAmount)}\n`;
      text += `Net Tuition: ${formatCurrency(netTuition)}\n`;
    }
    if (year === 1) {
      text += `Admission Fee: ${formatCurrency(mandatoryFee)} (Including Provisional Admission Fee, Visa letter/Bonafide Letter Charges, 1st year Examination Fee, 1st year Registration Fee, 1st year Medical Insurance Charges, 1st year Medical Check up Charges, AIU certification /equivalence assistance only, FRRO/Police verification/Visa Extension Assistance only)\n`;
    } else {
      text += `Other Fees: ${formatCurrency(mandatoryFee)} (Registration Fee, Examination Fee, Medical Insurance Renewal Charges, FRRO/Visa Extension Assistance)\n`;
    }
    text += `✅ *Total Year ${year} = ${formatCurrency(yearTotalWithScholarship)}*\n\n`;
  });

  text += '---\n\n';
  text += `*GRAND TOTAL (All ${course.durationYears} Years)*\n`;
  text += `*Total Fees: ${formatCurrency(grandTotalWithScholarship)}*\n`;
  if (scholarshipPercentage > 0) {
    text += `\n*Savings with ${scholarshipPercentage}% Scholarship: ${formatCurrency(grandTotalWithoutScholarship - grandTotalWithScholarship)}*\n`;
    text += `Without scholarship: ${formatCurrency(grandTotalWithoutScholarship)}\n`;
  }

  return text;
};
