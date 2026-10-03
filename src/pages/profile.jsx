import { useEffect, useState } from "react";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        fetch("http://127.0.0.1:5000/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch profile");
            }

            return response.json();
        })
        .then(data => {
            console.log("Profile:", data);
            setProfile(data);
        })
        .catch(error => {
            console.error(error);
            setError(error.message);
        });

    }, []);

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!profile) {
        return <h2>Loading profile...</h2>;
    }

    return (
        <div>
            <h1>Profile</h1>

            <p>
                Name: {profile.user.name}
            </p>

            <p>
                Email: {profile.user.email}
            </p>
        </div>
    );
}

export default Profile;