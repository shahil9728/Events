import { HospitalityRoles } from "./employeeConstants";

type BaseFilterCategory = {
    title: string;
    key: string;
};

type OptionFilterCategory = BaseFilterCategory & {
    type: 'option';
    multiple?: boolean;
    options: string[];
};

type RangeFilterCategory = BaseFilterCategory & {
    type: 'range';
    min: number;
    max: number;
};

export type FilterCategory = OptionFilterCategory | RangeFilterCategory;


export const FILTER_CATEGORIES: FilterCategory[] = [
    {
        title: 'Role',
        key: 'role',
        type: 'option',
        multiple: true,
        options: HospitalityRoles.map(role => role.label), 
    },
    {
        title: 'Salary',
        key: 'salary',
        type: 'range',
        min: 0,
        max: 10000,
    },
    // {
    //     title: 'Experience',
    //     key: 'experience',
    //     multiple: true,
    //     options: ['0-1 Years', '1-2 Years', '2+ Years'],
    // },
    // {
    //     title: 'Total Deals',
    //     key: 'dealsCompleted',
    //     multiple: false,
    //     options: ['<10', '10+', '50+'],
    // },
];
