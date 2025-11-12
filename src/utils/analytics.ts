/**
 * Google Analytics utility functions for tracking user interactions and leads
 * Optimized for GA4 with enhanced measurement and conversion tracking
 */

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        [key: string]: any;
      }
    ) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = 'G-0ZTRBLS2JV';

// User engagement tracking
let engagementStartTime: number | null = null;
let scrollDepthsTracked: Set<number> = new Set();
let timeOnPageInterval: NodeJS.Timeout | null = null;
let leadScore: number = 0;
let sessionActions: string[] = [];
let maxScrollDepth: number = 0;
let coursesViewed: Set<string> = new Set();
let scholarshipPanelsViewed: number = 0;
let feeCopies: number = 0;
let externalLinkClicks: number = 0;

/**
 * Check if Google Analytics is loaded
 */
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Track page view with enhanced metrics
 */
export const trackPageView = (path: string, title?: string): void => {
  if (isGALoaded()) {
    engagementStartTime = Date.now();
    scrollDepthsTracked.clear();
    maxScrollDepth = 0;
    sessionActions.push('page_view');
    
    // Get UTM parameters for campaign tracking
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmContent = urlParams.get('utm_content');
    
    window.gtag!('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
      // Campaign tracking
      ...(utmSource && { campaign_source: utmSource }),
      ...(utmMedium && { campaign_medium: utmMedium }),
      ...(utmCampaign && { campaign_name: utmCampaign }),
      ...(utmContent && { campaign_content: utmContent }),
    });

    // Track page view event with enhanced data
    window.gtag!('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
      // Traffic source tracking
      ...(utmSource && { source: utmSource }),
      ...(utmMedium && { medium: utmMedium }),
      ...(utmCampaign && { campaign: utmCampaign }),
      ...(utmContent && { content: utmContent }),
      // Referrer tracking
      referrer: document.referrer || 'direct',
    });

    // Start time on page tracking
    startTimeOnPageTracking();
    // Start scroll depth tracking
    startScrollDepthTracking();
    
    // Track traffic source
    trackTrafficSource();
  }
};

/**
 * Track traffic source and medium
 */
const trackTrafficSource = (): void => {
  const referrer = document.referrer;
  let source = 'direct';
  let medium = 'none';
  
  if (referrer) {
    try {
      const referrerUrl = new URL(referrer);
      const hostname = referrerUrl.hostname;
      
      // Social media sources
      if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
        source = 'facebook';
        medium = 'social';
      } else if (hostname.includes('instagram.com')) {
        source = 'instagram';
        medium = 'social';
      } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        source = 'youtube';
        medium = 'social';
      } else if (hostname.includes('tiktok.com')) {
        source = 'tiktok';
        medium = 'social';
      } else if (hostname.includes('linkedin.com')) {
        source = 'linkedin';
        medium = 'social';
      } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        source = 'twitter';
        medium = 'social';
      } else if (hostname.includes('whatsapp.com')) {
        source = 'whatsapp';
        medium = 'messaging';
      } else if (hostname.includes('google.com') || hostname.includes('google.')) {
        source = 'google';
        medium = 'organic';
      } else if (hostname.includes('bing.com')) {
        source = 'bing';
        medium = 'organic';
      } else if (hostname.includes('sharda.ac.in') || hostname.includes('shardauniversity.org')) {
        source = 'sharda_official';
        medium = 'referral';
      } else {
        source = hostname;
        medium = 'referral';
      }
    } catch (e) {
      source = 'unknown';
      medium = 'referral';
    }
  }
  
  // Check for UTM parameters
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  
  if (utmSource) {
    source = utmSource;
    medium = utmMedium || medium;
  }
  
  if (isGALoaded()) {
    window.gtag!('event', 'traffic_source', {
      event_category: 'Traffic',
      source: source,
      medium: medium,
      referrer: referrer || 'direct',
    });
    
    window.gtag!('set', 'user_properties', {
      traffic_source: source,
      traffic_medium: medium,
    });
  }
};

/**
 * Track custom event with GA4 format
 */
