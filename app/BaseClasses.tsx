export type employee_to_manager_row = {
    id: string;
    employee_id: string;
    manager_id: string;
    req_status: string;
    request_initiator: string;
    event_id: string;
    event_title: string;
    event_metadata: {
        description: string;
        location: string;
        startDate: string;
        endDate: string;
        freelancer: [{ role: string; number: number; price: number }];
        image: string;
    };
}

export type event_row = {
    id: string;
    manager_id: string;
    startDate: string;
    endDate: string;
    title: string;
    metadata: {
        description: string;
        location: string;
        image?: string | null;
        freelancer: [{ role: string; number: number; price: number }];
    }
}