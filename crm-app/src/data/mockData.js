export const companyData = {
  name: "Solenis",
  industry: "Chemicals / Water Treatment",
  website: "https://www.solenis.com",
  status: "Active",
  description: "Solenis is a leading global producer of specialty chemicals for water-intensive industries, including consumer, industrial, institutional, pulp and paper, and water treatment markets.",
  contact: {
    email: "info@solenis.com",
    phone: "+1 (866) 337-1530",
    altPhone: ""
  },
  address: {
    street: "3 Beaver Valley Road, Suite 500",
    city: "Wilmington",
    state: "DE",
    country: "USA",
    zip: "19803"
  },
  details: {
    employees: "15,000+",
    revenue: "$6.0 Billion",
    type: "Private"
  },
  social: {
    linkedin: "https://linkedin.com/company/solenis",
    twitter: "https://twitter.com/solenis",
    instagram: "https://instagram.com/solenis"
  },
  tags: ["Chemicals", "Water Treatment", "Sustainability", "Supply Chain", "Global"]
};

export const initialAccounts = [
  {
    id: 1,
    name: "Solenis",
    industry: "Chemicals",
    location: "Wilmington, DE",
    size: "10,000+",
    contact: "Dan Key",
    status: "Active",
    linkedin: "https://linkedin.com/company/solenis",
    twitter: "https://twitter.com/solenis",
    instagram: "https://instagram.com/solenis",
    description: "Solenis is a leading global producer of specialty chemicals, focused on sustainable water-intensive processes, industrial solutions, and technology management.",
    contactEmail: "dkey@solenis.com",
    contactPhone: "+1 (866) 337-1530",
    website: "https://www.solenis.com",
    foundedYear: "1907",
    specialties: "Water Treatment, Specialty Chemicals, Pulp & Paper, Customer Equipment Services, Procurement Operations",
    address: "3 Beaver Valley Road, Suite 500, Wilmington, DE 19803, USA"
  },
  {
    id: 2,
    name: "CBRE",
    industry: "Real Estate",
    location: "Dallas, TX",
    size: "10,000+",
    contact: "John Doe",
    status: "Active",
    linkedin: "https://linkedin.com/company/cbre",
    twitter: "https://twitter.com/cbre",
    instagram: "https://instagram.com/cbre",
    description: "CBRE Group, Inc. is the world's largest commercial real estate services and investment firm, serving clients in more than 100 countries.",
    contactEmail: "info@cbre.com",
    contactPhone: "+1 (214) 979-6100",
    website: "https://www.cbre.com",
    foundedYear: "1906",
    specialties: "Commercial Real Estate, Property Management, Investment Advisory, Facilities Management, Valuation",
    address: "2100 McKinney Ave, Suite 1250, Dallas, TX 75201, USA"
  }
];

