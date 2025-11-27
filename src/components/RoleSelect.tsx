import { USER_ROLES, ROLE_NAMES } from "@/lib/constants/roles";

interface RoleSelectProps {
  selectedRoles: number[];
  onChange: (roles: number[]) => void;
  disabled?: boolean;
  className?: string;
}

export function RoleSelect({
  selectedRoles,
  onChange,
  disabled = false,
  className = "",
}: RoleSelectProps) {
  const roles = [
    { id: USER_ROLES.ADMIN, name: ROLE_NAMES[USER_ROLES.ADMIN] },
    { id: USER_ROLES.ONG, name: ROLE_NAMES[USER_ROLES.ONG] },
    { id: USER_ROLES.ORGANIZATION, name: ROLE_NAMES[USER_ROLES.ORGANIZATION] },
    { id: USER_ROLES.DIRECTOR, name: ROLE_NAMES[USER_ROLES.DIRECTOR] },
  ];

  const handleToggle = (roleId: number) => {
    if (selectedRoles.includes(roleId)) {
      onChange(selectedRoles.filter((id) => id !== roleId));
    } else {
      onChange([...selectedRoles, roleId]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {roles.map((role) => (
        <label
          key={role.id}
          className="flex items-center space-x-2 cursor-pointer hover:bg-accent/50 p-2 rounded-md transition-colors"
        >
          <input
            type="checkbox"
            checked={selectedRoles.includes(role.id)}
            onChange={() => handleToggle(role.id)}
            disabled={disabled}
            className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {role.name}
          </span>
        </label>
      ))}
    </div>
  );
}
