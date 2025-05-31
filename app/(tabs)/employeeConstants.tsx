export type ImageKey1 =
    | 'wedding'
    | 'wedding1'
    | 'wedding2'
    | 'concert'
    | 'comedy'
    | 'comedy1';


export const imageRequireMap: Record<ImageKey1, number> = {
    wedding: require('../../assets/images/wedding.jpg'),
    wedding1: require('../../assets/images/wedding1.png'),
    wedding2: require('../../assets/images/wedding2.png'),
    concert: require('../../assets/images/concert.png'),
    comedy: require('../../assets/images/comedy.png'),
    comedy1: require('../../assets/images/comedy1.png'),
};

export const GenderConstants = [
    { label: 'Male', value: '1' },
    { label: 'Female', value: '2' },
    { label: 'Prefer Not to Say', value: '3' },
];


export const UserRole = {
    EMPLOYEE: 'EMPLOYEE',
    MANAGER: 'MANAGER',
}

export const HospitalityRoles = [
    { label: 'Audio-Visual Technician', value: '1' },
    { label: 'Banquet Server', value: '2' },
    { label: 'Barista', value: '3' },
    { label: 'Bartender', value: '4' },
    { label: 'Cashier', value: '5' },
    { label: 'Catering Staff', value: '6' },
    { label: 'Chef', value: '7' },
    { label: 'Concierge', value: '8' },
    { label: 'DJ', value: '9' },
    { label: 'Entertainer', value: '10' },
    { label: 'Event Coordinator', value: '11' },
    { label: 'Event Setup Crew', value: '12' },
    { label: 'Front Desk', value: '13' },
    { label: 'Host/Hostess', value: '14' },
    { label: 'Housekeeping', value: '15' },
    { label: 'Kitchen Assistant', value: '16' },
    { label: 'Logistics Manager', value: '17' },
    { label: 'Maintenance Staff', value: '18' },
    { label: 'Resort Staff', value: '19' },
    { label: 'Security', value: '20' },
    { label: 'Shadow', value: '21' },
    { label: 'Sommelier', value: '22' },
    { label: 'Sous Chef', value: '23' },
    { label: 'Valet Parking', value: '24' },
    { label: 'Waiter/Waitress', value: '25' }
];

export const HospitalityRolesObject = HospitalityRoles.reduce<Record<string, string>>((acc, role) => {
    acc[role.value] = role.label;
    return acc;
}, {});

export const EVENT_CATEGORIES = [
    { label: 'Comedy', value: 'Comedy' },
    { label: 'Wedding', value: 'Wedding' },
    { label: 'Concert', value: 'Concert' },
    { label: 'Birthday Party', value: 'Birthday_Party' },
    { label: 'Conference', value: 'Conference' },
    { label: 'Exhibition', value: 'Exhibition' },
    { label: 'Product Launch', value: 'Product_Launch' },
    { label: 'Private Dinner', value: 'Private_Dinner' },
    { label: 'Award Show', value: 'Award_Show' },
    { label: 'Fashion Show', value: 'Fashion_Show' },
];

export const employeeDetails = (location: string, rating?: string) => [
    { icon: "map-pin", type: "feather", text: location },
    // { icon: "star", type: "font-awesome", text: rating || "4.8" },
    // { icon: "school-outline", type: "ionicon", text: "3+ years" },
];