export const trackEvent = (
  eventName: string,
  eventParams?: {
    [key: string]: any;
  }
): void => {
  if (isGALoaded()) {
    window.gtag!('event', eventName, {
      ...eventParams,
      timestamp: Date.now(),
    });
  }
};

/**
 * Calculate lead score based on user actions
 */
const calculateLeadScore = (): number => {
  let score = 0;
  
  // Course selection (high value)
  score += coursesViewed.size * 10;
  
  // Scholarship panel views (indicates serious interest)
  score += scholarshipPanelsViewed * 5;
  
  // Fee breakdown copies (very high intent)
  score += feeCopies * 15;
  
  // External link clicks to official site (conversion intent)
  score += externalLinkClicks * 20;
  
  // Scroll depth (engagement)
  score += Math.floor(maxScrollDepth / 10);
  
  // Time on page (if > 2 minutes, add points)
  if (engagementStartTime) {
    const timeOnPage = Math.floor((Date.now() - engagementStartTime) / 1000);
    if (timeOnPage > 120) score += 10;
    if (timeOnPage > 300) score += 15;
  }
  
  return Math.min(score, 100); // Cap at 100
};

/**
 * Calculate session quality based on engagement
 */
const calculateSessionQuality = (): 'high' | 'medium' | 'low' => {
  const actions = sessionActions.length;
  const hasCourseSelection = coursesViewed.size > 0;
  const hasFeeCopy = feeCopies > 0;
  const hasExternalClick = externalLinkClicks > 0;
  const scrollDepth = maxScrollDepth;
  
  if ((hasCourseSelection && hasFeeCopy) || hasExternalClick || scrollDepth >= 75) {
    return 'high';
  } else if (hasCourseSelection || scrollDepth >= 50 || actions >= 3) {
    return 'medium';
  }
  return 'low';
};

/**
 * Update lead score and session quality
 */
const updateLeadMetrics = (): void => {
  leadScore = calculateLeadScore();
  const sessionQuality = calculateSessionQuality();
  
  if (isGALoaded()) {
    window.gtag!('set', 'user_properties', {
      lead_score: leadScore,
      session_quality: sessionQuality,
      courses_viewed_count: coursesViewed.size,
      scholarship_panels_viewed: scholarshipPanelsViewed,
      fee_copies_count: feeCopies,
      external_clicks_count: externalLinkClicks,
      max_scroll_depth: maxScrollDepth,
    });
    
    // Set custom dimensions
    window.gtag!('config', GA_MEASUREMENT_ID, {
      custom_map: {
        'dimension5': leadScore.toString(),
        'dimension6': sessionQuality,
      },
    });
  }
};

/**
 * Track conversion/lead generation event with enhanced tracking
 */
export const trackConversion = (
  conversionType: 'course_selection' | 'fee_copy' | 'external_link' | 'social_click' | 'contact' | 'apply_now',
  value?: number,
  currency: string = 'USD'
): void => {
  if (isGALoaded()) {
    // Calculate conversion value based on type
    let conversionValue = value;
    if (!conversionValue) {
      switch (conversionType) {
        case 'apply_now':
          conversionValue = 100; // Highest value - direct application
          break;
        case 'external_link':
          conversionValue = 75; // High value - visiting official site
          break;
        case 'fee_copy':
          conversionValue = 50; // Medium-high value - saving fee info
          break;
        case 'course_selection':
          conversionValue = 25; // Medium value - showing interest
          break;
        case 'social_click':
          conversionValue = 15; // Lower value - social engagement
          break;
        default:
          conversionValue = 10;
      }
    }
    
    // Track conversion event
    window.gtag!('event', 'conversion', {
      conversion_type: conversionType,
      value: conversionValue,
      currency: currency,
      send_to: GA_MEASUREMENT_ID,
      lead_score: leadScore,
      session_quality: calculateSessionQuality(),
    });

    // Track as lead event with enhanced data
    window.gtag!('event', 'generate_lead', {
      currency: currency,
      value: conversionValue,
      lead_type: conversionType,
      lead_score: leadScore,
      session_quality: calculateSessionQuality(),
      courses_viewed: coursesViewed.size,
      engagement_level: leadScore >= 50 ? 'high' : leadScore >= 25 ? 'medium' : 'low',
    });
    
    // Track as purchase event for ecommerce (for better conversion tracking)
    if (conversionType === 'apply_now' || conversionType === 'external_link') {
      window.gtag!('event', 'purchase', {
        transaction_id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        value: conversionValue,
        currency: currency,
        items: [{
          item_id: conversionType,
          item_name: conversionType.replace('_', ' ').toUpperCase(),
          item_category: 'Lead',
          price: conversionValue,
          quantity: 1,
        }],
      });
    }
    
    updateLeadMetrics();
  }
};