export const initialContacts = [
  // ── SOLENIS ORG CHART ──
  // Executive Leadership
  { id: 5, firstName: "Dan", lastName: "Key", company: "Solenis", email: "d.key@solenis.com", phone: "+1 (866) 337-1530", city: "Wilmington", jobTitle: "VP Supply Chain & Operations", role: "Executive", department: "Executive", since: "2015", reportsTo: "" },

  // Supply Chain Regional Leaders (reports to Dan Key)
  { id: 6, firstName: "Ahmed", lastName: "Sarhan", company: "Solenis", email: "a.sarhan@solenis.com", phone: "+971 4-555-0101", city: "Dubai", jobTitle: "MEAIR Supply Chain Lead", role: "VP", department: "Supply Chain", since: "2018", reportsTo: "Dan Key" },
  { id: 7, firstName: "Adrian", lastName: "Centelles", company: "Solenis", email: "a.centelles@solenis.com", phone: "+34 91-555-0102", city: "Barcelona", jobTitle: "EU Supply Chain Lead", role: "VP", department: "Supply Chain", since: "2017", reportsTo: "Dan Key" },
  { id: 8, firstName: "Robb", lastName: "Cady", company: "Solenis", email: "r.cady@solenis.com", phone: "+1 302-555-0103", city: "Wilmington", jobTitle: "NAM Supply Chain Lead", role: "VP", department: "Supply Chain", since: "2016", reportsTo: "Dan Key" },
  { id: 9, firstName: "Lily", lastName: "Ng", company: "Solenis", email: "l.ng@solenis.com", phone: "+65 6789-0104", city: "Singapore", jobTitle: "APAC Supply Chain Lead", role: "VP", department: "Supply Chain", since: "2019", reportsTo: "Dan Key" },

  // Functional Leads (reports to Dan Key)
  { id: 10, firstName: "Elodie", lastName: "Thibaut", company: "Solenis", email: "e.thibaut@solenis.com", phone: "+32 2-555-0105", city: "Brussels", jobTitle: "VP Global Procurement", role: "C-Suite", department: "Procurement", since: "2015", reportsTo: "Dan Key" },
  { id: 13, firstName: "Barbara", lastName: "Zaron", company: "Solenis", email: "b.zaron@solenis.com", phone: "+1 302-555-0106", city: "Wilmington", jobTitle: "Global Regulatory Director", role: "C-Suite", department: "Regulatory", since: "2016", reportsTo: "Dan Key" },
  { id: 14, firstName: "Hilde", lastName: "Clause", company: "Solenis", email: "h.clause@solenis.com", phone: "+32 2-555-0107", city: "Antwerp", jobTitle: "VP Customer Equipment", role: "C-Suite", department: "Customer Equipment", since: "2017", reportsTo: "Dan Key" },

  // Procurement Directors (reports to Elodie Thibaut)
  { id: 11, firstName: "Marcel", lastName: "Kniknie", company: "Solenis", email: "m.kniknie@solenis.com", phone: "+31 10-555-0108", city: "Rotterdam", jobTitle: "Indirect Procurement Director", role: "VP", department: "Procurement", since: "2018", reportsTo: "Elodie Thibaut" },
  { id: 12, firstName: "Ravi", lastName: "Sundarraj", company: "Solenis", email: "r.sundarraj@solenis.com", phone: "+91 22-555-0109", city: "Mumbai", jobTitle: "Procurement Excellence Director", role: "VP", department: "Procurement", since: "2019", reportsTo: "Elodie Thibaut" },

  // 1. SC-Analytics team (reports to Santosh NC, who reports to Dan Key)
  { id: 15, firstName: "Santosh", lastName: "NC", company: "Solenis", email: "s.nc@solenis.com", phone: "+91 80-555-0110", city: "Bangalore", jobTitle: "SC-Analytics Lead", role: "Lead", department: "SC-Analytics", since: "2018", reportsTo: "Dan Key" },
  { id: 16, firstName: "Bala", lastName: "Kali Kumar", company: "Solenis", email: "b.kumar@solenis.com", phone: "+91 80-555-0111", city: "Bangalore", jobTitle: "SC-Analytics Specialist", role: "IC", department: "SC-Analytics", since: "2020", reportsTo: "Santosh NC" },
  { id: 17, firstName: "Bhargava", lastName: "Rangavajhala", company: "Solenis", email: "b.ranga@solenis.com", phone: "+91 80-555-0112", city: "Bangalore", jobTitle: "SC-Analytics Specialist", role: "IC", department: "SC-Analytics", since: "2021", reportsTo: "Santosh NC" },
  { id: 18, firstName: "Vineeth", lastName: "Kulkarni", company: "Solenis", email: "v.kulkarni@solenis.com", phone: "+91 80-555-0113", city: "Bangalore", jobTitle: "SC-Analytics Specialist", role: "IC", department: "SC-Analytics", since: "2021", reportsTo: "Santosh NC" },
  { id: 19, firstName: "Deepika", lastName: "Phogat", company: "Solenis", email: "d.phogat@solenis.com", phone: "+91 80-555-0114", city: "Bangalore", jobTitle: "SC-Analytics Specialist", role: "IC", department: "SC-Analytics", since: "2022", reportsTo: "Santosh NC" },
  { id: 20, firstName: "Amit", lastName: "Agrawal", company: "Solenis", email: "a.agrawal@solenis.com", phone: "+91 80-555-0115", city: "Bangalore", jobTitle: "SC-Analytics Specialist", role: "IC", department: "SC-Analytics", since: "2020", reportsTo: "Santosh NC" },
  { id: 21, firstName: "Rahul", lastName: "Dhali", company: "Solenis", email: "r.dhali@solenis.com", phone: "+91 80-555-0116", city: "Bangalore", jobTitle: "SC-Analytics Specialist", role: "IC", department: "SC-Analytics", since: "2022", reportsTo: "Santosh NC" },

  // 2. Quality Management team (reports to Rajesh Konga, who reports to Dan Key)
  { id: 22, firstName: "Rajesh", lastName: "Konga", company: "Solenis", email: "r.konga@solenis.com", phone: "+91 40-555-0117", city: "Hyderabad", jobTitle: "Quality Operations Lead", role: "Lead", department: "Quality Management", since: "2017", reportsTo: "Dan Key" },
  { id: 23, firstName: "Pavani", lastName: "Divya", company: "Solenis", email: "p.divya@solenis.com", phone: "+91 40-555-0118", city: "Hyderabad", jobTitle: "Quality Operations Specialist", role: "IC", department: "Quality Management", since: "2020", reportsTo: "Rajesh Konga" },
  { id: 24, firstName: "Anil", lastName: "Kumar Koti", company: "Solenis", email: "a.koti@solenis.com", phone: "+91 40-555-0119", city: "Hyderabad", jobTitle: "Quality Operations Specialist", role: "IC", department: "Quality Management", since: "2019", reportsTo: "Rajesh Konga" },
  { id: 25, firstName: "Harshitha", lastName: "Garapati", company: "Solenis", email: "h.garapati@solenis.com", phone: "+91 40-555-0120", city: "Hyderabad", jobTitle: "Quality Operations Specialist", role: "IC", department: "Quality Management", since: "2022", reportsTo: "Rajesh Konga" },
  { id: 26, firstName: "Chaitanya", lastName: "K", company: "Solenis", email: "chaitanya@solenis.com", phone: "+91 40-555-0121", city: "Hyderabad", jobTitle: "Quality Operations Specialist", role: "IC", department: "Quality Management", since: "2021", reportsTo: "Rajesh Konga" },
  { id: 27, firstName: "Pranathi", lastName: "Chinnaboina", company: "Solenis", email: "p.chinnaboina@solenis.com", phone: "+91 40-555-0122", city: "Hyderabad", jobTitle: "Quality Operations Specialist", role: "IC", department: "Quality Management", since: "2022", reportsTo: "Rajesh Konga" },
  { id: 28, firstName: "M R", lastName: "Keerthana", company: "Solenis", email: "keerthana@solenis.com", phone: "+91 40-555-0123", city: "Hyderabad", jobTitle: "Quality Operations Specialist", role: "IC", department: "Quality Management", since: "2023", reportsTo: "Rajesh Konga" },
  { id: 29, firstName: "Ipsita", lastName: "Adhikary", company: "Solenis", email: "i.adhikary@solenis.com", phone: "+91 40-555-0124", city: "Hyderabad", jobTitle: "Quality Operations Specialist", role: "IC", department: "Quality Management", since: "2021", reportsTo: "Rajesh Konga" },
  { id: 30, firstName: "Vishnu", lastName: "Sharma", company: "Solenis", email: "v.sharma@solenis.com", phone: "+91 40-555-0125", city: "Hyderabad", jobTitle: "Quality Operations Specialist", role: "IC", department: "Quality Management", since: "2022", reportsTo: "Rajesh Konga" },
  { id: 31, firstName: "Neha", lastName: "Srivastava", company: "Solenis", email: "n.srivastava@solenis.com", phone: "+91 40-555-0126", city: "Hyderabad", jobTitle: "Quality Operations Specialist", role: "IC", department: "Quality Management", since: "2021", reportsTo: "Rajesh Konga" },

  // 3. Projects team (reports to Prabhakar Chunchu, who reports to Dan Key)
  { id: 32, firstName: "Prabhakar", lastName: "Chunchu", company: "Solenis", email: "p.chunchu@solenis.com", phone: "+91 40-555-0127", city: "Hyderabad", jobTitle: "SC Projects Manager", role: "Lead", department: "Projects", since: "2018", reportsTo: "Dan Key" },
  { id: 33, firstName: "Narendra", lastName: "Tummala", company: "Solenis", email: "n.tummala@solenis.com", phone: "+91 40-555-0128", city: "Hyderabad", jobTitle: "SC Projects Specialist", role: "IC", department: "Projects", since: "2020", reportsTo: "Prabhakar Chunchu" },
  { id: 34, firstName: "Pilli", lastName: "Srinivas Reddy", company: "Solenis", email: "s.pilli@solenis.com", phone: "+91 40-555-0129", city: "Hyderabad", jobTitle: "SC Projects Specialist", role: "IC", department: "Projects", since: "2021", reportsTo: "Prabhakar Chunchu" },

  // 4. Supply Chain Business Support: MEAIR team (reports to Ahmed Sarhan)
  { id: 35, firstName: "Mahdeesa", lastName: "Altaf", company: "Solenis", email: "m.altaf@solenis.com", phone: "+971 4-555-0130", city: "Dubai", jobTitle: "MEAIR Supply Planner", role: "IC", department: "Supply Chain", since: "2021", reportsTo: "Ahmed Sarhan" },
  { id: 36, firstName: "Srinivas", lastName: "Alla", company: "Solenis", email: "s.alla@solenis.com", phone: "+971 4-555-0131", city: "Dubai", jobTitle: "MEAIR Logistics Specialist", role: "IC", department: "Supply Chain", since: "2020", reportsTo: "Ahmed Sarhan" },
  { id: 37, firstName: "Swedha", lastName: "Sandrou", company: "Solenis", email: "s.sandrou@solenis.com", phone: "+971 4-555-0132", city: "Dubai", jobTitle: "MEAIR Supply Support", role: "IC", department: "Supply Chain", since: "2022", reportsTo: "Ahmed Sarhan" },

  // Supply Chain Business Support: NAM team (reports to Robb Cady)
  { id: 38, firstName: "Vinay", lastName: "Jonnada", company: "Solenis", email: "v.jonnada@solenis.com", phone: "+1 302-555-0133", city: "Wilmington", jobTitle: "NAM Supply Planner", role: "IC", department: "Supply Chain", since: "2020", reportsTo: "Robb Cady" },
  { id: 39, firstName: "Cody", lastName: "Houser", company: "Solenis", email: "c.houser@solenis.com", phone: "+1 302-555-0134", city: "Wilmington", jobTitle: "NAM Customer Operations Lead", role: "Lead", department: "Supply Chain", since: "2017", reportsTo: "Robb Cady" },
  { id: 40, firstName: "Richard", lastName: "Kloostra", company: "Solenis", email: "r.kloostra@solenis.com", phone: "+1 302-555-0135", city: "Wilmington", jobTitle: "NAM Operations Specialist", role: "IC", department: "Supply Chain", since: "2019", reportsTo: "Cody Houser" },
  { id: 41, firstName: "Angela", lastName: "Mckeirnan", company: "Solenis", email: "a.mckeirnan@solenis.com", phone: "+1 302-555-0136", city: "Wilmington", jobTitle: "NAM Operations Specialist", role: "IC", department: "Supply Chain", since: "2021", reportsTo: "Cody Houser" },

  // Supply Chain Business Support: EU team (reports to Adrian Centelles)
  { id: 42, firstName: "Gokulakrishnan", lastName: "G", company: "Solenis", email: "gokul@solenis.com", phone: "+34 91-555-0137", city: "Barcelona", jobTitle: "EU Planner Specialist", role: "IC", department: "Supply Chain", since: "2021", reportsTo: "Adrian Centelles" },
  { id: 43, firstName: "Eduardo", lastName: "Rodriguez", company: "Solenis", email: "e.rodriguez@solenis.com", phone: "+34 91-555-0138", city: "Barcelona", jobTitle: "EU Logistics Coordinator", role: "IC", department: "Supply Chain", since: "2020", reportsTo: "Adrian Centelles" },
  { id: 44, firstName: "Kathryn", lastName: "Mckenning", company: "Solenis", email: "k.mckenning@solenis.com", phone: "+34 91-555-0139", city: "Barcelona", jobTitle: "EU Supply Planner", role: "IC", department: "Supply Chain", since: "2018", reportsTo: "Adrian Centelles" },

  // Supply Chain Business Support: APAC team (reports to Lily Ng)
  { id: 45, firstName: "Akhil", lastName: "Jilla", company: "Solenis", email: "a.jilla@solenis.com", phone: "+65 6789-0140", city: "Singapore", jobTitle: "APAC Logistics Coordinator", role: "IC", department: "Supply Chain", since: "2022", reportsTo: "Lily Ng" },
  { id: 46, firstName: "Akshayn", lastName: "Solanki", company: "Solenis", email: "a.solanki@solenis.com", phone: "+65 6789-0141", city: "Singapore", jobTitle: "APAC Planner", role: "IC", department: "Supply Chain", since: "2021", reportsTo: "Lily Ng" },
  { id: 47, firstName: "Ranit", lastName: "Das", company: "Solenis", email: "r.das@solenis.com", phone: "+65 6789-0142", city: "Singapore", jobTitle: "APAC Planner", role: "IC", department: "Supply Chain", since: "2022", reportsTo: "Lily Ng" },

  // 5. Procurement team (reports to Marcel Kniknie and Ravi Sundarraj)
  { id: 48, firstName: "Deepthi", lastName: "Vangipurapu", company: "Solenis", email: "d.vangi@solenis.com", phone: "+31 10-555-0143", city: "Rotterdam", jobTitle: "Indirect Procurement Buyer", role: "IC", department: "Procurement", since: "2020", reportsTo: "Marcel Kniknie" },
  { id: 49, firstName: "Arvind", lastName: "Chary", company: "Solenis", email: "a.chary@solenis.com", phone: "+31 10-555-0144", city: "Rotterdam", jobTitle: "Indirect Procurement Buyer", role: "IC", department: "Procurement", since: "2019", reportsTo: "Marcel Kniknie" },
  { id: 50, firstName: "Supriyam", lastName: "Mishra", company: "Solenis", email: "s.mishra@solenis.com", phone: "+91 22-555-0145", city: "Mumbai", jobTitle: "Procurement Excellence Analyst", role: "IC", department: "Procurement", since: "2022", reportsTo: "Ravi Sundarraj" },
  { id: 51, firstName: "Jaswanth", lastName: "Yadav", company: "Solenis", email: "j.yadav@solenis.com", phone: "+91 22-555-0146", city: "Mumbai", jobTitle: "Procurement Excellence Analyst", role: "IC", department: "Procurement", since: "2021", reportsTo: "Ravi Sundarraj" },
  { id: 52, firstName: "Vasanthi", lastName: "Arya", company: "Solenis", email: "v.arya@solenis.com", phone: "+91 22-555-0147", city: "Mumbai", jobTitle: "Indirect Procurement Buyer", role: "IC", department: "Procurement", since: "2020", reportsTo: "Marcel Kniknie" },

  // 6. Regulatory team (reports to Veda Deepika Naidu, who reports to Barbara Zaron)
  { id: 53, firstName: "Veda Deepika", lastName: "Naidu", company: "Solenis", email: "v.naidu@solenis.com", phone: "+1 302-555-0148", city: "Wilmington", jobTitle: "Global Product Safety Lead", role: "Lead", department: "Regulatory", since: "2018", reportsTo: "Barbara Zaron" },
  { id: 54, firstName: "Sreenath", lastName: "Reddy", company: "Solenis", email: "s.reddy@solenis.com", phone: "+1 302-555-0149", city: "Wilmington", jobTitle: "Regulatory Specialist", role: "IC", department: "Regulatory", since: "2020", reportsTo: "Veda Deepika Naidu" },
  { id: 55, firstName: "Jinny", lastName: "Jacob", company: "Solenis", email: "j.jacob@solenis.com", phone: "+1 302-555-0150", city: "Wilmington", jobTitle: "Regulatory Specialist", role: "IC", department: "Regulatory", since: "2019", reportsTo: "Veda Deepika Naidu" },
  { id: 56, firstName: "Adithya", lastName: "Nair", company: "Solenis", email: "a.nair@solenis.com", phone: "+1 302-555-0151", city: "Wilmington", jobTitle: "Regulatory Specialist", role: "IC", department: "Regulatory", since: "2021", reportsTo: "Veda Deepika Naidu" },
  { id: 57, firstName: "Zümra", lastName: "Çomoğlu", company: "Solenis", email: "z.comoglu@solenis.com", phone: "+1 302-555-0152", city: "Wilmington", jobTitle: "Regulatory Specialist", role: "IC", department: "Regulatory", since: "2022", reportsTo: "Veda Deepika Naidu" },
  { id: 58, firstName: "Vishal", lastName: "Rathod", company: "Solenis", email: "v.rathod@solenis.com", phone: "+1 302-555-0153", city: "Wilmington", jobTitle: "Regulatory Specialist", role: "IC", department: "Regulatory", since: "2021", reportsTo: "Veda Deepika Naidu" },

  // 7. Customer Equipment team (reports to John Arokiya Raj, who reports to Hilde Clause)
  { id: 59, firstName: "John Arokiya", lastName: "Raj", company: "Solenis", email: "j.raj@solenis.com", phone: "+32 2-555-0154", city: "Antwerp", jobTitle: "Equipment Services Manager", role: "Lead", department: "Customer Equipment", since: "2018", reportsTo: "Hilde Clause" },
  { id: 60, firstName: "Steve", lastName: "Abraham", company: "Solenis", email: "s.abraham@solenis.com", phone: "+32 2-555-0155", city: "Antwerp", jobTitle: "Remote Monitoring Specialist", role: "IC", department: "Customer Equipment", since: "2020", reportsTo: "John Arokiya Raj" },
  { id: 61, firstName: "Ashisha", lastName: "Shaik", company: "Solenis", email: "a.shaik@solenis.com", phone: "+32 2-555-0156", city: "Antwerp", jobTitle: "Remote Monitoring Specialist", role: "IC", department: "Customer Equipment", since: "2021", reportsTo: "John Arokiya Raj" },
  { id: 62, firstName: "Owais", lastName: "Abdul Kareem", company: "Solenis", email: "o.kareem@solenis.com", phone: "+32 2-555-0157", city: "Antwerp", jobTitle: "Remote Monitoring Specialist", role: "IC", department: "Customer Equipment", since: "2021", reportsTo: "John Arokiya Raj" },
  { id: 63, firstName: "Sai Lakshmi", lastName: "Vamisetti", company: "Solenis", email: "s.vamisetti@solenis.com", phone: "+32 2-555-0158", city: "Antwerp", jobTitle: "Equipment Support Specialist", role: "IC", department: "Customer Equipment", since: "2022", reportsTo: "John Arokiya Raj" },

  // ── CBRE ORIGINAL ORG CHART ──
  // Executive Leadership
  { id: 1001, firstName: "John", lastName: "Doe", company: "CBRE", email: "john.doe@cbre.com", phone: "+1 214-555-0199", city: "Dallas", jobTitle: "Senior Director", role: "Lead", department: "Executive", since: "2017", reportsTo: "Sarah Johnson" },
  { id: 1005, firstName: "Sarah", lastName: "Johnson", company: "CBRE", email: "s.johnson@cbre.com", phone: "+1 415-555-0100", city: "San Francisco", jobTitle: "Chief Executive Officer", role: "Executive", department: "Executive", since: "2018", reportsTo: "" },

  // C-Suite
  { id: 1006, firstName: "Marcus", lastName: "Chen", company: "CBRE", email: "m.chen@cbre.com", phone: "+1 415-555-0101", city: "San Francisco", jobTitle: "Chief Technology Officer", role: "C-Suite", department: "Technology", since: "2019", reportsTo: "Sarah Johnson" },
  { id: 1007, firstName: "David", lastName: "Hart", company: "CBRE", email: "d.hart@cbre.com", phone: "+1 415-555-0112", city: "San Francisco", jobTitle: "Chief Financial Officer", role: "C-Suite", department: "Finance", since: "2019", reportsTo: "Sarah Johnson" },
  { id: 1008, firstName: "Nina", lastName: "Patel", company: "CBRE", email: "n.patel@cbre.com", phone: "+1 415-555-0118", city: "San Francisco", jobTitle: "Chief Marketing Officer", role: "C-Suite", department: "Marketing", since: "2020", reportsTo: "Sarah Johnson" },

  // VPs
  { id: 1009, firstName: "Alex", lastName: "Rivera", company: "CBRE", email: "a.rivera@cbre.com", phone: "+1 415-555-0102", city: "San Francisco", jobTitle: "VP of Engineering", role: "VP", department: "Engineering", since: "2020", reportsTo: "Marcus Chen" },
  { id: 1010, firstName: "Rachel", lastName: "Foster", company: "CBRE", email: "r.foster@cbre.com", phone: "+1 415-555-0109", city: "San Francisco", jobTitle: "VP of Product", role: "VP", department: "Product", since: "2020", reportsTo: "Marcus Chen" },

  // Leads
  { id: 1011, firstName: "Emma", lastName: "Davis", company: "CBRE", email: "e.davis@cbre.com", phone: "+1 415-555-0103", city: "San Francisco", jobTitle: "Frontend Lead", role: "Lead", department: "Engineering", since: "2021", reportsTo: "Alex Rivera" },
  { id: 1012, firstName: "James", lastName: "Wilson", company: "CBRE", email: "j.wilson@cbre.com", phone: "+1 415-555-0106", city: "San Francisco", jobTitle: "Backend Lead", role: "Lead", department: "Engineering", since: "2020", reportsTo: "Alex Rivera" },
  { id: 1026, firstName: "Sophie", lastName: "Lee", company: "CBRE", email: "s.lee@cbre.com", phone: "+1 415-555-0120", city: "San Francisco", jobTitle: "Content Lead", role: "Lead", department: "Marketing", since: "2022", reportsTo: "Jake Thompson" },

  // Managers
  { id: 1013, firstName: "Lisa", lastName: "Chen", company: "CBRE", email: "l.chen@cbre.com", phone: "+1 415-555-0113", city: "San Francisco", jobTitle: "Finance Manager", role: "Manager", department: "Finance", since: "2020", reportsTo: "David Hart" },
  { id: 1024, firstName: "Chris", lastName: "Brown", company: "CBRE", email: "c.brown@cbre.com", phone: "+1 415-555-0116", city: "San Francisco", jobTitle: "Operations Manager", role: "Manager", department: "Operations", since: "2021", reportsTo: "David Hart" },
  { id: 1014, firstName: "Jake", lastName: "Thompson", company: "CBRE", email: "j.thompson@cbre.com", phone: "+1 415-555-0119", city: "San Francisco", jobTitle: "Marketing Manager", role: "Manager", department: "Marketing", since: "2021", reportsTo: "Nina Patel" },
  { id: 1015, firstName: "Diana", lastName: "Cruz", company: "CBRE", email: "d.cruz@cbre.com", phone: "+1 415-555-0122", city: "San Francisco", jobTitle: "Sales Manager", role: "Manager", department: "Sales", since: "2020", reportsTo: "Nina Patel" },
  { id: 1020, firstName: "Tom", lastName: "Bradley", company: "CBRE", email: "t.bradley@cbre.com", phone: "+1 415-555-0110", city: "San Francisco", jobTitle: "Senior Product Manager", role: "Manager", department: "Product", since: "2021", reportsTo: "Rachel Foster" },

  // ICs
  { id: 1016, firstName: "Liam", lastName: "Park", company: "CBRE", email: "l.park@cbre.com", phone: "+1 415-555-0104", city: "San Francisco", jobTitle: "UI Developer", role: "IC", department: "Engineering", since: "2022", reportsTo: "Emma Davis" },
  { id: 1017, firstName: "Priya", lastName: "Nair", company: "CBRE", email: "p.nair@cbre.com", phone: "+1 415-555-0105", city: "San Francisco", jobTitle: "React Developer", role: "IC", department: "Engineering", since: "2023", reportsTo: "Emma Davis" },
  { id: 1018, firstName: "Carlos", lastName: "Ruiz", company: "CBRE", email: "c.ruiz@cbre.com", phone: "+1 415-555-0107", city: "San Francisco", jobTitle: "Node.js Engineer", role: "IC", department: "Engineering", since: "2021", reportsTo: "James Wilson" },
  { id: 1019, firstName: "Zoe", lastName: "Kim", company: "CBRE", email: "z.kim@cbre.com", phone: "+1 415-555-0108", city: "San Francisco", jobTitle: "Python Engineer", role: "IC", department: "Engineering", since: "2022", reportsTo: "James Wilson" },
  { id: 1021, firstName: "Mia", lastName: "Tanaka", company: "CBRE", email: "m.tanaka@cbre.com", phone: "+1 415-555-0111", city: "San Francisco", jobTitle: "UX Designer", role: "IC", department: "Product", since: "2022", reportsTo: "Rachel Foster" },
  { id: 1022, firstName: "Ryan", lastName: "Moore", company: "CBRE", email: "r.moore@cbre.com", phone: "+1 415-555-0114", city: "San Francisco", jobTitle: "Senior Accountant", role: "IC", department: "Finance", since: "2021", reportsTo: "Lisa Chen" },
  { id: 1023, firstName: "Anna", lastName: "White", company: "CBRE", email: "a.white@cbre.com", phone: "+1 415-555-0115", city: "San Francisco", jobTitle: "Financial Analyst", role: "IC", department: "Finance", since: "2022", reportsTo: "Lisa Chen" },
  { id: 1025, firstName: "Natalie", lastName: "Ross", company: "CBRE", email: "n.ross@cbre.com", phone: "+1 415-555-0117", city: "San Francisco", jobTitle: "Operations Analyst", role: "IC", department: "Operations", since: "2023", reportsTo: "Chris Brown" },
  { id: 1027, firstName: "Omar", lastName: "Hassan", company: "CBRE", email: "o.hassan@cbre.com", phone: "+1 415-555-0121", city: "San Francisco", jobTitle: "SEO Specialist", role: "IC", department: "Marketing", since: "2022", reportsTo: "Jake Thompson" },
  { id: 1028, firstName: "Ben",     lastName: "Foster",   company: "CBRE", email: "b.foster@cbre.com",     phone: "+1 415-555-0123", city: "San Francisco", jobTitle: "Account Executive", role: "IC", department: "Sales", since: "2021", reportsTo: "Diana Cruz" },
  { id: 1029, firstName: "Claire",  lastName: "Nguyen",   company: "CBRE", email: "c.nguyen@cbre.com",     phone: "+1 415-555-0124", city: "San Francisco", jobTitle: "Sales Representative", role: "IC", department: "Sales", since: "2022", reportsTo: "Diana Cruz" }
];

