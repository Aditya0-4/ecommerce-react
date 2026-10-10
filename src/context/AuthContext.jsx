
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext();

// Read the token's expiry time from its JWT payload.
function getTokenExpiry(token) {
    try {
        const parts = token.split(".");

        if (parts.length !== 3) {
            return null;
        }

        const base64 = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const padded = base64.padEnd(
            Math.ceil(base64.length / 4) * 4,
            "="
        );

        const payload = JSON.parse(atob(padded));

        if (typeof payload.exp !== "number") {
            return null;
        }

        return payload.exp * 1000;
    } catch {
        return null;
    }
}

// Load only a token that has not expired.
function getValidStoredToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    const expiry = getTokenExpiry(token);

    if (!expiry || Date.now() >= expiry) {
        localStorage.removeItem("token");
        return null;
    }

    return token;
}

function getTokenPayload(token) {
    try {
        const base64 = token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const padded = base64.padEnd(
            Math.ceil(base64.length / 4) * 4,
            "="
        );

        return JSON.parse(atob(padded));
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(getValidStoredToken);

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const login = (accessToken) => {
        const expiry = getTokenExpiry(accessToken);

        // Do not store malformed or already-expired tokens.
        if (!expiry || Date.now() >= expiry) {
            logout();
            return false;
        }

        localStorage.setItem("token", accessToken);
        setToken(accessToken);

        return true;
    };

    // Automatically remove the token when it expires.
    useEffect(() => {
        if (!token) {
            return;
        }

        const expiry = getTokenExpiry(token);

        if (!expiry || Date.now() >= expiry) {
            logout();
            return;
        }

        const timeoutId = setTimeout(() => {
            logout();
        }, expiry - Date.now());

        return () => clearTimeout(timeoutId);
    }, [token]);

    const isLoggedIn = Boolean(token);
    const payload = token ? getTokenPayload(token) : null;
    const isAdmin = payload?.role === "admin";

    return (
        <AuthContext.Provider
            value={{
                token,
                isLoggedIn,
                login,
                logout,
                isAdmin
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