/**
 * Track course selection (HIGH VALUE LEAD EVENT)
 */
export const trackCourseSelection = (courseTitle: string, courseId: string, school: string): void => {
  const courseCategory = getCourseCategory(courseTitle);
  
  // Track course view
  coursesViewed.add(courseId);
  sessionActions.push('course_selection');
  
  trackEvent('course_selected', {
    event_category: 'Course Selection',
    event_label: courseTitle,
    course_id: courseId,
    course_title: courseTitle,
    school: school,
    course_category: courseCategory,
    // Custom dimensions
    user_type: 'prospective_student',
    course_category_dimension: courseCategory,
    engagement_level: 'high',
    courses_viewed_count: coursesViewed.size,
  });

  // Track as conversion/lead
  trackConversion('course_selection', undefined, 'USD');

  // Set user properties
  if (isGALoaded()) {
    window.gtag!('set', 'user_properties', {
      interested_course: courseTitle,
      interested_school: school,
      course_category: courseCategory,
      courses_viewed: Array.from(coursesViewed),
    });
  }
  
  updateLeadMetrics();
};

/**
 * Helper to determine course category
 */
const getCourseCategory = (courseTitle: string): string => {
  const title = courseTitle.toLowerCase();
  if (title.includes('b.tech') || title.includes('btech')) return 'Engineering';
  if (title.includes('mbbs') || title.includes('medical')) return 'Medical';
  if (title.includes('nursing')) return 'Nursing';
  if (title.includes('bba') || title.includes('mba') || title.includes('business')) return 'Business';
  if (title.includes('b.sc') || title.includes('bsc')) return 'Science';
  if (title.includes('pharmacy') || title.includes('pharm')) return 'Pharmacy';
  if (title.includes('law') || title.includes('llb')) return 'Law';
  return 'Other';
};

/**
 * Track school selection change
 */
export const trackSchoolSelection = (school: string): void => {
  trackEvent('school_selected', {
    event_category: 'Filter',
    event_label: school,
    school: school,
    engagement_level: 'medium',
  });
};

/**
 * Track course search with search term analysis
 */
export const trackCourseSearch = (searchQuery: string): void => {
  if (searchQuery.length > 2) {
    const searchLength = searchQuery.length;
    const courseCategory = getCourseCategory(searchQuery);
    
    trackEvent('search', {
      search_term: searchQuery,
      search_length: searchLength,
      course_category: courseCategory,
      engagement_level: 'medium',
    });
  }
};

/**
 * Track scholarship panel view (HIGH VALUE - indicates serious interest)
 */
export const trackScholarshipView = (courseTitle: string, scholarshipPercent: number): void => {
  const scholarshipLabel = scholarshipPercent > 0 ? `${scholarshipPercent}% Scholarship` : 'No Scholarship';
  
  scholarshipPanelsViewed++;
  sessionActions.push('scholarship_view');
  
  trackEvent('view_item', {
    item_name: courseTitle,
    item_category: 'Course Fee Breakdown',
    item_variant: scholarshipLabel,
    scholarship_percentage: scholarshipPercent,
    course_title: courseTitle,
    engagement_level: 'high',
    scholarship_interest: scholarshipPercent > 0 ? 'yes' : 'no',
    scholarship_panels_viewed: scholarshipPanelsViewed,
  });

  // Track scholarship interest dimension
  if (isGALoaded()) {
    window.gtag!('set', 'user_properties', {
      scholarship_interest: scholarshipPercent > 0 ? 'yes' : 'no',
      max_scholarship_viewed: scholarshipPercent,
      scholarship_panels_viewed: scholarshipPanelsViewed,
    });
  }
  
  updateLeadMetrics();
};

