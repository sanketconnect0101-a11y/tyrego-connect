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
    location: "Bandra West",
    distanceKm: 1.2,
    etaMin: 6,
    amount: 120,
    priority: "normal",
    customerName: "Amit Kumar",
    customerPhone: "+91 99800 11122",
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
