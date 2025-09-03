// backend/data/specialDates.js
// This file contains a comprehensive list of special dates for automated post generation.
// Each entry includes:
// - month (1-12)
// - day (1-31)
// - occasion: The name of the event/holiday
// - categories: An array of categories for which this occasion is relevant. 'all' means for all categories.
// - promptSuffix: A specific instruction for the AI to tailor the post.
// - isIndianHoliday: Boolean flag for India-specific holidays.
// - recurringType: 'yearly', 'weekly', 'monthly', 'daily', 'bi-weekly', 'seasonal'
// - dayOfWeek: For weekly/bi-weekly/seasonal recurring posts (0 for Sunday, 1 for Monday, etc.)
// - dayOfMonth: For monthly recurring posts (e.g., -1 for last day of month)
// - preferredTime: 'HH:MM' string for scheduling time (default is 10:00 AM if not specified)
// - weekPattern: 'odd' or 'even' for bi-weekly posts
// - season: 'summer', 'monsoon', 'winter', 'festival' for seasonal posts
// - contentType: 'quote', 'fact', 'tip', 'photo', 'bts', 'emergency', 'event', 'achievement', 'response' for daily/as-needed
// - engagementType: 'challenge', 'poll', 'qna', 'contest', 'ugc', 'collaboration', 'reflection' for engagement-focused posts