/**
 * Track copy button click (HIGH VALUE CONVERSION - user is saving info)
 */
export const trackCopyButton = (courseTitle: string, scholarshipPercent: number): void => {
  const scholarshipLabel = scholarshipPercent > 0 ? `${scholarshipPercent}% Scholarship` : 'No Scholarship';
  
  // Calculate estimated course value for conversion tracking
  const courseCategory = getCourseCategory(courseTitle);
  
  feeCopies++;
  sessionActions.push('fee_copy');
  
  trackEvent('fee_breakdown_copied', {
    event_category: 'Copy Action',
    event_label: `${courseTitle} - ${scholarshipLabel}`,
    course_title: courseTitle,
    scholarship_percentage: scholarshipPercent,
    course_category: courseCategory,
    engagement_level: 'very_high',
    action_type: 'save_information',
    fee_copies_count: feeCopies,
  });

  // Track as conversion/lead (copying fee breakdown indicates high intent)
  trackConversion('fee_copy', undefined, 'USD');

  // Track as engagement event
  trackEvent('share', {
    method: 'copy_to_clipboard',
    content_type: 'fee_breakdown',
    course_title: courseTitle,
  });
  
  updateLeadMetrics();
};

/**
 * Track clear button click
 */
export const trackClearButton = (): void => {
  trackEvent('course_cleared', {
    event_category: 'Course Action',
    event_label: 'Clear Course',
    engagement_level: 'low',
  });
};

/**
 * Track external link click (CONVERSION - user going to official site)
 */
export const trackExternalLink = (linkUrl: string, linkText: string): void => {
  const isOfficialSite = linkUrl.includes('shardauniversity.org') || linkUrl.includes('sharda.ac.in');
  const isApplyLink = linkUrl.includes('global.sharda.ac.in');
  
  if (isOfficialSite) {
    externalLinkClicks++;
    sessionActions.push('external_link');
  }
  
  trackEvent('click', {
    event_category: 'External Link',
    event_label: linkText,
    link_url: linkUrl,
    link_text: linkText,
    is_official_site: isOfficialSite,
    is_apply_link: isApplyLink,
    engagement_level: isOfficialSite ? 'very_high' : 'medium',
    external_clicks_count: externalLinkClicks,
  });

  // Track as conversion if it's official site (high intent)
  if (isOfficialSite) {
    const conversionType = isApplyLink ? 'apply_now' : 'external_link';
    trackConversion(conversionType, undefined, 'USD');
  }
  
  updateLeadMetrics();
};

/**
 * Track footer link click
 */
export const trackFooterLink = (linkType: string, linkUrl: string): void => {
  trackEvent('footer_link_clicked', {
    event_category: 'Footer',
    event_label: linkType,
    link_type: linkType,
    link_url: linkUrl,
    engagement_level: 'medium',
  });
};

/**
 * Track social media link click (CONVERSION - user wants to connect)
 */
export const trackSocialLink = (platform: string, url: string): void => {
  trackEvent('social_link_clicked', {
    event_category: 'Social Media',
    event_label: platform,
    social_platform: platform,
    link_url: url,
    engagement_level: 'high',
  });

  // Track as conversion (social engagement indicates interest)
  trackConversion('social_click', undefined, 'USD');
};

/**
 * Track scroll depth (can be called from components)
 */
export const trackScrollDepth = (depth: number): void => {
  if (!scrollDepthsTracked.has(depth)) {
    scrollDepthsTracked.add(depth);
    maxScrollDepth = Math.max(maxScrollDepth, depth);
    sessionActions.push(`scroll_${depth}`);
    
    trackEvent('scroll', {
      event_category: 'Engagement',
      event_label: `${depth}%`,
      scroll_depth: depth,
      max_scroll_depth: maxScrollDepth,
      engagement_level: depth >= 75 ? 'high' : depth >= 50 ? 'medium' : 'low',
    });
    
    updateLeadMetrics();
  }
};

