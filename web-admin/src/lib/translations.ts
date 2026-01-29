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
    "Search grievance ID or title...": "Search grievance ID or title...",

    // WhatsApp Support
    "WhatsApp Support": "WhatsApp Support",
    "Chat with Ultron for instant help.": "Chat with Ultron for instant help.",

    // Admin Grievance Page
    "Grievance Management": "Grievance Management",
    "Manage and monitor all citizen grievances": "Manage and monitor all citizen grievances",
    "Rejected": "Rejected",
    "Electricity": "Electricity",
    "Water Supply": "Water Supply",
    "Sanitation": "Sanitation",
    "Infrastructure": "Infrastructure",
    "Drainage": "Drainage",
    "Others": "Others",
    "Type of Worker Needed / Category": "Type of Worker Needed / Category",
    "Department": "Department",
    "Good Morning": "Good Morning",
    "Search by ID, title, or citizen name...": "Search by ID, title, or citizen name...",
    "All Status": "All Status",
    "All Priority": "All Priority",
    "High": "High",
    "Medium": "Medium",
    "Low": "Low",
    "Category": "Category",
    "Priority": "Priority",
    "Assigned To": "Assigned To",
    "Created": "Created",
    "Actions": "Actions",
    "Not assigned": "Not assigned",
    "No grievances found matching your filters": "No grievances found matching your filters",

    // Chatbot
    "Type a message...": "Type a message...",
    "Hello! I am Ultron, your AI assistant. How can I help you today?": "Hello! I am Ultron, your AI assistant. How can I help you today?",
    "You can file a new grievance from the 'Grievances' tab in the sidebar.": "You can file a new grievance from the 'Grievances' tab in the sidebar.",
    "To check the status of your grievance, go to 'My Grievances'.": "To check the status of your grievance, go to 'My Grievances'.",
    "You can contact our support team at support@janpath.gov.in": "You can contact our support team at support@janpath.gov.in",
    "Hello! How can I assist you with your civic issues today?": "Hello! How can I assist you with your civic issues today?",
    "I'm not sure how to help with that. Please try asking about grievances or status.": "I'm not sure how to help with that. Please try asking about grievances or status."
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
    "Search grievance ID or title...": "शिकायत आईडी या शीर्षक खोजें...",
    
    // WhatsApp Support
    "WhatsApp Support": "व्हाट्सएप सपोर्ट",
    "Chat with Ultron for instant help.": "त्वरित सहायता के लिए अल्ट्रॉन से चैट करें।",

    // Admin Grievance Page
    "Grievance Management": "शिकायत प्रबंधन",
    "Manage and monitor all citizen grievances": "सभी नागरिक शिकायतों का प्रबंधन और निगरानी करें",
    "Rejected": "अस्वीकृत",
    "Electricity": "बिजली",
    "Water Supply": "जलापूर्ति",
    "Sanitation": "स्वच्छता",
    "Infrastructure": "बुनियादी ढांचा",
    "Drainage": "जल निकासी",
    "Others": "अन्य",
    "Type of Worker Needed / Category": "आवश्यक कर्मचारी का प्रकार / श्रेणी",
    "Department": "विभाग",
    "Good Morning": "सुप्रभात",
    "Search by ID, title, or citizen name...": "आईडी, शीर्षक या नागरिक के नाम से खोजें...",
    "All Status": "सभी स्थिति",
    "All Priority": "सभी प्राथमिकता",
    "High": "उच्च",
    "Medium": "मध्यम",
    "Low": "कम",
    "Category": "श्रेणी",
    "Priority": "प्राथमिकता",
    "Assigned To": "किसे सौंपा गया",
    "Created": "बनाया गया",
    "Actions": "कार्रवाई",
    "Not assigned": "सौंपा नहीं गया",
    "No grievances found matching your filters": "आपके फिल्टर से मेल खाने वाली कोई शिकायत नहीं मिली",

    // Chatbot
    "Type a message...": "कोई संदेश टाइप करें...",
    "Hello! I am Ultron, your AI assistant. How can I help you today?": "नमस्ते! मैं अल्ट्रॉन हूँ, आपका एआई सहायक। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    "You can file a new grievance from the 'Grievances' tab in the sidebar.": "आप साइडबार में 'शिकायतें' टैब से नई शिकायत दर्ज कर सकते हैं।",
    "To check the status of your grievance, go to 'My Grievances'.": "अपनी शिकायत की स्थिति जाँचने के लिए, 'मेरी शिकायतें' पर जाएँ।",
    "You can contact our support team at support@janpath.gov.in": "आप हमारी सहायता टीम से support@janpath.gov.in पर संपर्क कर सकते हैं",
    "Hello! How can I assist you with your civic issues today?": "नमस्ते! आज मैं आपके नागरिक मुद्दों में कैसे सहायता कर सकता हूँ?",
    "I'm not sure how to help with that. Please try asking about grievances or status.": "मुझे यकीन नहीं है कि इसमें मदद कैसे की जाए। कृपया शिकायतों या स्थिति के बारे में पूछने का प्रयास करें।"
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
    "Search grievance ID or title...": "குறை ஐடி அல்லது தலைப்பைத் தேடவும்...",

    // WhatsApp Support
    "WhatsApp Support": "வாட்ஸ்அப் ஆதரவு",
    "Chat with Ultron for instant help.": "உடனடி உதவிக்கு அல்ட்ரானுடன் அரட்டையடிக்கவும்.",

    // Admin Grievance Page
    "Grievance Management": "குறை மேலாண்மை",
    "Manage and monitor all citizen grievances": "அனைத்து குடிமக்கள் குறைகளையும் நிர்வகிக்கவும் மற்றும் கண்காணிக்கவும்",
    "Rejected": "நிராகரிக்கப்பட்டது",
    "Electricity": "மின்சாரம்",
    "Water Supply": "குடிநீர் வழங்கல்",
    "Sanitation": "சுகாதாரம்",
    "Infrastructure": "உள்கட்டமைப்பு",
    "Drainage": "வடிகால்",
    "Others": "மற்றவை",
    "Type of Worker Needed / Category": "தேவையான பணியாளர் வகை / வகை",
    "Department": "துறை",
    "Good Morning": "காலை வணக்கம்",
    "Search by ID, title, or citizen name...": "ஐடி, தலைப்பு அல்லது குடிமகன் பெயரால் தேடவும்...",
    "All Status": "அனைத்து நிலை",
    "All Priority": "அனைத்து முன்னுரிமை",
    "High": "உயர்",
    "Medium": "நடுத்தர",
    "Low": "குறைந்த",
    "Category": "வகை",
    "Priority": "முன்னுரிமை",
    "Assigned To": "ஒதுக்கப்பட்டது",
    "Created": "உருவாக்கப்பட்டது",
    "Actions": "செயல்கள்",
    "Not assigned": "ஒதுக்கப்படவில்லை",
    "No grievances found matching your filters": "வடிகட்டிகளுடன் பொருந்தும் குறைகள் எதுவும் இல்லை",

    // Chatbot
    "Type a message...": "செய்தியைத் தட்டச்சு செய்க...",
    "Hello! I am Ultron, your AI assistant. How can I help you today?": "வணக்கம்! நான் அல்ட்ரான், உங்கள் AI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    "You can file a new grievance from the 'Grievances' tab in the sidebar.": "பக்கப்பட்டியில் உள்ள 'குறைகள்' தாவலில் இருந்து புதிய குறையைத் தாக்கல் செய்யலாம்.",
    "To check the status of your grievance, go to 'My Grievances'.": "உங்கள் குறையின் நிலையைக் காண, 'என் குறைகள்' பகுதிக்குச் செல்லவும்.",
    "You can contact our support team at support@janpath.gov.in": "எங்கள் ஆதரவு குழுவை support@janpath.gov.in இல் தொடர்பு கொள்ளலாம்",
    "Hello! How can I assist you with your civic issues today?": "வணக்கம்! இன்று உங்கள் குடிமைப் பிரச்சினைகளில் நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    "I'm not sure how to help with that. Please try asking about grievances or status.": "எனக்கு அதில் எப்படி உதவுவது என்று தெரியவில்லை. தயவுசெய்து குறைகள் அல்லது நிலை பற்றி கேட்கவும்."
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
    "Search grievance ID or title...": "ఫిర్యాదు ఐడి లేదా శీర్షికను శోధించండి...",

    // WhatsApp Support
    "WhatsApp Support": "వాట్సాప్ మద్దతు",
    "Chat with Ultron for instant help.": "తక్షణ సహాయం కోసం ఆల్ట్రాన్‌తో చాట్ చేయండి.",

    // Admin Grievance Page
    "Grievance Management": "ఫిర్యాదుల నిర్వహణ",
    "Manage and monitor all citizen grievances": "అన్ని పౌరుల ఫిర్యాదులను నిర్వహించండి మరియు పర్యవేక్షించండి",
    "Rejected": "తిరస్కరించబడింది",
    "Electricity": "విద్యుత్",
    "Water Supply": "నీటి సరఫరా",
    "Sanitation": "పారిశుధ్యం",
    "Infrastructure": "మౌలిక సదుపాయాలు",
    "Drainage": "మురుగునీరు",
    "Others": "ఇతరాలు",
    "Type of Worker Needed / Category": "అవసరమైన పనివాడు రకం / వర్గం",
    "Department": "శాఖ",
    "Good Morning": "శుభోదయం",
    "Search by ID, title, or citizen name...": "ID, శీర్షిక లేదా పౌర పేరు ద్వారా శోధించండి...",
    "All Status": "అన్ని స్థితి",
    "All Priority": "అన్ని ప్రాధాన్యత",
    "High": "అధిక",
    "Medium": "మధ్యస్థ",
    "Low": "తక్కువ",
    "Category": "డెవలపర్",
    "Priority": "ప్రాధాన్యత",
    "Assigned To": "కేటాయించబడింది",
    "Created": "సృష్టించబడింది",
    "Actions": "చర్యలు",
    "Not assigned": "కేటాయించబడలేదు",
    "No grievances found matching your filters": "మీ ఫిల్టర్లకు సరిపోలే ఫిర్యాదులు ఏవీ కనుగొనబడలేదు",

    // Chatbot
    "Type a message...": "సందేశాన్ని టైప్ చేయండి...",
    "Hello! I am Ultron, your AI assistant. How can I help you today?": "హలో! నేను అల్ట్రాన్, మీ AI అసిస్టెంట్. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?",
    "You can file a new grievance from the 'Grievances' tab in the sidebar.": "సైడ్‌బార్‌లోని 'ఫిర్యాదులు' ట్యాబ్ నుండి మీరు కొత్త ఫిర్యాదును దాఖలు చేయవచ్చు.",
    "To check the status of your grievance, go to 'My Grievances'.": "మీ ఫిర్యాదు స్థితిని తనిఖీ చేయడానికి, 'నా ఫిర్యాదులు' కి వెళ్లండి.",
    "You can contact our support team at support@janpath.gov.in": "మీరు మా మద్దతు బృందాన్ని support@janpath.gov.in వద్ద సంప్రదించవచ్చు",
    "Hello! How can I assist you with your civic issues today?": "హలో! ఈ రోజు మీ పౌర సమస్యలతో నేను మీకు ఎలా సహాయపడగలను?",
    "I'm not sure how to help with that. Please try asking about grievances or status.": "దానితో ఎలా సహాయం చేయాలో నాకు ఖచ్చితంగా తెలియదు. దయచేసి ఫిర్యాదులు లేదా స్థితి గురించి అడగడానికి ప్రయత్నించండి."
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
    "Search grievance ID or title...": "অভিযোগ আইডি বা শিরোনাম অনুসন্ধান করুন...",

    // WhatsApp Support
    "WhatsApp Support": "হোয়াটসঅ্যাপ সাপোর্ট",
    "Chat with Ultron for instant help.": "তাৎক্ষণিক সহায়তার জন্য আলট্রনের সাথে চ্যাট করুন।",

    // Admin Grievance Page
    "Grievance Management": "অভিযোগ ব্যবস্থাপনা",
    "Manage and monitor all citizen grievances": "সমস্ত নাগরিক অভিযোগ পরিচালনা এবং পর্যবেক্ষণ করুন",
    "Rejected": "প্রত্যাখ্যাত",
    "Electricity": "বিদ্যুৎ",
    "Water Supply": "জল সরবরাহ",
    "Sanitation": "স্যানিটেশন",
    "Infrastructure": "অবকাঠামো",
    "Drainage": "ড্রেনেজ",
    "Others": "অন্যান্য",
    "Type of Worker Needed / Category": "প্রয়োজনীয় কর্মীর ধরন / বিভাগ",
    "Department": "বিভাগ",
    "Good Morning": "সুপ্রভাত",
    "Search by ID, title, or citizen name...": "আইডি, শিরোনাম, বা নাগরিক নাম দ্বারা অনুসন্ধান করুন...",
    "All Status": "সমস্ত স্থিতি",
    "All Priority": "সমস্ত অগ্রাধিকার",
    "High": "উচ্চ",
    "Medium": "মাঝারি",
    "Low": "নিম্ন",
    "Category": "বিভাগ",
    "Priority": "অগ্রাধিকার",
    "Assigned To": "নিয়োজিত",
    "Created": "তৈরি হয়েছে",
    "Actions": "কর্ম",
    "Not assigned": "নিয়োজিত নয়",
    "No grievances found matching your filters": "আপনার ফিল্টারগুলোর সাথে মিল থাকা কোনো অভিযোগ পাওয়া যায়নি",

    // Chatbot
    "Type a message...": "একটি বার্তা টাইপ করুন...",
    "Hello! I am Ultron, your AI assistant. How can I help you today?": "হ্যালো! আমি আলট্রন, আপনার এআই সহকারী। আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি?",
    "You can file a new grievance from the 'Grievances' tab in the sidebar.": "আপনি সাইডবারের 'অভিযোগ' ট্যাব থেকে একটি নতুন অভিযোগ দায়ের করতে পারেন।",
    "To check the status of your grievance, go to 'My Grievances'.": "আপনার অভিযোগের স্থিতি পরীক্ষা করতে, 'আমার অভিযোগ' এ যান।",
    "You can contact our support team at support@janpath.gov.in": "আপনি আমাদের সহায়তা দলের সাথে support@janpath.gov.in এ যোগাযোগ করতে পারেন",
    "Hello! How can I assist you with your civic issues today?": "হ্যালো! আজ আমি আপনার নাগরিক সমস্যাগুলিতে আপনাকে কীভাবে সহায়তা করতে পারি?",
    "I'm not sure how to help with that. Please try asking about grievances or status.": "আমি নিশ্চিত নই কিভাবে এটিতে সাহায্য করব। অনুগ্রহ করে অভিযোগ বা স্থিতি সম্পর্কে জিজ্ঞাসা করার চেষ্টা করুন।"
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
    "Search grievance ID or title...": "ದೂರು ಐಡಿ ಅಥವಾ ಶೀರ್ಷಿಕೆಯನ್ನು ಹುಡುಕಿ...",

    // WhatsApp Support
    "WhatsApp Support": "WhatsApp ಬೆಂಬಲ",
    "Chat with Ultron for instant help.": "ತ್ವರಿತ ಸಹಾಯಕ್ಕಾಗಿ ಅಲ್ಟ್ರಾನ್‌ನೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ.",

    // Admin Grievance Page
    "Grievance Management": "ಕುಂದುಕೊರತೆ ನಿರ್ವಹಣೆ",
    "Manage and monitor all citizen grievances": "ನಾಗರಿಕರ ಎಲ್ಲಾ ಕುಂದುಕೊರತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ",
    "Rejected": "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",    "Electricity": "ವಿದ್ಯುತ್",
    "Water Supply": "ನೀರು ಸರಬರಾಜು",
    "Sanitation": "ನೈರ್ಮಲ್ಯ",
    "Infrastructure": "ಮೂಲಭೂತ ಸೌಕರ್ಯ",
    "Drainage": "ಚರಂಡಿ",
    "Others": "ಇತರರು",
    "Type of Worker Needed / Category": "ಅಗತ್ಯವಿರುವ ಕೆಲಸಗಾರರ ಪ್ರಕಾರ / ವರ್ಗ",
    "Department": "ಇಲಾಖೆ",
    "Good Morning": "ಶುಭೋದಯ",    "Search by ID, title, or citizen name...": "ಐಡಿ, ಶೀರ್ಷಿಕೆ ಅಥವಾ ನಾಗರಿಕನ ಹೆಸರಿನ ಮೂಲಕ ಹುಡುಕಿ...",
    "All Status": "ಎಲ್ಲಾ ಸ್ಥಿತಿ",
    "All Priority": "ಎಲ್ಲಾ ಆದ್ಯತೆ",
    "High": "ಹೆಚ್ಚಿನ",
    "Medium": "ಮಧ್ಯಮ",
    "Low": "ಕಡಿಮೆ",
    "Category": "ವರ್ಗ",
    "Priority": "ಆದ್ಯತೆ",
    "Assigned To": "ನಿಯೋಜಿಸಲಾಗಿದೆ",
    "Created": "ರಚಿಸಲಾಗಿದೆ",
    "Actions": "ಕ್ರಮಗಳು",
    "Not assigned": "ನಿಯೋಜಿಸಲಾಗಿಲ್ಲ",
    "No grievances found matching your filters": "ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ಕುಂದುಕೊರತೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",

    // Chatbot
    "Type a message...": "ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
    "Hello! I am Ultron, your AI assistant. How can I help you today?": "ನಮಸ್ಕಾರ! ನಾನು ಅಲ್ಟ್ರಾನ್, ನಿಮ್ಮ AI ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    "You can file a new grievance from the 'Grievances' tab in the sidebar.": "ಸೈಡ್‌ಬಾರ್‌ನಲ್ಲಿರುವ 'ಕುಂದುಕೊರತೆಗಳು' ಟ್ಯಾಬ್‌ನಿಂದ ನೀವು ಹೊಸ ದೂರನ್ನು ಸಲ್ಲಿಸಬಹುದು.",
    "To check the status of your grievance, go to 'My Grievances'.": "ನಿಮ್ಮ ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲು, 'ನನ್ನ ದೂರುಗಳು' ಗೆ ಹೋಗಿ.",
    "You can contact our support team at support@janpath.gov.in": "ನಮ್ಮ ಬೆಂಬಲ ತಂಡವನ್ನು support@janpath.gov.in ನಲ್ಲಿ ಸಂಪರ್ಕಿಸಬಹುದು",
    "Hello! How can I assist you with your civic issues today?": "ನಮಸ್ಕಾರ! ಇಂದು ನಿಮ್ಮ ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳೊಂದಿಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    "I'm not sure how to help with that. Please try asking about grievances or status.": "ಅದಕ್ಕೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬೇಕೆಂದು ನನಗೆ ಖಚಿತವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕುಂದುಕೊರತೆಗಳು ಅಥವಾ ಸ್ಥಿತಿಯ ಬಗ್ಗೆ ಕೇಳಲು ಪ್ರಯತ್ನಿಸಿ."
  }
};
