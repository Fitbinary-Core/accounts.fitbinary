export enum BusinessSize {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    ENTERPRISE = "ENTERPRISE",
}

export enum BusinessTypes {
    FITNESS = "FITNESS",
    PHARMACY = "PHARMACY",
    SHOES = "SHOES",
    JEWELRY = "JEWELRY",
    ELECTRONICS = "ELECTRONICS",
}

export interface Tenant {
    first_name: string;
    middle_name?: string;
    last_name: string;
    phone: string;
    email: string;
    role: string;
    onboarding_completed: boolean;
    _id: string;
}

export interface OrganizationType {
    // Basic Info
    business_name: string;
    business_logo?: string;
    business_description: string;
    business_type: BusinessTypes;
    business_size: BusinessSize;
    main_branch?: string;
    tenant: string;

    // Contact Details
    business_email: string;
    business_phone: string;

    // Address Details
    country: string;
    state: string;
    district: string;
    municipality: string;
    location: string;
    landmark: string;

    // Metadata
    timezone: string;
    currency: string;
}

export interface OrganizationDetails {
    business: OrganizationType;
    is_completed: boolean;
    is_business_details_completed: boolean;
    path: string;
}

export interface Country {
    code: string;
    id: string;
    name: string;
    flag: string;
    label: string;
    value: string;
}

export interface Countries {
    countries: Country[];
}

export interface District {
    id: string;
    name: string;
    stateId: string;
}

export interface Districtes {
    districties: District[];
}

export interface State {
    countryId: string;
    id: string;
    name: string;
}

export interface States {
    states: State[];
}

export interface AddressDetailsArr {
    countries: Countries[];
    districts: Districtes[];
    states: States[];
}

export interface Currency {
    flag: string;
    label: string;
    symbol: string;
    value: string;
}

export interface Language {
    flag: string;
    label: string;
    value: string;
}

export interface Timezone {
    description: string;
    flag: string;
    label: string;
    value: string;
}

export interface MetaDataArr {
    currencies: Currency[];
    languages: Language[];
    timezones: Timezone[];
}

export interface OnboardingFields {
    address_details: AddressDetailsArr;
    business_details: any;
    meta_data: MetaDataArr;
}

export interface LocationAndMetadataDetails {
    location_and_metadata: any;
    is_completed: boolean;
}

export interface BranchDetails {
    main_branch: any;
    is_completed: boolean;
}

export interface StepDetails {
    is_completed: boolean;
}

export interface OnboardingDataRes {
    business_details: OrganizationDetails;
    onboarding_fields_data: OnboardingFields;
    location_and_metadata_details: LocationAndMetadataDetails;
    branch_details: BranchDetails;
    categories_details: StepDetails;
    subscription_details: StepDetails;
    organizatin_subscription?: OrganizationSubscription;
    active_step_path: string;
}

export interface BusinessDetailsProps {
    business_details: OnboardingDataRes;
}

export interface LocationAndMetaDataProps {
    location_and_metadata: OnboardingDataRes;
}

// Business Details Props

export interface BusinessDetailPayload {
    business_name: string;
    business_logo: string;
    business_description: string;
    business_email: string;
    business_phone: string;
    business_size: string;
    business_type: string;
}

// Location & Metadata Details Props

export interface LocationAndMetadataDetailsPayload {
    country: string;
    state: string;
    district: string;
    municipality: string;
    location: string;
    landmark: string;
    timezone: string;
    currency: string;
}

export interface Feature {
    _id: string;
    name?: string;
    code: string;
    description?: string | null;
    subscription?: string;
    is_active?: boolean;
    value?: string | number | boolean;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface BranchDetailsProps {
    branch_details: BranchDetails;
}

export interface BranchInput {
    branch_name: string;
    branch_location: string;
    is_main: boolean;
}

export interface AppDetails {
    _id: string;
    name: string;
    description: string;
    version: string;
    baseRoute: string;
    icon: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    app_slug: string;
    __v: number;
}

export interface Subscription {
    _id: string;
    name: string;
    description: string | null;
    app: string;
    price: number;
    currency?: string;
    billingCycle?: string;
    stripePriceId?: string;
    is_active: boolean;
    is_trail?: boolean;
    sort_order: number;
    features: Feature[];
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface OrganizationSubscription {
    _id: string;
    organization: OrganizationType & {
        _id: string;
        __v: number;
        subscription_status: string;
        subscription: string;
        trial_ends_at: string;
        subscription_ends_at: string;
    };
    app: AppDetails;
    billingCycle: string;
    cancelAtPeriodEnd: boolean;
    cancelReason: string | null;
    canceledAt: string | null;
    createdAt: string;
    createdBy: string | null;
    currency: string;
    currentPeriodEnd: string;
    currentPeriodStart: string;
    discountAmount: number;
    graceUntil: string | null;
    lastWebhookEventId: string | null;
    latestInvoiceId: string;
    latestPaymentIntentId: string | null;
    plan: Subscription;
    provider: string;
    providerRefId: string | null;
    status: string;
    stripeCustomerId: string;
    stripePriceId: string | null;
    stripeSubscriptionId: string;
    taxAmount: number;
    totalAmount: number;
    trialEnd: string | null;
    trialStart: string | null;
    unitAmount: number;
    updatedAt: string;
    updatedBy: string | null;
    __v: number;
}

export interface SubscriptionRes {
    message: string;
    subscriptions: Subscription[];
}
