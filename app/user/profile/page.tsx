import { Metadata } from "next";
// Removed SessionProvider import since it's now provided globally
import ProfileForm from "./profile-form";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Customer Profile",
};

const Profile = async () => {
  const session = await auth();

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h2 className="h2-bold">Profile</h2>
      <ProfileForm session={session} />
    </div>
  );
};

export default Profile;
