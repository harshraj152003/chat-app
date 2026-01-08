import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const hasNameChanged = name.trim() !== (authUser?.fullName || "");
    const hasBioChanged = bio.trim() !== (authUser?.bio || "");
    const hasImageChanged = selectedImage !== null;

    if (!hasNameChanged && !hasBioChanged && !hasImageChanged) {
      toast.error("No changes made");
      return;
    }

    setLoading(true);
    try {
      let payload = { fullName: name, bio };

      if (selectedImage) {
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(selectedImage);
        });
        payload.profilePic = base64Image;
      }

      const success = await updateProfile(payload);
      if (success) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black flex items-center justify-center p-4">
      {/* Toaster removed from here to prevent logic/UI conflicts */}
      
      <div className="w-full max-w-4xl bg-[#0f172a]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row shadow-black/60 animate-in fade-in zoom-in duration-500">
        
        <div className="w-full md:w-2/5 bg-black/20 p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/[0.08] relative group">
          <div className="relative">
            <div className="absolute -inset-4 bg-indigo-500/10 rounded-full animate-pulse blur-xl"></div>
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : authUser.profilePic || assets.logo_icon}
              className="relative w-48 h-48 md:w-64 md:h-64 object-cover rounded-[2rem] border-2 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
              alt="Profile"
            />
          </div>
          <p className="mt-8 text-indigo-300/60 text-xs font-bold tracking-[0.2em] uppercase">Orbiter Profile</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-8 md:p-14 flex flex-col gap-8 justify-center">
          <div className="space-y-2">
            <h3 className="text-4xl font-bold text-white tracking-tight">Settings</h3>
            <p className="text-gray-500 text-sm">Manage your Orbit identity and bio.</p>
          </div>

          <div className="space-y-5">
            <label htmlFor="avatar" className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/10 border-dashed rounded-2xl cursor-pointer hover:bg-white/[0.07] transition-all group">
              <input onChange={(e) => setSelectedImage(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />
              <div className="bg-indigo-500/20 p-2 rounded-xl">
                <img src={assets.avatar_icon} className="w-5 h-5 invert opacity-80" alt="upload" />
              </div>
              <span className="text-gray-300 text-sm font-medium">Update Orbital Avatar</span>
            </label>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest ml-1">Display Name</label>
              <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Enter your name" className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all placeholder:text-gray-700" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest ml-1">About You</label>
              <textarea onChange={(e) => setBio(e.target.value)} value={bio} required placeholder="Tell the galaxy about yourself..." className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all resize-none placeholder:text-gray-700" rows={3}></textarea>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-indigo-500/20 transition-all transform active:scale-[0.98]">
            {loading ? "Saving..." : "Save Orbital Data"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;