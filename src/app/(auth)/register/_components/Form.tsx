"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RegisterSchema } from "@/validation/auth/auth";
import { RegisterAction } from "../../_actions/auth.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const Form = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const handleRegister = async () => {
    const data = {
      name,
      email,
      password,
      role,
    };
    const validation = RegisterSchema.safeParse(data);
    if (!validation.success) {
      validation.error.issues.forEach((issue: { message: string }) => {
        toast.error(issue.message, {
          position: "top-center",
          duration: 3000,
          style: {
            background: "red",
            color: "#fff",
          },
        });
      });
      return;
    }
    const response = await RegisterAction(data);
    if (response.error) {
      toast.error(response.error, {
        position: "top-center",
        duration: 3000,
        style: {
          background: "red",
          color: "#fff",
        },
      });
      return;
    } else {
      toast.success("Register successful", {
        position: "top-center",
        duration: 3000,
        style: {
          background: "green",
          color: "#fff",
        },
      });
      router.push("/login");
    }
  };
  return (
    <div className="max-w-md mx-auto rounded-lg shadow-md w-full border bg-card/60">
      <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
        Register
      </h1>
      <form className="space-y-4">
        <Input
          type="text"
          placeholder="Name"
          className="w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          className="w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="w-full flex justify-center items-center">
          <Select value={role} onValueChange={(value) => setRole(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
              <SelectItem value="PROVIDER">Provider</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={() => {
            handleRegister();
          }}
          variant="default"
        >
          Register
        </Button>
      </form>
    </div>
  );
};

export default Form;
