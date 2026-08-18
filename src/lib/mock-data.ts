export type Lead = {
  id: string;
  vehicle: string;
  vehicleIcon: string;
  problem: string;
  problemDetails?: string;
  photo?: string;
  location: string;
  distanceKm: number;
  etaMin: number;
  amount: number;
  priority: "high" | "normal";
  customerName: string;
  customerPhone: string;
};


export type Staff = {
  id: string;
  name: string;
  phone: string;
  vehicles: string[];
  active: boolean;
  distanceKm: number;
  avatar: string;
};

export type Job = {
  id: string;
  vehicle: string;
  problem: string;
  customer: string;
  amount: number;
  status: "active" | "completed" | "cancelled";
  staff?: string;
  time: string;
};

export const incomingLeads: Lead[] = [
  {
    id: "L-9821",
    vehicle: "Car",
    vehicleIcon: "🚗",
    problem: "Front Left Tyre Puncture",
    problemDetails: "Driving se ekdam flat ho gaya, side mein gaadi khadi hai. Spare tyre nahi hai.",
    photo: "https://images.unsplash.com/photo-1597007030739-6d2e7172ee6c?w=600&q=70",
    location: "Andheri East, Mumbai",
    distanceKm: 2.3,
    etaMin: 12,
    amount: 250,
    priority: "high",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98200 12345",
  },
  {
    id: "L-9822",
    vehicle: "Bike",
    vehicleIcon: "🏍️",
    problem: "Rear tyre flat, need replacement",
    problemDetails: "Tyre bilkul phat gaya hai, ride nahi kar sakta. Naya tyre chahiye.",
    photo: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=70",
    location: "Powai, Mumbai",
    distanceKm: 3.8,
    etaMin: 16,
    amount: 480,
    priority: "normal",
    customerName: "Priya Mehta",
    customerPhone: "+91 98765 43210",
  },
  {
    id: "L-9823",
    vehicle: "SUV",
    vehicleIcon: "🚙",
    problem: "Air filling all 4 tyres",
    problemDetails: "Sab tyre mein hawa kam lag rahi hai, ek pe TPMS warning aa rahi hai.",
    photo: "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=600&q=70",
    location: "Bandra West",
    distanceKm: 1.2,
    etaMin: 6,
    amount: 120,
    priority: "normal",
    customerName: "Amit Kumar",
    customerPhone: "+91 99800 11122",
  },
  {
    id: "L-9824",
    vehicle: "Tow Van",
    vehicleIcon: "🛻",
    problem: "Tow Van Required — Vehicle Breakdown",
    problemDetails: "Gaadi bilkul band ho gayi hai, start nahi ho rahi. Nearest garage tak tow chahiye. Fixed rate ₹1,500.",
    photo: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=70",
    location: "Sakinaka Junction, Mumbai",
    distanceKm: 2.8,
    etaMin: 14,
    amount: 1500,
    priority: "high",
    customerName: "Vivek Joshi",
    customerPhone: "+91 98330 55667",
  },
];


export const staffList: Staff[] = [
  { id: "S1", name: "Ramesh Yadav", phone: "+91 98111 22222", vehicles: ["Bike", "Car", "Auto"], active: true, distanceKm: 0.4, avatar: "RY" },
  { id: "S2", name: "Sunil Kumar", phone: "+91 98111 33333", vehicles: ["Truck", "Bus", "SUV"], active: true, distanceKm: 1.2, avatar: "SK" },
  { id: "S3", name: "Vikas Patil", phone: "+91 98111 44444", vehicles: ["Bike", "Cycle"], active: false, distanceKm: 2.0, avatar: "VP" },
];

export const recentJobs: Job[] = [
  { id: "J-7782", vehicle: "Car", problem: "Puncture repair", customer: "Neha Singh", amount: 250, status: "active", staff: "Ramesh Yadav", time: "12 min ago" },
  { id: "J-7781", vehicle: "Bike", problem: "Tyre replacement", customer: "Arjun Rao", amount: 1850, status: "completed", staff: "Sunil Kumar", time: "1 hr ago" },
  { id: "J-7780", vehicle: "Auto", problem: "Air filling", customer: "Kiran Joshi", amount: 80, status: "completed", staff: "Ramesh Yadav", time: "3 hr ago" },
  { id: "J-7779", vehicle: "SUV", problem: "Wheel change", customer: "Pooja Iyer", amount: 600, status: "cancelled", time: "Yesterday" },
];

export const vehicleTypes = [
  { id: "cycle", label: "Cycle", icon: "🚲" },
  { id: "bike", label: "Bike", icon: "🏍️" },
  { id: "auto", label: "Auto", icon: "🛺" },
  { id: "car", label: "Car", icon: "🚗" },
  { id: "suv", label: "SUV", icon: "🚙" },
  { id: "truck", label: "Truck", icon: "🚚" },
  { id: "bus", label: "Bus", icon: "🚌" },
  { id: "tractor", label: "Tractor", icon: "🚜" },
];

export const serviceTypes = [
  { id: "puncture", label: "Puncture Repair", icon: "🔧", desc: "Quick fix for flat tyres" },
  { id: "replace", label: "Tyre Replacement", icon: "🛞", desc: "Full tyre change service" },
  { id: "air", label: "Air Filling", icon: "💨", desc: "Pressure top-up" },
  { id: "wheel", label: "Wheel Change", icon: "⚙️", desc: "Wheel swap & balancing" },
  { id: "battery", label: "Battery Support", icon: "🔋", desc: "Jump-start & replacement" },
];

export type Offer = {
  id: string;
  title: string;
  desc: string;
  code: string;
  type: "auto" | "coupon";
  discountType: "flat" | "percent";
  value: number;
  maxDiscount?: number;
  minOrder: number;
};

export const eligibleOffers: Offer[] = [
  { id: "OF1", title: "Instant ₹30 Off", desc: "Auto applied on all roadside jobs", code: "AUTO30", type: "auto", discountType: "flat", value: 30, minOrder: 100 },
  { id: "OF2", title: "10% Off up to ₹100", desc: "UPI payments par extra bachat", code: "UPI10", type: "coupon", discountType: "percent", value: 10, maxDiscount: 100, minOrder: 200 },
  { id: "OF3", title: "Flat ₹150 Off", desc: "Tow van & breakdown jobs ke liye", code: "TOW150", type: "coupon", discountType: "flat", value: 150, minOrder: 1000 },
  { id: "OF4", title: "First Service ₹50 Off", desc: "New customer welcome offer", code: "FIRST50", type: "coupon", discountType: "flat", value: 50, minOrder: 150 },
];
