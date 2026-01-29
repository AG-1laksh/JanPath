export type Language = "English" | "Hindi" | "Tamil" | "Telugu" | "Bengali" | "Kannada";

export const translations: Record<Language, Record<string, string>> = {
  English: {
    // General
    "Overview": "Overview",
    "Grievances": "Grievances",
    "Support": "Support",
    "Settings": "Settings",
    "New Grievance": "New Grievance",
    "Track Status": "Track Status",
    "Logout": "Logout",
    "Profile": "Profile",
    "Menu": "Menu",
    "System": "System",
    "Notifications": "Notifications",
    "Search": "Search",
    "Welcome back": "Welcome back",
    
    // Roles
    "admin": "Admin",
    "citizen": "Citizen",
    "worker": "Worker",

    // Admin Sidebar
    "Citizens": "Citizens",
    "Workers": "Workers",
    "Reports": "Reports",
    "Analytics": "Analytics",
    "Resolution Time": "Resolution Time",
    "Active Staff": "Active Staff",

    // Citizen Sidebar
    "My Complaints": "My Complaints",
    "Community": "Community",
    "Suggestions": "Suggestions",
    "Transparency": "Transparency",

    // Worker Sidebar
    "Tasks": "Tasks",
    "History": "History",
    "Map View": "Map View",
    "Performance": "Performance",

    // Headings
    "Recent Activity": "Recent Activity",
    "Pending Actions": "Pending Actions",
    "System Status": "System Status",
    "Total Grievances": "Total Grievances",
    "Resolved": "Resolved",
    "Pending": "Pending",
    "In Progress": "In Progress",

    // Dashboard specific
    "Admin Dashboard": "Admin Dashboard",
    "Citizen Dashboard": "Citizen Dashboard",
    "Worker Dashboard": "Worker Dashboard",
    "Pending Resolution": "Pending Resolution",
    "Resolved This Week": "Resolved This Week",
    "Avg Response Time": "Avg Response Time",
    "Analytics & Reports Chart": "Analytics & Reports Chart",
    "Visualize resolution trends here": "Visualize resolution trends here",

    // Settings
    "Admin Settings": "Admin Settings",
    "Control security, access, system behavior, and compliance.": "Control security, access, system behavior, and compliance.",
    "Preferences": "Preferences",
    "Customize your dashboard experience.": "Customize your dashboard experience.",
    "Dark Mode": "Dark Mode",
    "Switch between light and dark themes": "Switch between light and dark themes",
    "Language": "Language",
    "Select your preferred language": "Select your preferred language",

    // Citizen Extra
    "Community Impact": "Community Impact",
    "Transparency Wall": "Transparency Wall",
    "Suggestion Box": "Suggestion Box",
    "Quick Stats": "Quick Stats",
    "Total": "Total",

    // Worker Extra
    "My Tasks": "My Tasks",
    "Schedule": "Schedule",
    "Shift Tracking": "Shift Tracking",
    "Attendance": "Attendance",
    "Completed": "Completed",
    "Field Dashboard": "Field Dashboard",

    // Grievance Page
    "Track and manage your submitted reports.": "Track and manage your submitted reports.",
    "Search grievance ID or title...": "Search grievance ID or title..."
  },
  Hindi: {
    "Overview": "अवलोकन",
    "Grievances": "शिकायतें",
    "Support": "सहायता",
    "Settings": "सेटिंग्स",
    "New Grievance": "नई शिकायत",
    "Track Status": "स्थिति ट्रैक करें",
    "Logout": "लॉग आउट",
    "Profile": "प्रोफाइल",
    "Menu": "मेन्यू",
    "System": "सिस्टम",
    "Notifications": "सूचनाएं",
    "Search": "खोजें",
    "Welcome back": "वापसी पर स्वागत है",
    
    "admin": "प्रशासक",
    "citizen": "नागरिक",
    "worker": "कर्मचारी",

    "Citizens": "नागरिक",
    "Workers": "कर्मचारी",
    "Reports": "रिपोर्ट",
    "Analytics": "एनालिटिक्स",
    "Resolution Time": "समाधान समय",
    "Active Staff": "सक्रिय स्टाफ",

    "My Complaints": "मेरी शिकायतें",
    "Community": "समुदाय",
    "Suggestions": "सुझाव",
    "Transparency": "पारदर्शिता",

    "Tasks": "कार्य",
    "History": "इतिहास",
    "Map View": "मानचित्र दृश्य",
    "Performance": "प्रदर्शन",

    "Recent Activity": "हाल की गतिविधि",
    "Pending Actions": "लंबित कार्य",
    "System Status": "सिस्टम स्थिति",
    "Total Grievances": "कुल शिकायतें",
    "Resolved": "हल किया गया",
    "Pending": "लंबित",
    "In Progress": "प्रगति में है",

    // Dashboard specific
    "Admin Dashboard": "प्रशासक डैशबोर्ड",
    "Citizen Dashboard": "नागरिक डैशबोर्ड",
    "Worker Dashboard": "कर्मचारी डैशबोर्ड",
    "Pending Resolution": "लंबित समाधान",
    "Resolved This Week": "इस सप्ताह हल किया गया",
    "Avg Response Time": "औसत प्रतिक्रिया समय",
    "Analytics & Reports Chart": "एनालिटिक्स और रिपोर्ट चार्ट",
    "Visualize resolution trends here": "यहाँ समाधान के रुझान देखें",

    // Settings
    "Admin Settings": "प्रशासक सेटिंग्स",
    "Control security, access, system behavior, and compliance.": "सुरक्षा, पहुंच, सिस्टम व्यवहार और अनुपालन नियंत्रित करें।",
    "Preferences": "पसंद",
    "Customize your dashboard experience.": "अपना डैशबोर्ड अनुभव अनुकूलित करें।",
    "Dark Mode": "डार्क मोड",
    "Switch between light and dark themes": "लाइट और डार्क थीम के बीच स्विच करें",
    "Language": "भाषा",
    "Select your preferred language": "अपनी पसंदीदा भाषा चुनें",

    // Citizen Extra
    "Community Impact": "सामुदायिक प्रभाव",
    "Transparency Wall": "पारदर्शिता दीवार",
    "Suggestion Box": "सुझाव पेटी",
    "Quick Stats": "त्वरित आँकड़े",
    "Total": "कुल",

    // Worker Extra
    "My Tasks": "मेरे कार्य",
    "Schedule": "अनुसूची",
    "Shift Tracking": "शिफ्ट ट्रैकिंग",
    "Attendance": "उपस्थिति",
    "Completed": "पूरा हुआ",
    "Field Dashboard": "फील्ड डैशबोर्ड",

    // Grievance Page
    "Track and manage your submitted reports.": "अपनी सबमिट की गई रिपोर्ट ट्रैक और प्रबंधित करें।",
    "Search grievance ID or title...": "शिकायत आईडी या शीर्षक खोजें..."
  },
  Tamil: {
    "Overview": "கண்ணோட்டம்",
    "Grievances": "குறைகள்",
    "Support": "ஆதரவு",
    "Settings": "அமைப்புகள்",
    "New Grievance": "புதிய குறை",
    "Track Status": "நிலையை கண்காணிக்க",
    "Logout": "வெளியேறு",
    "Profile": "சுயவிவரம்",
    "Menu": "மெனு",
    "System": "அமைப்பு",
    "Notifications": "அறிவிப்புகள்",
    "Search": "தேடல்",
    "Welcome back": "மீண்டும் வருக",

    "admin": "நிர்வாகி",
    "citizen": "குடிமகன்",
    "worker": "பணியாளர்",

    "Citizens": "குடிமக்கள்",
    "Workers": "பணியாளர்கள்",
    "Reports": "அறிக்கைகள்",
    "Analytics": "பகுப்பாய்வு",
    "Resolution Time": "தீர்வு நேரம்",
    "Active Staff": "செயலில் உள்ள ஊழியர்கள்",

    "My Complaints": "எங்கள் புகார்கள்",
    "Community": "சமூகம்",
    "Suggestions": "பரிந்துரைகள்",
    "Transparency": "வெளிப்படைத்தன்மை",

    "Tasks": "பணிகள்",
    "History": "வரலாறு",
    "Map View": "வரைபடக் காட்சி",
    "Performance": "செயல்திறன்",

    "Recent Activity": "சமீபத்திய செயல்பாடு",
    "Pending Actions": "நிலுவையில் உள்ள செயல்கள்",
    "System Status": "அமைப்பு நிலை",
    "Total Grievances": "மொத்த குறைகள்",
    "Resolved": "தீர்க்கப்பட்டது",
    "Pending": "நிலுவையில் உள்ளது",
    "In Progress": "செயலில் உள்ளது",

    // Settings
    "Admin Settings": "நிர்வாக அமைப்புகள்",
    "Control security, access, system behavior, and compliance.": "பாதுகாப்பு, அணுகல், கணினி நடத்தை மற்றும் இணக்கத்தைக் கட்டுப்படுத்தவும்.",
    "Preferences": "விருப்பங்கள்",
    "Customize your dashboard experience.": "உங்கள் டாஷ்போர்டு அனுபவத்தைத் தனிப்பயனாக்கவும்.",
    "Dark Mode": "டார்க் மோட்",
    "Switch between light and dark themes": "விளக்கு மற்றும் இருண்ட கருப்பொருள்களுக்கு இடையில் மாறவும்",
    "Language": "மொழி",
    "Select your preferred language": "உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",

    // Citizen Extra
    "Community Impact": "சமூக தாக்கம்",
    "Transparency Wall": "வெளிப்படைத்தன்மை சுவர்",
    "Suggestion Box": "பரிந்துரை பெட்டி",
    "Quick Stats": "விரைவு புள்ளிவிவரங்கள்",
    "Total": "மொத்தம்",

    // Worker Extra
    "My Tasks": "என் பணிகள்",
    "Schedule": "அட்டவணை",
    "Shift Tracking": "ஷிப்ட் கண்காணிப்பு",
    "Attendance": "வருகை",
    "Completed": "முடிக்கப்பட்டது",
    "Field Dashboard": "களப் பலகை",

    // Grievance Page
    "Track and manage your submitted reports.": "நீங்கள் சமர்ப்பித்த அறிக்கைகளைக் கண்காணித்து நிர்வகிக்கவும்.",
    "Search grievance ID or title...": "குறை ஐடி அல்லது தலைப்பைத் தேடவும்..."
  },
  Telugu: {
    "Overview": "అవలోకనం",
    "Grievances": "ఫిర్యాదులు",
    "Support": "మద్దతు",
    "Settings": "సెట్టింగ్‌లు",
    "New Grievance": "కొత్త ఫిర్యాదు",
    "Track Status": "స్థితిని ట్రాక్ చేయండి",
    "Logout": "లాగ్ అవుట్",
    "Profile": "ప్రొఫైల్",
    "Menu": "మెను",
    "System": "సిస్టమ్",
    "Notifications": "నోటిఫికేషన్లు",
    "Search": "శోధన",
    "Welcome back": "స్వాగతం",

    "admin": "అడ్మిన్",
    "citizen": "పౌరుడు",
    "worker": "కార్మికుడు",

    "Citizens": "పౌరులు",
    "Workers": "కార్మికులు",
    "Reports": "నివేదికలు",
    "Analytics": "విశ్లేషణలు",
    "Resolution Time": "పరిష్కార సమయం",
    "Active Staff": "క్రియాశీల సిబ్బంది",

    "My Complaints": "నా ఫిర్యాదులు",
    "Community": "సంఘం",
    "Suggestions": "సూచనలు",
    "Transparency": "పారదర్శకత",

    "Tasks": "పనులు",
    "History": "చరిత్ర",
    "Map View": "మ్యాప్ వీక్షణ",
    "Performance": "పనితీరు",

    "Recent Activity": "ఇటీవలి కార్యకలాపాలు",
    "Pending Actions": "పెండింగ్ చర్యలు",
    "System Status": "సిస్టమ్ స్థితి",
    "Total Grievances": "మొత్తం ఫిర్యాదులు",
    "Resolved": "పరిష్కరించబడింది",
    "Pending": "పెండింగ్",
    "In Progress": "పురోగతిలో ఉంది",

    // Settings
    "Admin Settings": "అడ్మిన్ సెట్టింగ్‌లు",
    "Control security, access, system behavior, and compliance.": "భద్రత, యాక్సెస్, సిస్టమ్ ప్రవర్తన మరియు సమ్మతిని నియంత్రించండి.",
    "Preferences": "ప్రాధాన్యతలు",
    "Customize your dashboard experience.": "మీ డాష్‌బోర్డ్ అనుభవాన్ని అనుకూలీకరించండి.",
    "Dark Mode": "డార్క్ మోడ్",
    "Switch between light and dark themes": "లైట్ మరియు డార్క్ థీమ్‌ల మధ్య మారండి",
    "Language": "భాష",
    "Select your preferred language": "మీకు నచ్చిన భాషను ఎంచుకోండి",

    // Citizen Extra
    "Community Impact": "కమ్యూనిటీ ప్రభావం",
    "Transparency Wall": "పారదర్శకత గోడ",
    "Suggestion Box": "సూచనల పెట్టె",
    "Quick Stats": "త్వరిత గణాంకాలు",
    "Total": "మొత్తం",

    // Worker Extra
    "My Tasks": "నా పనులు",
    "Schedule": "షెడ్యూల్",
    "Shift Tracking": "షిఫ్ట్ ట్రాకింగ్",
    "Attendance": "హాజరు",
    "Completed": "పూర్తయింది",
    "Field Dashboard": "ఫీల్డ్ డాష్‌బోర్డ్",

    // Grievance Page
    "Track and manage your submitted reports.": "మీరు సమర్పించిన నివేదికలను ట్రాక్ చేయండి మరియు నిర్వహించండి.",
    "Search grievance ID or title...": "ఫిర్యాదు ఐడి లేదా శీర్షికను శోధించండి..."
  },
  Bengali: {
    "Overview": "ওভারভিউ",
    "Grievances": "অভিযোগ",
    "Support": "সহায়তা",
    "Settings": "সেটিংস",
    "New Grievance": "নতুন অভিযোগ",
    "Track Status": "স্ট্যাটাস ট্র্যাক করুন",
    "Logout": "লগ আউট",
    "Profile": "প্রোফাইল",
    "Menu": "মেনু",
    "System": "সিস্টেম",
    "Notifications": "বিজ্ঞপ্তি",
    "Search": "অনুসন্ধান",
    "Welcome back": "স্বাগতম",

    "admin": "প্রশাসক",
    "citizen": "নাগরিক",
    "worker": "কর্মী",

    "Citizens": "নাগরিকবৃন্দ",
    "Workers": "কর্মীবৃন্দ",
    "Reports": "রিপোর্ট",
    "Analytics": "অ্যানালিটিক্স",
    "Resolution Time": "সমাধানের সময়",
    "Active Staff": "সক্রিয় কর্মী",

    "My Complaints": "আমার অভিযোগ",
    "Community": "সম্প্রদায়",
    "Suggestions": "পরামর্শ",
    "Transparency": "স্বচ্ছতা",

    "Tasks": "কাজ",
    "History": "ইতিহাস",
    "Map View": "ম্যাপ ভিউ",
    "Performance": "কর্মক্ষমতা",

    "Recent Activity": "সাম্প্রতিক কার্যকলাপ",
    "Pending Actions": "অমীমাংসিত কাজ",
    "System Status": "সিস্টেম স্ট্যাটাস",
    "Total Grievances": "মোট অভিযোগ",
    "Resolved": "মীমাংসিত",
    "Pending": "অমীমাংসিত",
    "In Progress": "চলমান",

    // Settings
    "Admin Settings": "অ্যাডমিন সেটিংস",
    "Control security, access, system behavior, and compliance.": "নিরাপত্তা, অ্যাক্সেস, সিস্টেম আচরণ এবং সম্মতি নিয়ন্ত্রণ করুন।",
    "Preferences": "পছন্দসমূহ",
    "Customize your dashboard experience.": "আপনার ড্যাশবোর্ড অভিজ্ঞতা কাস্টমাইজ করুন।",
    "Dark Mode": "ডার্ক মোড",
    "Switch between light and dark themes": "লাইট এবং ডার্ক থিমের মধ্যে পরিবর্তন করুন",
    "Language": "ভাষা",
    "Select your preferred language": "আপনার পছন্দের ভাষা নির্বাচন করুন",

    // Citizen Extra
    "Community Impact": "কমিউনিটি ইমপ্যাক্ট",
    "Transparency Wall": "স্বচ্ছতা দেয়াল",
    "Suggestion Box": "পরামর্শ বাক্স",
    "Quick Stats": "দ্রুত পরিসংখ্যান",
    "Total": "মোট",

    // Worker Extra
    "My Tasks": "আমার কাজ",
    "Schedule": "সময়সূচী",
    "Shift Tracking": "শিফট ট্র্যাকিং",
    "Attendance": "উপস্থিতি",
    "Completed": "সম্পন্ন",
    "Field Dashboard": "ফিল্ড ড্যাশবোর্ড",

    // Grievance Page
    "Track and manage your submitted reports.": "আপনার জমা দেওয়া রিপোর্টগুলি ট্র্যাক এবং পরিচালনা করুন।",
    "Search grievance ID or title...": "অভিযোগ আইডি বা শিরোনাম অনুসন্ধান করুন..."
  },
  Kannada: {
    "Overview": "ಅವಲೋಕನ",
    "Grievances": "ಕುಂದುಕೊರತೆಗಳು",
    "Support": "ಬೆಂಬಲ",
    "Settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "New Grievance": "ಹೊಸ ದೂರು",
    "Track Status": "ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    "Logout": "ಲಾಗ್ ಔಟ್",
    "Profile": "ಪ್ರೊಫೈಲ್",
    "Menu": "ಮೆನು",
    "System": "ವ್ಯವಸ್ಥೆ",
    "Notifications": "ಸೂಚನೆಗಳು",
    "Search": "ಹುಡುಕಿ",
    "Welcome back": "ಸ್ವಾಗತ",

    "admin": "ಆಡಳಿತಾಧಿಕಾರಿ",
    "citizen": "ನಾಗರಿಕ",
    "worker": "ಕೆಲಸಗಾರ",

    "Citizens": "ನಾಗರಿಕರು",
    "Workers": "ಕೆಲಸಗಾರರು",
    "Reports": "ವರದಿಗಳು",
    "Analytics": "ವಿಶ್ಲೇಷಣೆ",
    "Resolution Time": "ಪರಿಹಾರ ಸಮಯ",
    "Active Staff": "ಸಕ್ರಿಯ ಸಿಬ್ಬಂದಿ",

    "My Complaints": "ನನ್ನ ದೂರುಗಳು",
    "Community": "ಸಮುದಾಯ",
    "Suggestions": "ಸಲಹೆಗಳು",
    "Transparency": "ಪಾರದರ್ಶಕತೆ",

    "Tasks": "ಕೆಲಸಗಳು",
    "History": "ಇತಿಹಾಸ",
    "Map View": "ನಕ್ಷೆ ನೋಟ",
    "Performance": "ಕಾರ್ಯಕ್ಷಮತೆ",

    "Recent Activity": "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    "Pending Actions": "ಬಾಕಿ ಉಳಿದಿರುವ ಕ್ರಮಗಳು",
    "System Status": "ವ್ಯವಸ್ಥೆಯ ಸ್ಥಿತಿ",
    "Total Grievances": "ಒಟ್ಟು ಕುಂದುಕೊರತೆಗಳು",
    "Resolved": "ಬಗೆಹರಿಸಲಾಗಿದೆ",
    "Pending": "ಬಾಕಿ ಉಳಿದಿದೆ",
    "In Progress": "ಪ್ರಗತಿಯಲ್ಲಿದೆ",

    // Settings
    "Admin Settings": "ಆಡಳಿತಾಧಿಕಾರಿ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "Control security, access, system behavior, and compliance.": "ಸುರಕ್ಷತೆ, ಪ್ರವೇಶ, ವ್ಯವಸ್ಥೆಯ ವರ್ತನೆ ಮತ್ತು ಅನುಸರಣೆಯನ್ನು ನಿಯಂತ್ರಿಸಿ.",
    "Preferences": "ಆದ್ಯತೆಗಳು",
    "Customize your dashboard experience.": "ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅನುಭವವನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ.",
    "Dark Mode": "ಡಾರ್ಕ್ ಮೋಡ್",
    "Switch between light and dark themes": "ಲೈಟ್ ಮತ್ತು ಡಾರ್ಕ್ ಥೀಮ್‌ಗಳ ನಡುವೆ ಬದಲಿಸಿ",
    "Language": "ಭಾಷೆ",
    "Select your preferred language": "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",

    // Citizen Extra
    "Community Impact": "ಸಮುದಾಯ ಪರಿಣಾಮ",
    "Transparency Wall": "ಪಾರದರ್ಶಕತೆ ಗೋಡೆ",
    "Suggestion Box": "ಸಲಹೆ ಪೆಟ್ಟಿಗೆ",
    "Quick Stats": "ತ್ವರಿತ ಅಂಕಿಅಂಶಗಳು",
    "Total": "ಒಟ್ಟು",

    // Worker Extra
    "My Tasks": "ನನ್ನ ಕೆಲಸಗಳು",
    "Schedule": "ವೇಳಾಪಟ್ಟಿ",
    "Shift Tracking": "ಶಿಫ್ಟ್ ಟ್ರ್ಯಾಕಿಂಗ್",
    "Attendance": "ಹಾಜರಾತಿ",
    "Completed": "ಪೂರ್ಣಗೊಂಡಿದೆ",
    "Field Dashboard": "ಕ್ಷೇತ್ರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",

    // Grievance Page
    "Track and manage your submitted reports.": "ನಿಮ್ಮ ಸಲ್ಲಿಸಿದ ವರದಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ.",
    "Search grievance ID or title...": "ದೂರು ಐಡಿ ಅಥವಾ ಶೀರ್ಷಿಕೆಯನ್ನು ಹುಡುಕಿ..."
  }
};