const specialDates = [
  // === JANUARY ===
  { month: 1, day: 1, occasion: 'New Year\'s Day', categories: ['all'], promptSuffix: 'Share inspiring resolutions and fresh beginnings. Create excitement for the year ahead with goal-setting motivation.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 1, day: 4, occasion: 'World Braille Day', categories: ['ngo', 'college'], promptSuffix: 'Promote accessibility and inclusion. Highlight the importance of equal opportunities for visually impaired individuals.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 1, day: 12, occasion: 'National Youth Day (Swami Vivekananda\'s Birthday)', categories: ['all'], promptSuffix: 'Inspire youth with Vivekananda\'s powerful quotes about strength, confidence, and nation-building.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 1, day: 14, occasion: 'Makar Sankranti / Pongal', categories: ['all'], promptSuffix: 'Celebrate harvest festival with colorful visuals. Share stories of gratitude, abundance, and new beginnings.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 1, day: 16, occasion: 'National Startup Day', categories: ['college', 'business'], promptSuffix: 'Spark entrepreneurial spirit! Share success stories, innovation tips, and encourage the startup mindset.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 1, day: 24, occasion: 'National Girl Child Day', categories: ['all'], promptSuffix: 'Celebrate girl power! Share stories of inspiring women and advocate for girls\' education and empowerment.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 1, day: 26, occasion: 'Republic Day', categories: ['all'], promptSuffix: 'Celebrate constitutional values with patriotic pride. Use tricolor themes and share inspiring stories of Indian democracy.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },

  // === FEBRUARY ===
  { month: 2, day: 4, occasion: 'World Cancer Day', categories: ['all'], promptSuffix: 'Spread awareness with hope and strength. Share survivor stories and prevention tips with sensitivity.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 2, day: 11, occasion: 'International Day of Women and Girls in Science', categories: ['college', 'ngo'], promptSuffix: 'Celebrate female scientists and encourage STEM participation. Share inspiring stories of women breaking barriers.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 2, day: 14, occasion: 'Valentine\'s Day', categories: ['all'], promptSuffix: 'Spread love and positivity! Focus on self-love, friendship, and spreading kindness in the community.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 2, day: 20, occasion: 'World Day of Social Justice', categories: ['ngo', 'college'], promptSuffix: 'Advocate for equality and fair opportunities. Share actionable ways to promote social justice in daily life.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 2, day: 21, occasion: 'International Mother Language Day', categories: ['college', 'ngo'], promptSuffix: 'Celebrate linguistic diversity! Share fun facts about languages and promote cultural heritage preservation.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 2, day: 28, occasion: 'National Science Day', categories: ['college'], promptSuffix: 'Make science exciting! Share fascinating discoveries, fun experiments, and inspire scientific curiosity.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },

  // === MARCH ===
  { month: 3, day: 4, occasion: 'National Safety Day', categories: ['college', 'business', 'ngo'], promptSuffix: 'Promote safety-first culture with practical tips. Make safety awareness engaging and memorable.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 3, day: 8, occasion: 'International Women\'s Day', categories: ['all'], promptSuffix: 'Celebrate women\'s achievements with powerful stories. Inspire action for gender equality and women\'s empowerment.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 3, day: 15, occasion: 'World Consumer Rights Day', categories: ['business', 'ngo'], promptSuffix: 'Educate about consumer rights and smart purchasing. Share tips for making informed decisions.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 3, day: 20, occasion: 'International Day of Happiness', categories: ['all'], promptSuffix: 'Spread joy and positivity! Share happiness tips, gratitude practices, and mental wellness advice.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 3, day: 21, occasion: 'World Poetry Day', categories: ['college', 'ngo'], promptSuffix: 'Celebrate the power of words! Share inspiring poems or encourage creative expression through poetry.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 3, day: 22, occasion: 'World Water Day', categories: ['all'], promptSuffix: 'Raise water conservation awareness with practical tips. Make sustainability actionable and engaging.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 3, day: 25, occasion: 'Holi', categories: ['all'], promptSuffix: 'Celebrate colors and togetherness! Share the joy of unity, forgiveness, and new beginnings with vibrant visuals.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },

  // === APRIL ===
  { month: 4, day: 2, occasion: 'World Autism Awareness Day', categories: ['ngo', 'college'], promptSuffix: 'Promote understanding and acceptance. Share stories that build empathy and support for neurodiversity.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 4, day: 7, occasion: 'World Health Day', categories: ['all'], promptSuffix: 'Inspire healthy living with practical wellness tips. Make health and fitness motivational and achievable.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 4, day: 14, occasion: 'Ambedkar Jayanti', categories: ['all'], promptSuffix: 'Honor Dr. Ambedkar\'s legacy of equality and justice. Share his inspiring quotes about education and social reform.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 4, day: 18, occasion: 'World Heritage Day', categories: ['college', 'ngo'], promptSuffix: 'Celebrate cultural heritage and history. Share fascinating facts about monuments and traditions.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 4, day: 22, occasion: 'Earth Day', categories: ['all'], promptSuffix: 'Inspire environmental action with creative eco-friendly tips. Make sustainability trendy and accessible.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 4, day: 23, occasion: 'World Book Day', categories: ['college', 'ngo'], promptSuffix: 'Celebrate the magic of reading! Share book recommendations and inspire a love for literature.', recurringType: 'yearly', preferredTime: '10:00' },

  // === MAY ===
  { month: 5, day: 1, occasion: 'International Workers\' Day (May Day)', categories: ['business', 'ngo'], promptSuffix: 'Honor workers\' contributions with gratitude. Celebrate the dignity of labor and workers\' rights.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 5, day: 3, occasion: 'World Press Freedom Day', categories: ['college', 'ngo'], promptSuffix: 'Support free and independent media. Discuss the importance of truthful journalism in democracy.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 5, day: 8, occasion: 'World Red Cross Day', categories: ['ngo', 'college'], promptSuffix: 'Celebrate humanitarian service and volunteerism. Inspire community service and helping others.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 5, day: 12, occasion: 'International Nurses Day', categories: ['all'], promptSuffix: 'Thank healthcare heroes! Share appreciation for nurses and healthcare workers\' dedication.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 5, day: 15, occasion: 'International Day of Families', categories: ['all'], promptSuffix: 'Celebrate family bonds and values. Share heartwarming stories about family support and togetherness.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 5, day: 31, occasion: 'World No Tobacco Day', categories: ['all'], promptSuffix: 'Promote healthy lifestyle choices. Share powerful anti-smoking messages and wellness alternatives.', recurringType: 'yearly', preferredTime: '10:00' },

  // === JUNE ===
  { month: 6, day: 5, occasion: 'World Environment Day', categories: ['all'], promptSuffix: 'Mobilize environmental action with creative campaigns. Make eco-consciousness viral and impactful.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 6, day: 8, occasion: 'World Oceans Day', categories: ['college', 'ngo'], promptSuffix: 'Protect our blue planet! Share ocean conservation tips and marine life appreciation.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 6, day: 12, occasion: 'World Day Against Child Labour', categories: ['ngo'], promptSuffix: 'Advocate for children\'s rights and education. Share powerful messages about protecting childhood.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 6, day: 14, occasion: 'World Blood Donor Day', categories: ['all'], promptSuffix: 'Encourage life-saving blood donation. Share inspiring donor stories and dispel donation myths.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 6, day: 15, occasion: 'World Elder Abuse Awareness Day', categories: ['ngo'], promptSuffix: 'Promote respect and care for elderly. Share ways to support senior citizens in our communities.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 6, day: 21, occasion: 'International Day of Yoga', categories: ['all'], promptSuffix: 'Celebrate India\'s gift to the world! Share yoga benefits and promote mental-physical wellness.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 6, day: 26, occasion: 'International Day Against Drug Abuse', categories: ['college', 'ngo'], promptSuffix: 'Promote drug-free living with positive alternatives. Share prevention messages and support resources.', recurringType: 'yearly', preferredTime: '10:00' },

  // === JULY ===
  { month: 7, day: 1, occasion: 'Doctor\'s Day', categories: ['all'], promptSuffix: 'Thank medical heroes for their service. Honor doctors\' dedication to saving lives and healing.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 7, day: 11, occasion: 'World Population Day', categories: ['college', 'ngo'], promptSuffix: 'Discuss sustainable development and population awareness. Share insights on demographic challenges.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 7, day: 18, occasion: 'Nelson Mandela International Day', categories: ['ngo', 'college'], promptSuffix: 'Inspire action for social justice. Share Mandela\'s legacy of peace, reconciliation, and human rights.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 7, day: 23, occasion: 'National Broadcasting Day', categories: ['all'], promptSuffix: 'Celebrating National Broadcasting Day! A tribute to the voices that connect us. #BroadcastingDay #Media', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 7, day: 28, occasion: 'World Hepatitis Day', categories: ['all'], promptSuffix: 'Raise health awareness about hepatitis prevention. Share important health information sensitively.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 7, day: 30, occasion: 'International Day of Friendship', categories: ['all'], promptSuffix: 'Celebrate meaningful connections! Share friendship stories and promote harmony across communities.', recurringType: 'yearly', preferredTime: '10:00' },

  // === AUGUST ===
  { month: 8, day: 9, occasion: 'International Day of Indigenous Peoples', categories: ['ngo', 'college'], promptSuffix: 'Honor indigenous cultures and rights. Celebrate diversity and traditional knowledge systems.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 8, day: 12, occasion: 'International Youth Day', categories: ['college'], promptSuffix: 'Empower young voices! Share youth achievements and encourage leadership in creating positive change.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 8, day: 15, occasion: 'Independence Day', categories: ['all'], promptSuffix: 'Celebrate freedom with patriotic fervor! Share India\'s journey and inspire national pride with tricolor themes.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 8, day: 19, occasion: 'World Photography Day', categories: ['all'], promptSuffix: 'Capture life\'s beautiful moments! Encourage visual storytelling and creative expression through photography.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 8, day: 26, occasion: 'Women\'s Equality Day', categories: ['all'], promptSuffix: 'Celebrate women\'s voting rights and ongoing fight for equality. Inspire continued progress in gender parity.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 8, day: 29, occasion: 'National Sports Day (Major Dhyan Chand\'s Birthday)', categories: ['all'], promptSuffix: 'Celebrate sporting excellence and fitness. Inspire athletic participation and healthy competition.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },

  // === SEPTEMBER ===
  { month: 9, day: 5, occasion: 'Teachers\' Day', categories: ['all'], promptSuffix: 'Honor educators who shape futures! Share gratitude for teachers and celebrate Dr. Radhakrishnan\'s legacy.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 9, day: 8, occasion: 'International Literacy Day', categories: ['college', 'ngo'], promptSuffix: 'Champion education for all! Share literacy success stories and promote learning opportunities.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 9, day: 10, occasion: 'World Suicide Prevention Day', categories: ['college', 'ngo'], promptSuffix: 'Promote mental health awareness with hope and support resources. Encourage seeking help and community care.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 7, day: 25, occasion: 'Engineers\' Day (M. Visvesvaraya\'s Birthday)', categories: ['college', 'business'], promptSuffix: 'Celebrate innovation and engineering excellence. Inspire STEM careers and technological advancement.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 9, day: 21, occasion: 'International Day of Peace', categories: ['all'], promptSuffix: 'Promote peace and harmony globally. Share messages of unity, tolerance, and conflict resolution.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 9, day: 27, occasion: 'World Tourism Day', categories: ['business', 'college'], promptSuffix: 'Celebrate travel and cultural exchange. Promote sustainable tourism and explore incredible destinations.', recurringType: 'yearly', preferredTime: '10:00' },

  // === OCTOBER ===
  { month: 10, day: 1, occasion: 'International Day of Older Persons', categories: ['ngo'], promptSuffix: 'Honor elderly wisdom and contributions. Promote intergenerational respect and care for seniors.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 10, day: 2, occasion: 'Gandhi Jayanti (International Day of Non-Violence)', categories: ['all'], promptSuffix: 'Reflect on Gandhi\'s timeless principles of truth, non-violence, and social change. Inspire peaceful action.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 10, day: 4, occasion: 'World Animal Day', categories: ['all'], promptSuffix: 'Celebrate animal welfare and conservation. Share cute animal content while promoting responsible pet care.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 10, day: 5, occasion: 'World Teachers\' Day', categories: ['college', 'ngo'], promptSuffix: 'Appreciate educators globally and their transformative impact. Celebrate teaching as a noble profession.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 10, day: 10, occasion: 'World Mental Health Day', categories: ['all'], promptSuffix: 'Break mental health stigma with compassionate awareness. Share wellness tips and normalize seeking help.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 10, day: 15, occasion: 'Dr. A.P.J. Abdul Kalam\'s Birthday (World Student\'s Day)', categories: ['college'], promptSuffix: 'Inspire with the "People\'s President\'s" vision. Share Kalam\'s motivational quotes about dreams and determination.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 10, day: 16, occasion: 'World Food Day', categories: ['ngo', 'business'], promptSuffix: 'Address hunger and food security. Promote sustainable agriculture and reduce food waste.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 10, day: 24, occasion: 'United Nations Day', categories: ['college', 'ngo'], promptSuffix: 'Promote global cooperation and peace. Celebrate international unity and collaborative problem-solving.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 10, day: 31, occasion: 'National Unity Day (Sardar Patel\'s Birthday)', categories: ['all'], promptSuffix: 'Celebrate India\'s unity in diversity. Honor Sardar Patel\'s role in nation-building and integration.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },

  // === NOVEMBER ===
  { month: 11, day: 9, occasion: 'Legal Services Day', categories: ['college', 'ngo'], promptSuffix: 'Promote access to justice for all. Share awareness about legal rights and free legal aid services.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 11, day: 11, occasion: 'National Education Day (Maulana Abul Kalam Azad\'s Birthday)', categories: ['college', 'ngo'], promptSuffix: 'Emphasize education\'s power to transform lives. Celebrate learning and knowledge accessibility.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 11, day: 14, occasion: 'Children\'s Day (Nehru\'s Birthday)', categories: ['all'], promptSuffix: 'Celebrate childhood joy and innocence! Honor children\'s rights and nurture their dreams and potential.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 11, day: 16, occasion: 'International Day for Tolerance', categories: ['all'], promptSuffix: 'Promote acceptance and understanding across differences. Celebrate diversity and peaceful coexistence.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 11, day: 19, occasion: 'International Men\'s Day', categories: ['all'], promptSuffix: 'Celebrate positive masculinity and men\'s well-being. Address men\'s mental health and role model appreciation.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 11, day: 20, occasion: 'Universal Children\'s Day', categories: ['ngo'], promptSuffix: 'Advocate for children\'s rights globally. Promote child welfare, education, and protection.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 11, day: 25, occasion: 'International Day for Elimination of Violence Against Women', categories: ['ngo'], promptSuffix: 'Stand against gender-based violence. Promote women\'s safety and support survivor resources.', recurringType: 'yearly', preferredTime: '10:00' },

  // === DECEMBER ===
  { month: 12, day: 1, occasion: 'World AIDS Day', categories: ['all'], promptSuffix: 'Raise HIV/AIDS awareness with compassion. Fight stigma and promote prevention, testing, and support.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 12, day: 3, occasion: 'International Day of Persons with Disabilities', categories: ['ngo', 'college'], promptSuffix: 'Promote inclusion and accessibility. Celebrate abilities and advocate for equal opportunities.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 12, day: 4, occasion: 'Indian Navy Day', categories: ['business'], promptSuffix: 'Honor naval service and maritime security. Show patriotic appreciation for naval defense forces.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 12, day: 5, occasion: 'International Volunteer Day', categories: ['ngo', 'college'], promptSuffix: 'Celebrate volunteerism and community service. Inspire giving back and social responsibility.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 12, day: 7, occasion: 'Armed Forces Flag Day', categories: ['all'], promptSuffix: 'Support military veterans and their families. Show gratitude for armed forces\' sacrifice and service.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 12, day: 10, occasion: 'Human Rights Day', categories: ['all'], promptSuffix: 'Advocate for fundamental human rights globally. Promote dignity, equality, and justice for all.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 12, day: 14, occasion: 'Energy Conservation Day', categories: ['all'], promptSuffix: 'Promote sustainable energy practices. Share practical tips for reducing energy consumption.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 12, day: 18, occasion: 'International Migrants Day', categories: ['ngo'], promptSuffix: 'Support migrant rights and dignity. Promote understanding of migration challenges and contributions.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 12, day: 22, occasion: 'National Mathematics Day (Ramanujan\'s Birthday)', categories: ['college'], promptSuffix: 'Celebrate mathematical genius and inspire STEM learning. Make math exciting and accessible.', isIndianHoliday: true, recurringType: 'yearly', preferredTime: '10:00' },
  { month: 12, day: 25, occasion: 'Christmas', categories: ['all'], promptSuffix: 'Spread Christmas joy and peace! Focus on giving, kindness, and celebrating togetherness across communities.', recurringType: 'yearly', preferredTime: '10:00' },
  { month: 12, day: 31, occasion: 'New Year\'s Eve', categories: ['all'], promptSuffix: 'Reflect on achievements and set intentions for the new year. Create excitement for fresh beginnings!', recurringType: 'yearly', preferredTime: '10:00' },

  // === RECURRING WEEKLY POSTS ===
  { occasion: 'Motivational Monday', categories: ['all'], promptSuffix: 'Kick-start the week with powerful inspiration! Share success quotes, goal-setting tips, and positive energy.', recurringType: 'weekly', dayOfWeek: 1, preferredTime: '10:00' },
  { occasion: 'Tech Tuesday', categories: ['business', 'college'], promptSuffix: 'Share latest technology trends, digital tips, or innovative tools. Make tech accessible and exciting.', recurringType: 'weekly', dayOfWeek: 2, preferredTime: '10:00' },
  { occasion: 'Wisdom Wednesday', categories: ['all'], promptSuffix: 'Share insightful knowledge, life lessons, or educational content. Make learning engaging and thought-provoking.', recurringType: 'weekly', dayOfWeek: 3, preferredTime: '10:00' },
  { occasion: 'Throwback Thursday', categories: ['all'], promptSuffix: 'Share nostalgic moments, historical achievements, or memorable milestones. Create emotional connections.', recurringType: 'weekly', dayOfWeek: 4, preferredTime: '10:00' },
  { occasion: 'Fun Friday', categories: ['all'], promptSuffix: 'End the week with joy! Share entertaining content, celebrations, or lighthearted posts to boost morale.', recurringType: 'weekly', dayOfWeek: 5, preferredTime: '10:00' },
  { occasion: 'Success Story Saturday', categories: ['business'], promptSuffix: 'Share inspiring business achievements, client testimonials, or industry success stories.', recurringType: 'weekly', dayOfWeek: 6, preferredTime: '10:00' },
  { occasion: 'Study Tip Sunday', categories: ['college'], promptSuffix: 'Provide practical study strategies, exam tips, or learning hacks. Make academic success achievable.', recurringType: 'weekly', dayOfWeek: 0, preferredTime: '10:00' },
  { occasion: 'Social Impact Sunday', categories: ['ngo'], promptSuffix: 'Highlight community service, social causes, or volunteer opportunities. Inspire positive change.', recurringType: 'weekly', dayOfWeek: 0, preferredTime: '10:00' },

  // === RECURRING MONTHLY POSTS ===
  { occasion: 'Month in Review', categories: ['business', 'ngo'], promptSuffix: 'Summarize key achievements, milestones, and impactful moments from the past month. Celebrate progress.', recurringType: 'monthly', dayOfMonth: -1, preferredTime: '10:00' },
  { occasion: 'Monthly Goals Check-in', categories: ['college', 'business'], promptSuffix: 'Review monthly objectives and set new targets. Encourage accountability and continuous improvement.', recurringType: 'monthly', dayOfMonth: 1, preferredTime: '10:00' },
  { occasion: 'Community Spotlight', categories: ['ngo'], promptSuffix: 'Feature community heroes, volunteers, or beneficiaries. Share human interest stories that inspire.', recurringType: 'monthly', dayOfMonth: 15, preferredTime: '10:00' },
  { occasion: 'Innovation Showcase', categories: ['business', 'college'], promptSuffix: 'Highlight creative solutions, new technologies, or innovative approaches in your field.', recurringType: 'monthly', dayOfMonth: 10, preferredTime: '10:00' },
  { occasion: 'Student Achievement Awards', categories: ['college'], promptSuffix: 'Recognize outstanding student performances, academic achievements, and extracurricular excellence.', recurringType: 'monthly', dayOfMonth: 5, preferredTime: '10:00' },
  { occasion: 'Impact Story of the Month', categories: ['ngo'], promptSuffix: 'Share powerful transformation stories showing real impact of your work in the community.', recurringType: 'monthly', dayOfMonth: 20, preferredTime: '10:00' },
  { occasion: 'Business Milestone Monday', categories: ['business'], promptSuffix: 'Celebrate business achievements, new partnerships, or significant company developments.', recurringType: 'monthly', dayOfMonth: 7, preferredTime: '10:00' },

  // === ADDITIONAL WEEKLY CONTENT FILLERS ===
  { occasion: 'Meme Monday', categories: ['college'], promptSuffix: 'Share relatable student memes or funny content that resonates with college life and studies.', recurringType: 'weekly', dayOfWeek: 1, preferredTime: '10:00' },
  { occasion: 'Tutorial Tuesday', categories: ['all'], promptSuffix: 'Provide step-by-step guides, how-to content, or skill-building tutorials relevant to your audience.', recurringType: 'weekly', dayOfWeek: 2, preferredTime: '10:00' },
  { occasion: 'Wellness Wednesday', categories: ['all'], promptSuffix: 'Focus on mental health, physical fitness, or overall well-being tips. Promote healthy lifestyle choices.', recurringType: 'weekly', dayOfWeek: 3, preferredTime: '10:00' },
  { occasion: 'Trivia Thursday', categories: ['all'], promptSuffix: 'Share interesting facts, quiz questions, or brain teasers to engage your audience interactively.', recurringType: 'weekly', dayOfWeek: 4, preferredTime: '10:00' },
  { occasion: 'Feature Friday', categories: ['all'], promptSuffix: 'Spotlight team members, students, volunteers, or community members. Humanize your organization.', recurringType: 'weekly', dayOfWeek: 5, preferredTime: '10:00' },
  { occasion: 'Shoutout Saturday', categories: ['all'], promptSuffix: 'Give recognition, thanks, or appreciation to supporters, partners, or community members.', recurringType: 'weekly', dayOfWeek: 6, preferredTime: '10:00' },
  { occasion: 'Story Sunday', categories: ['all'], promptSuffix: 'Share inspiring personal journeys, organizational history, or meaningful anecdotes that connect emotionally.', recurringType: 'weekly', dayOfWeek: 0, preferredTime: '10:00' },

  // === BI-WEEKLY ROTATING CONTENT ===
  { occasion: 'Quick Tips Tuesday', categories: ['all'], promptSuffix: 'Share bite-sized, actionable advice that your audience can implement immediately.', recurringType: 'bi-weekly', dayOfWeek: 2, weekPattern: 'odd', preferredTime: '10:00' },
  { occasion: 'Career Corner Tuesday', categories: ['college', 'business'], promptSuffix: 'Provide career advice, job search tips, or professional development guidance.', recurringType: 'bi-weekly', dayOfWeek: 2, weekPattern: 'even', preferredTime: '10:00' },
  { occasion: 'Volunteer Spotlight Wednesday', categories: ['ngo'], promptSuffix: 'Feature dedicated volunteers and their contributions to your cause.', recurringType: 'bi-weekly', dayOfWeek: 3, weekPattern: 'odd', preferredTime: '10:00' },
  { occasion: 'Resource Wednesday', categories: ['all'], promptSuffix: 'Share useful resources, tools, websites, or materials that benefit your audience.', recurringType: 'bi-weekly', dayOfWeek: 3, weekPattern: 'even', preferredTime: '10:00' },
  { occasion: 'Feedback Friday', categories: ['all'], promptSuffix: 'Ask for audience opinions, conduct polls, or gather feedback on services and content.', recurringType: 'bi-weekly', dayOfWeek: 5, weekPattern: 'odd', preferredTime: '10:00' },
  { occasion: 'Fun Facts Friday', categories: ['all'], promptSuffix: 'Share amazing, surprising, or little-known facts related to your field or general knowledge.', recurringType: 'bi-weekly', dayOfWeek: 5, weekPattern: 'even', preferredTime: '10:00' },

  // === DAILY CONTENT IDEAS FOR HIGH-FREQUENCY POSTING ===
  { occasion: 'Quote of the Day', categories: ['all'], promptSuffix: 'Share inspirational, motivational, or thought-provoking quotes with attractive visual design.', recurringType: 'daily', contentType: 'quote', preferredTime: '10:00' },
  { occasion: 'Did You Know?', categories: ['all'], promptSuffix: 'Share interesting facts, statistics, or educational tidbits relevant to your field or audience.', recurringType: 'daily', contentType: 'fact', preferredTime: '10:00' },
  { occasion: 'Tip of the Day', categories: ['all'], promptSuffix: 'Provide practical, actionable advice that your audience can use in their daily lives.', recurringType: 'daily', contentType: 'tip', preferredTime: '10:00' },
  { occasion: 'Photo of the Day', categories: ['all'], promptSuffix: 'Share visually appealing images with meaningful captions that reflect your organization\'s values.', recurringType: 'daily', contentType: 'photo', preferredTime: '10:00' },
  { occasion: 'Behind the Scenes', categories: ['all'], promptSuffix: 'Show the human side of your organization with candid moments and daily operations.', recurringType: 'daily', contentType: 'bts', preferredTime: '10:00' },

  // === SEASONAL WEEKLY THEMES ===
  { occasion: 'Summer Special Saturday', categories: ['all'], promptSuffix: 'Share summer-themed content, activities, or seasonal tips during hot months (April-June).', recurringType: 'seasonal', season: 'summer', dayOfWeek: 6, preferredTime: '10:00' },
  { occasion: 'Monsoon Monday', categories: ['all'], promptSuffix: 'Create monsoon-themed content, rain safety tips, or seasonal joy during rainy season (July-September).', recurringType: 'seasonal', season: 'monsoon', dayOfWeek: 1, preferredTime: '10:00' },
  { occasion: 'Winter Wellness Wednesday', categories: ['all'], promptSuffix: 'Share winter health tips, seasonal care advice, or cozy content during cold months (December-February).', recurringType: 'seasonal', season: 'winter', dayOfWeek: 3, preferredTime: '10:00' },
  { occasion: 'Festival Friday', categories: ['all'], promptSuffix: 'Celebrate various festivals and cultural events throughout the year with themed content.', recurringType: 'seasonal', season: 'festival', dayOfWeek: 5, preferredTime: '10:00' },

  // === CONTENT FOR SPECIAL CIRCUMSTANCES ===
  // Note: These are 'as-needed' and would typically be manually triggered, not automated by daily cron.
  { occasion: 'Emergency Update', categories: ['all'], promptSuffix: 'Share important announcements, emergency information, or urgent updates when needed.', recurringType: 'as-needed', contentType: 'emergency', preferredTime: '10:00' },
  { occasion: 'Event Promotion', categories: ['all'], promptSuffix: 'Promote upcoming events, workshops, or activities with compelling calls-to-action.', recurringType: 'as-needed', contentType: 'event', preferredTime: '10:00' },
  { occasion: 'Achievement Celebration', categories: ['all'], promptSuffix: 'Celebrate milestones, awards, recognitions, or significant accomplishments.', recurringType: 'as-needed', contentType: 'achievement', preferredTime: '10:00' },
  { occasion: 'Community Response', categories: ['all'], promptSuffix: 'Respond to community needs, current events, or trending topics with relevant content.', recurringType: 'as-needed', contentType: 'response', preferredTime: '10:00' },

  // === ENGAGEMENT-FOCUSED RECURRING POSTS ===
  { occasion: 'Challenge Monday', categories: ['all'], promptSuffix: 'Start weekly challenges that encourage audience participation and engagement.', recurringType: 'weekly', dayOfWeek: 1, engagementType: 'challenge', preferredTime: '10:00' },
  { occasion: 'Poll Tuesday', categories: ['all'], promptSuffix: 'Create interactive polls to gather opinions and increase audience engagement.', recurringType: 'weekly', dayOfWeek: 2, engagementType: 'poll', preferredTime: '10:00' },
  { occasion: 'Q&A Wednesday', categories: ['all'], promptSuffix: 'Answer audience questions or invite them to ask questions about your field or services.', recurringType: 'weekly', dayOfWeek: 3, engagementType: 'qna', preferredTime: '10:00' },
  { occasion: 'Contest Thursday', categories: ['all'], promptSuffix: 'Run contests, giveaways, or competitions to boost engagement and reward followers.', recurringType: 'weekly', dayOfWeek: 4, engagementType: 'contest', preferredTime: '10:00' },
  { occasion: 'User Generated Friday', categories: ['all'], promptSuffix: 'Share content created by your audience, featuring their stories, photos, or experiences.', recurringType: 'weekly', dayOfWeek: 5, engagementType: 'ugc', preferredTime: '10:00' },
  { occasion: 'Collaboration Saturday', categories: ['all'], promptSuffix: 'Feature partnerships, joint initiatives, or collaborative projects with other organizations.', recurringType: 'weekly', dayOfWeek: 6, engagementType: 'collaboration', preferredTime: '10:00' },
  { occasion: 'Reflection Sunday', categories: ['all'], promptSuffix: 'Encourage audience to reflect on their week, goals, or personal growth.', recurringType: 'weekly', dayOfWeek: 0, engagementType: 'reflection', preferredTime: '10:00' },
];

module.exports = specialDates;
