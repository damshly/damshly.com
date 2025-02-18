export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    first_name : string;
    last_name : string;
    date_of_birth : Date;
    bio : string;
    updated_at: Date;
    last_login : Date;
    status : string;
    account_type : string;
    is_verified : boolean;
    privacy_settings : string;
    profile_picture : string;
    location : string;
    contact_number : string;
}