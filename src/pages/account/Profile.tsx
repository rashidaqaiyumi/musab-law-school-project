import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      if (!uid) {
        window.location.href = "/login?next=/account/profile";
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();

      if (error) {
        console.log(error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    })();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id;

    const updatedProfile = {
      full_name: (e.target as any).full_name.value,
      phone: (e.target as any).phone.value,
    };

    const { error } = await supabase
      .from("profiles")
      .update(updatedProfile)
      .eq("id", uid);

    if (error) {
      console.log(error.message);
    } else {
      alert("Profile updated successfully!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl mb-6">Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label>Full Name</label>
            <input type="text" name="full_name" defaultValue={profile?.full_name} className="w-full" />
          </div>
          <div>
            <label>Phone</label>
            <input type="text" name="phone" defaultValue={profile?.phone} className="w-full" />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
}
