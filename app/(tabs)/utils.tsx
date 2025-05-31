import { HospitalityRolesObject, ImageKey1, imageRequireMap } from "./employeeConstants";
import { Text } from "react-native";
import { supabase } from "@/lib/supabase";
import { Dispatch } from "redux";
import { setEmployeeId, setManagerId } from "../redux/Employee/accountInfo/accountInfoActions";

export function getFriendlydate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
}

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getRandomProfileImage = () => {
    const gender = Math.random() < 0.5 ? 'men' : 'women';
    const number = Math.floor(Math.random() * 100); // random 0-99
    return `https://randomuser.me/api/portraits/${gender}/${number}.jpg`;
};

export const formatRoles = (role: string | string[] | undefined): React.ReactNode => {
    let roleArray: string[] = [];

    if (typeof role === 'string' && role.includes(',')) {
        roleArray = role.split(',').map(r => r.trim());
    } else if (Array.isArray(role)) {
        roleArray = [...role];
    } else if (role) {
        roleArray = [role];
    }

    if (roleArray.length === 0) {
        return 'No role specified';
    }

    const displayRoles = roleArray.slice(0, 2).map(r => HospitalityRolesObject[r] || r);
    const moreRolesCount = roleArray.length - 2;

    return (
        <>
            {displayRoles.join(', ')}
            {moreRolesCount > 0 &&
                <Text style={{ color: '#76802C', fontSize: 10, marginLeft: 10 }}>
                    &nbsp;&nbsp;+{moreRolesCount} more
                </Text>
            }
        </>
    );
};

export const getRandomImageKey = (): ImageKey1 => {
    const keys = Object.keys(imageRequireMap) as ImageKey1[];
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
}

export const getManagerId = async (accountInfo: any, dispatch: Dispatch) => {
    if (accountInfo?.manager_id) {
        console.log("b", accountInfo.manager_id);
        return accountInfo.manager_id;
    }

    try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
            throw new Error('Failed to fetch manager ID');
        }

        const managerId = data.user.id;
        dispatch(setManagerId(managerId));
        return managerId;
    } catch (err) {
        console.error('Error fetching manager ID:', err);
        return null;
    }
};

export const getEmployeeId = async (accountInfo: any, dispatch: Dispatch) => {
    if (accountInfo.employee_id) {
        return accountInfo.employee_id;
    }

    try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
            throw new Error('Failed to fetch employee ID');
        }

        const employeeId = data.user.id;
        dispatch(setEmployeeId(employeeId));
        return employeeId;
    } catch (err) {
        console.error('Error fetching employee ID:', err);
        return null;
    }
};


export const getLabelFromList = (
    value: string,
    list: { label: string; value: string }[]
): string => {
    const item = list.find((x) => x.value === value);
    return item?.label || "Unknown";
};
