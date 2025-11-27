"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { USER_ROLES } from "@/lib/constants/roles";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterForm } from "@/lib/validations/auth";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUser } from "@/services/users";
import { RoleSelect } from "@/components/RoleSelect";

export default function UserFormPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedRoles, setSelectedRoles] = useState<number[]>([
    USER_ROLES.ONG,
  ]);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      await createUser({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        roles: selectedRoles,
      });

      toast.success("Usuario creado");
      router.push("/users");
    } catch (err) {
      console.error("Create user error", err);
      toast.error("Error al crear usuario");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Usuario
          </h1>
          <p className="text-gray-600">Crea un nuevo usuario del sistema</p>
        </div>

        {loading ? (
          <div className="text-center">Cargando...</div>
        ) : user ? (
          <RequireAuth allowedRoles={[USER_ROLES.ADMIN]}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 bg-white p-6 rounded shadow"
              >
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...form.register("firstName")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input {...form.register("lastName")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input type="email" {...form.register("email")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...form.register("password")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <RoleSelect
                      selectedRoles={selectedRoles}
                      onChange={setSelectedRoles}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <div className="flex justify-end">
                  <Button type="submit">Crear Usuario</Button>
                </div>
              </form>
            </Form>
          </RequireAuth>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Para crear un usuario, por favor inicia sesión
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
