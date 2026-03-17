import { UserProfileProps } from "../../../type/user";

export default function UserProfile({ name, image }: UserProfileProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center text-sm">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          name[0]
        )}
      </div>
      <span className="text-sm">{name}</span>
    </div>
  );
}
