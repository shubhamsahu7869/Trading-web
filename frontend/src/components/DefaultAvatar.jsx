import { UserRound } from "lucide-react";

export default function DefaultAvatar({ name = "User" }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 text-3xl font-black text-white shadow-lg">
      {initials || <UserRound size={42} />}
    </div>
  );
}