export function buildOrgTree(contacts, company) {
  const nodes = {};
  const scopedContacts = company
    ? contacts.filter(c => c.company === company)
    : contacts;

  scopedContacts.forEach(c => {
    if (!c.role && !c.reportsTo) return; // skip contacts without org role or hierarchy
    const name = `${c.firstName} ${c.lastName}`;
    nodes[name] = {
      key: String(c.id),
      expanded: true,
      data: {
        name,
        title: c.jobTitle || '',
        role: c.role || 'IC',
        department: c.department || '',
        email: c.email,
        phone: c.phone,
        avatar: `${c.firstName[0]}${c.lastName[0]}`,
        since: c.since || '—',
        company: c.company,
        city: c.city,
      },
      children: [],
    };
  });

  const roots = [];
  scopedContacts.forEach(c => {
    if (!c.role && !c.reportsTo) return;
    const name = `${c.firstName} ${c.lastName}`;
    const node = nodes[name];
    if (!c.reportsTo || !nodes[c.reportsTo]) {
      roots.push(node);
    } else {
      nodes[c.reportsTo].children.push(node);
    }
  });

  if (roots.length === 1) {
    return roots[0];
  }

  if (roots.length > 1) {
    return {
      key: 'org-root',
      expanded: true,
      data: {
        name: company || 'Organization',
        title: 'Org Chart',
        role: 'Executive',
        department: company || '',
        email: '',
        phone: '',
        avatar: company ? company[0] : 'O',
        since: '—',
        company: company || '',
        city: '',
      },
      children: roots,
    };
  }

  return null;
}
