export interface RecognizerResponse {
    name?: string;
    distance?: number;
    score?: number;
    version?: string;
    quality?: number;
    message?: string;
}

export interface RecognizerError {
    message?: string;
    description?: string;
    error?: string;
    distance?: number;
    quality?: number;
}