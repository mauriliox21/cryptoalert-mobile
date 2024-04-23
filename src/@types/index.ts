
export type AlertResponse = {
    id: number;
    tpAlert: "TO_UP"|"TO_DOWN";
    nrTargetValue: number;
    isActive: boolean;
    cryptocurrency: CryptocurrencyResponse;
}

export type CryptocurrencyResponse = {
    id: number;
    nmCryptocurrency: string;
    txPathIcon: string;
    txSymbol: string;
}

export type DetailsUserResponse = {
    id: number;
    nmUser: string;
    txEmail: string;
    txRole: string;
}

export type DefaultGetResponse<T = any> = {
    content: T[],
    first: boolean,
    last: boolean,
    size: number,
    totalPages: number,
    totalElements: number,
    page: number,
    pageElements: number
}

export type DefaultErrorResponse = {
    path: string,
    method: string,
    status: number,
    message: string,
    errors?: Map<string, string>
}