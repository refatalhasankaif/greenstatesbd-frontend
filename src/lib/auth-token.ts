
const TOKEN_KEY = "auth_token";
const LEGACY_KEY = "token";
const MAX_AGE = 60 * 60 * 24 * 7;

export const setToken = (token: string) => {
    if (typeof document === "undefined") return;
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Strict`;
    try { localStorage.removeItem(LEGACY_KEY); } catch { }
};

export const getToken = (): string => {
    if (typeof document === "undefined") return "";

    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${TOKEN_KEY}=`));
    if (match) return match.split("=")[1];

    try {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
            setToken(legacy);
            return legacy;
        }
    } catch { }

    return "";
};

export const removeToken = () => {
    if (typeof document === "undefined") return;
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
    try { localStorage.removeItem(LEGACY_KEY); } catch { }
};