/**
 * Start scroll depth tracking
 */
const startScrollDepthTracking = (): void => {
  if (typeof window === 'undefined') return;

  const thresholds = [25, 50, 75, 90];
  let lastScrollTop = 0;

  const handleScroll = (): void => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

    thresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !scrollDepthsTracked.has(threshold)) {
        trackScrollDepth(threshold);
      }
    });

    lastScrollTop = scrollTop;
  };

  // Throttle scroll events
  let ticking = false;
  const throttledScroll = (): void => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', throttledScroll, { passive: true });
};

/**
 * Start time on page tracking
 */
const startTimeOnPageTracking = (): void => {
  if (typeof window === 'undefined') return;

  // Track time intervals
  const intervals = [30, 60, 120, 300]; // 30s, 1min, 2min, 5min
  const trackedIntervals = new Set<number>();

  timeOnPageInterval = setInterval(() => {
    if (engagementStartTime) {
      const timeOnPage = Math.floor((Date.now() - engagementStartTime) / 1000); // in seconds

      intervals.forEach(interval => {
        if (timeOnPage >= interval && !trackedIntervals.has(interval)) {
          trackedIntervals.add(interval);
          trackEvent('time_on_page', {
            event_category: 'Engagement',
            time_seconds: interval,
            engagement_level: interval >= 120 ? 'high' : interval >= 60 ? 'medium' : 'low',
          });
        }
      });
    }
  }, 10000); // Check every 10 seconds
};

/**
 * Track user engagement when leaving page
 */
export const trackPageExit = (): void => {
  if (engagementStartTime && isGALoaded()) {
    const timeOnPage = Math.floor((Date.now() - engagementStartTime) / 1000);
    const sessionQuality = calculateSessionQuality();
    
    trackEvent('page_exit', {
      event_category: 'Engagement',
      time_on_page_seconds: timeOnPage,
      engagement_level: timeOnPage >= 60 ? 'high' : timeOnPage >= 30 ? 'medium' : 'low',
      lead_score: leadScore,
      session_quality: sessionQuality,
      courses_viewed: coursesViewed.size,
      scholarship_panels_viewed: scholarshipPanelsViewed,
      fee_copies: feeCopies,
      external_clicks: externalLinkClicks,
      max_scroll_depth: maxScrollDepth,
      total_actions: sessionActions.length,
    });
    
    // Track session summary
    window.gtag!('event', 'session_summary', {
      event_category: 'Session',
      session_duration: timeOnPage,
      lead_score: leadScore,
      session_quality: sessionQuality,
      courses_viewed_count: coursesViewed.size,
      scholarship_panels_viewed: scholarshipPanelsViewed,
      fee_copies_count: feeCopies,
      external_clicks_count: externalLinkClicks,
      max_scroll_depth: maxScrollDepth,
      total_actions: sessionActions.length,
      has_conversion: leadScore >= 25,
    });

    // Clear intervals
    if (timeOnPageInterval) {
      clearInterval(timeOnPageInterval);
      timeOnPageInterval = null;
    }
    
    // Reset session data
    sessionActions = [];
    coursesViewed.clear();
    scholarshipPanelsViewed = 0;
    feeCopies = 0;
    externalLinkClicks = 0;
    maxScrollDepth = 0;
    leadScore = 0;
  }
};

/**
 * Track programme filter selection
 */
export const trackProgrammeSelection = (programme: string): void => {
  trackEvent('programme_selected', {
    event_category: 'Filter',
    programme: programme,
    engagement_level: 'medium',
  });
};

/**
 * Track stream filter selection
 */
export const trackStreamSelection = (stream: string): void => {
  trackEvent('stream_selected', {
    event_category: 'Filter',
    stream: stream,
    engagement_level: 'medium',
  });
};

/**
 * Initialize analytics on page load
 */
export const initializeAnalytics = (): void => {
  if (typeof window === 'undefined') return;

  // Track page exit
  window.addEventListener('beforeunload', trackPageExit);

  // Track visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      trackPageExit();
    } else {
      engagementStartTime = Date.now();
      startTimeOnPageTracking();
    }
  });
};

