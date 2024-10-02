export class GlobalConstants {
    constructor() { }

    public static readonly DATE_TIME_FORMAT = 'YYYY-MM-ddTHH:mm:ss';
    public static readonly SNACKBAR_MSG_SHOW_DURATION: number = 1000 * 3; // 3 secs
    public static readonly LOCAL_API_BASE_URL = 'http://localhost:8080/api';
    public static readonly V1_AUTH_URL = '/v1/auth';
}